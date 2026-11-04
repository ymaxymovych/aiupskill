/**
 * Адаптивна капча Cloudflare Turnstile на публічних формах (2026-11-04).
 *
 * Звичайний відвідувач капчі не бачить. Режим «потрібна капча» вмикається для
 * ОДНІЄЇ форми, коли за останні 10 хв спрацювала хоч одна умова:
 *   1. подань форми більше ніж max(5, 3 × звичний максимум за 14 днів);
 *   2. з однієї мережі /24 (IPv6 — /48) більше 3 подань;
 *   3. сторож SEC-45 уже позначив адресу пробником (`seclogProbers.ts`).
 * Режим тримається 60 хв після ОСТАННЬОГО спрацювання. Увімкнення і вимкнення —
 * рівно одне повідомлення в топік алертів (атомарний перехід `episodeOpen`).
 *
 * Причина: 04.11.2026 бот із ротацією проксі слав сміттєві заявки; ліміти за IP
 * не тримають, бо кожна заявка — з нової адреси.
 *
 * У режимі сервер вимагає заголовок `x-turnstile-token` і перевіряє його через
 * siteverify разом з IP відвідувача. Без токена — 428 `{captchaRequired, siteKey}`;
 * клієнт (`fetchWithCaptcha.ts`) показує віджет і повторює запит сам.
 * Cloudflare недоступний або ключі не налаштовані → заявку ПРИЙМАЄМО з позначкою
 * `captchaUnavailable` і алертом (як у course, гейт #4940 F5); явне «не пройдено» → 428.
 * (fail-closed). Поза режимом гейт лише рахує подання — форма працює як раніше.
 *
 * Сховище — та сама PostgreSQL aiupskill, що й `rateLimit.ts` (Redis у курсі немає).
 * Вимикач: env `ADAPTIVE_CAPTCHA_DISABLED=1` (дефолт — увімкнено).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { EMAIL, TELEGRAM_URL } from "@/lib/constants";
import { notifyCaptchaAlert } from "@/lib/telegram";
import { isHostingIp } from "./hostingAsn";
import { isSeclogProber } from "./seclogProbers";
import { verifyTurnstileToken, type TurnstileVerdict } from "./turnstileVerify";

export const WINDOW_MS = 10 * 60_000;
export const BASELINE_MS = 14 * 24 * 60 * 60_000;
export const MODE_HOLD_MS = 60 * 60_000;
export const FORM_FLOOR = 5;
export const BASELINE_MULTIPLIER = 3;
export const NET_LIMIT = 3;
export const HIT_RETENTION_MS = 15 * 24 * 60 * 60_000;

export const TOKEN_HEADER = "x-turnstile-token";

/**
 * Адреси наших власних серверів: заявки, які `apps/web` пересилає в курс, мають
 * саме таку «клієнтську» IP. Це не мережа відвідувача, тож у пороги /24 вони не
 * входять і в siteverify як `remoteip` не йдуть.
 */
const OWN_PROXY_IPS = new Set(["77.42.36.142", "127.0.0.1", "::1"]);

/** Форми з віджетом (= `action`). Маячок приймає лише їх (як у course, #4940 r3). */
export const CAPTCHA_FORMS = ["aiupskill-consultation", "aiupskill-ai-audit"] as const;
export type CaptchaForm = (typeof CAPTCHA_FORMS)[number];

export function isCaptchaForm(value: string): value is CaptchaForm {
  return (CAPTCHA_FORMS as readonly string[]).includes(value);
}

export type CaptchaReason = "volume" | "network" | "prober";

export type CaptchaMode = { activeUntil: Date } | null;

export type CaptchaStore = {
  recordHit(form: string, net: string | null, at: Date): Promise<string>;
  countSince(
    form: string,
    net: string | null,
    since: Date,
  ): Promise<{ form: number; net: number }>;
  /** Найбільша кількість подань в одному 10-хв відрізку в [from, to), без аномальних. */
  baselineMax(form: string, from: Date, to: Date): Promise<number>;
  markAnomalous(form: string, since: Date): Promise<void>;
  markVerified(hitId: string): Promise<void>;
  markUnavailable(hitId: string): Promise<void>;
  getMode(form: string): Promise<CaptchaMode>;
  /** Продовжує режим; true рівно тоді, коли ЦЕЙ виклик відкрив новий епізод. */
  trigger(form: string, until: Date, reason: CaptchaReason): Promise<boolean>;
  /** Закриває прострочені епізоди; повертає кожен закритий рівно один раз. */
  closeExpired(
    now: Date,
  ): Promise<
    {
      form: string;
      reason: string;
      startedAt: Date | null;
      activeUntil: Date;
    }[]
  >;
  prune(before: Date): Promise<void>;
};

export type CaptchaDeps = {
  store: CaptchaStore;
  verify: (
    token: string,
    remoteIp: string | null,
    action: string,
  ) => Promise<TurnstileVerdict>;
  isProber: (ip: string | null) => Promise<boolean>;
  /** Мережа дата-центру (`hostingAsn.ts`) — капча завжди, без режиму форми. */
  isHosting: (ip: string | null) => Promise<boolean>;
  alert: (text: string) => Promise<void>;
  /** Той самий алерт, але не частіше разу на годину на `key`. */
  alertDeduped: (key: string, text: string) => Promise<void>;
  enabled: () => Promise<boolean>;
  siteKey: () => string | null;
  /** Чи заданий серверний секрет siteverify. Без нього режим не вмикається. */
  secretConfigured: () => boolean;
  now: () => Date;
};

export type CaptchaInput = {
  form: string;
  ip: string | null;
  token: string | null;
  /**
   * Чи рахувати мережу й позначки SEC-45. `false` — коли IP належить не
   * відвідувачу, а відправнику-серверу (HMAC-ingest).
   */
  trustIp?: boolean;
  /**
   * Відправник-сервер сам показав Turnstile і пройшов siteverify
   * (`turnstileVerified: true` у пейлоаді ingest) — у режимі це рівносильно токену.
   */
  preVerified?: boolean;
};

export type CaptchaDecision =
  | { ok: true; mode: "off" | "verified" | "unavailable" }
  | {
      ok: false;
      status: 428;
      body: {
        captchaRequired: true;
        siteKey: string;
        action: string;
        error: string;
        contact: CaptchaContact;
      };
    };

/** Запасний контакт для людини, у якої віджет не завантажився (як у course, #4940 F5). */
export type CaptchaContact = {
  telegram: string;
  telegramUrl: string;
  phone: string;
  phoneHref: string;
};
export const CAPTCHA_CONTACT: CaptchaContact = {
  telegram: `@${TELEGRAM_URL.split("/").pop()}`,
  telegramUrl: TELEGRAM_URL,
  // Телефону на сайті немає — у цьому полі пошта (клієнт пише «напишіть на»).
  phone: EMAIL,
  phoneHref: `mailto:${EMAIL}`,
};

export const CAPTCHA_REQUIRED_TEXT =
  "Підтвердіть, що ви не робот, і надішліть форму ще раз.";

/** Мережа для порогу: /24 для IPv4, /48 для IPv6; null — невідома або наш проксі. */
export function networkOf(ip: string | null): string | null {
  if (!ip || OWN_PROXY_IPS.has(ip)) return null;
  const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0/24`;
  if (ip.includes(":")) {
    const head = expandV6(ip)?.slice(0, 3);
    return head ? `${head.join(":")}::/48` : null;
  }
  return null;
}

function expandV6(ip: string): string[] | null {
  const [left, right, extra] = ip.split("::");
  if (extra !== undefined) return null;
  const l = left ? left.split(":") : [];
  const r = right !== undefined && right ? right.split(":") : [];
  const fill = right !== undefined ? 8 - l.length - r.length : 0;
  if (fill < 0) return null;
  const parts = [...l, ...Array(fill).fill("0"), ...r];
  return parts.length === 8
    ? parts.map((p) => p.replace(/^0+(?=.)/, ""))
    : null;
}

export function formThreshold(baseline: number): number {
  return Math.max(FORM_FLOOR, BASELINE_MULTIPLIER * baseline);
}

const REASON_TEXT: Record<CaptchaReason, string> = {
  volume: "аномально багато подань",
  network: `понад ${NET_LIMIT} подань з однієї мережі за 10 хв`,
  prober: "адреса з позначкою сторожа SEC-45",
};

export async function evaluateCaptcha(
  deps: CaptchaDeps,
  input: CaptchaInput,
): Promise<CaptchaDecision> {
  if (!(await deps.enabled())) return { ok: true, mode: "off" };

  const now = deps.now();
  await sweepCaptchaModes(deps);

  const trustIp = input.trustIp !== false;
  const net = trustIp ? networkOf(input.ip) : null;
  const hitId = await deps.store.recordHit(input.form, net, now);
  const mode = await deps.store.getMode(input.form);
  const modeActive = !!mode && mode.activeUntil > now;
  // Хостингова мережа — постійний тригер для ЦЬОГО запиту: режим форми не
  // вмикає й алертів не шле, лише вимагає токен.
  const hosting =
    trustIp &&
    !!input.ip &&
    !OWN_PROXY_IPS.has(input.ip) &&
    (await deps.isHosting(input.ip));
  const active = modeActive || hosting;

  if (active && input.preVerified) {
    await deps.store.markVerified(hitId);
    return { ok: true, mode: "verified" };
  }

  // Токен має значення лише в режимі: поза ним форма працює як раніше, а
  // підроблений заголовок не звільняє запит від підрахунку.
  if (active && input.token) {
    const verdict = await deps.verify(
      input.token,
      trustIp && input.ip && !OWN_PROXY_IPS.has(input.ip) ? input.ip : null,
      input.form,
    );
    if (verdict.outcome === "unavailable") {
      return failOpen(deps, hitId, input.form, `siteverify: ${verdict.detail}`);
    }
    if (verdict.outcome === "passed") {
      await deps.store.markVerified(hitId);
      return { ok: true, mode: "verified" };
    }
  }

  const since = new Date(now.getTime() - WINDOW_MS);
  const counts = await deps.store.countSince(input.form, net, since);
  let reason: CaptchaReason | null = null;
  if (counts.net > NET_LIMIT) reason = "network";
  else if (trustIp && (await deps.isProber(input.ip))) reason = "prober";
  else if (counts.form > FORM_FLOOR) {
    // Базу рахуємо лише коли форма вже над підлогою: у тиху годину це зайвий запит.
    const baseline = await deps.store.baselineMax(
      input.form,
      new Date(now.getTime() - BASELINE_MS),
      since,
    );
    if (counts.form > formThreshold(baseline)) reason = "volume";
  }

  if (reason) {
    await deps.store.markAnomalous(input.form, since);
    // Ключів немає — режим не вмикаємо взагалі: прийом з прапорцем і алертом.
    const missing = missingKey(deps);
    if (missing) return failOpen(deps, hitId, input.form, missing);
    const until = new Date(now.getTime() + MODE_HOLD_MS);
    const opened = await deps.store.trigger(input.form, until, reason);
    if (opened) {
      await safeAlert(
        deps,
        `🛡 Капча Turnstile УВІМКНЕНА на формі «${input.form}»: ${REASON_TEXT[reason]} ` +
          `(за 10 хв: ${counts.form} подань, з однієї мережі: ${counts.net}). ` +
          `Тримається 60 хв після останнього спрацювання.`,
      );
    }
    return required(deps, hitId, input.form);
  }

  return active
    ? required(deps, hitId, input.form)
    : { ok: true, mode: "off" };
}

function missingKey(deps: CaptchaDeps): string | null {
  if (!deps.siteKey()) return "TURNSTILE_SITE_KEY не задано";
  if (!deps.secretConfigured()) return "TURNSTILE_SECRET_KEY не задано";
  return null;
}

async function required(
  deps: CaptchaDeps,
  hitId: string,
  form: string,
): Promise<CaptchaDecision> {
  const missing = missingKey(deps);
  const siteKey = deps.siteKey();
  if (missing || !siteKey)
    return failOpen(deps, hitId, form, missing ?? "TURNSTILE_SITE_KEY не задано");
  return {
    ok: false,
    status: 428,
    body: {
      captchaRequired: true,
      siteKey,
      action: form,
      error: CAPTCHA_REQUIRED_TEXT,
      contact: CAPTCHA_CONTACT,
    },
  };
}

/** Капча потрібна, але перевірити неможливо: приймаємо, позначаємо, гучно алертимо. */
async function failOpen(
  deps: CaptchaDeps,
  hitId: string,
  form: string,
  detail: string,
): Promise<CaptchaDecision> {
  console.error(`[captcha] перевірка недоступна (${detail}) — приймаю заявку «${form}» без капчі`);
  await deps.store.markUnavailable(hitId);
  try {
    await deps.alertDeduped(
      `captcha-unavailable:${detail.split(":")[0]}`,
      `🚨 Капча Turnstile потрібна, але перевірка недоступна (${detail}). ` +
        `Заявки на формі «${form}» приймаються БЕЗ капчі, доки це не полагоджено.`,
    );
  } catch (error) {
    console.error("[captcha] алерт про недоступність не пішов", error);
  }
  return { ok: true, mode: "unavailable" };
}

async function safeAlert(deps: CaptchaDeps, text: string): Promise<void> {
  try {
    await deps.alert(text);
  } catch (error) {
    console.error("[captcha] алерт у Telegram не пішов", error);
  }
}

/**
 * Текст алерту вимкнення. Природне вимкнення — `activeUntil` щонайменше на
 * 60 хв пізніше за початок епізоду (кожне спрацювання ставить «зараз + 60 хв»).
 * Коротше — строк зсунули вручну, і текст каже це прямо. Ручні тестові
 * вмикання (`reason` = `manual…`) позначаються «[TEST]».
 */
export function offAlertText(
  c: { form: string; reason: string; startedAt: Date | null; activeUntil: Date },
  now: Date,
): string {
  const test = /^(manual|test)/i.test(c.reason) ? "[TEST] " : "";
  const lasted = c.startedAt
    ? ` Режим діяв ${Math.round((now.getTime() - c.startedAt.getTime()) / 60_000)} хв.`
    : "";
  const natural =
    !c.startedAt ||
    c.activeUntil.getTime() - c.startedAt.getTime() >= MODE_HOLD_MS - 60_000;
  return natural
    ? `${test}✅ Капча Turnstile вимкнена на формі «${c.form}»: після останньої аномалії минуло 60 хв, нових не було.${lasted}`
    : `${test}✅ Капча Turnstile вимкнена на формі «${c.form}» достроково — строк режиму скорочено вручну.${lasted}`;
}

/** Закрити прострочені режими й повідомити про кожне вимкнення рівно раз. */
export async function closeExpiredModes(
  deps: Pick<CaptchaDeps, "store" | "alert">,
  now: Date,
): Promise<number> {
  const closed = await deps.store.closeExpired(now);
  for (const c of closed) await safeAlert(deps as CaptchaDeps, offAlertText(c, now));
  return closed.length;
}

// ── Prisma-сховище ──────────────────────────────────────────────────────────

export const prismaCaptchaStore: CaptchaStore = {
  async recordHit(form, net, at) {
    const row = await prisma.publicFormHit.create({
      data: { form, net, createdAt: at },
      select: { id: true },
    });
    return row.id;
  },
  async countSince(form, net, since) {
    const rows = await prisma.$queryRaw<{ form: bigint; net: bigint }[]>`
      SELECT COUNT(*) AS "form",
             COUNT(*) FILTER (WHERE ${net}::text IS NOT NULL AND "net" = ${net}) AS "net"
      FROM "PublicFormHit"
      WHERE "form" = ${form} AND "createdAt" >= ${since} AND "verified" = false
    `;
    return { form: Number(rows[0]?.form ?? 0), net: Number(rows[0]?.net ?? 0) };
  },
  async baselineMax(form, from, to) {
    const rows = await prisma.$queryRaw<{ max: bigint | null }[]>`
      SELECT MAX(c) AS "max" FROM (
        SELECT COUNT(*) OVER (
          ORDER BY "createdAt"
          RANGE BETWEEN CURRENT ROW AND INTERVAL '10 minutes' FOLLOWING
        ) AS c
        FROM "PublicFormHit"
        WHERE "form" = ${form} AND "anomalous" = false AND "verified" = false
          AND "createdAt" >= ${from} AND "createdAt" < ${to}
      ) t
    `;
    return Number(rows[0]?.max ?? 0);
  },
  async markAnomalous(form, since) {
    await prisma.publicFormHit.updateMany({
      where: { form, createdAt: { gte: since }, anomalous: false },
      data: { anomalous: true },
    });
  },
  async markVerified(hitId) {
    await prisma.publicFormHit.update({
      where: { id: hitId },
      data: { verified: true },
    });
  },
  async markUnavailable(hitId) {
    await prisma.publicFormHit.update({
      where: { id: hitId },
      data: { captchaUnavailable: true },
    });
  },
  async getMode(form) {
    return prisma.publicFormCaptchaMode.findUnique({
      where: { form },
      select: { activeUntil: true },
    });
  },
  async trigger(form, until, reason) {
    await prisma.publicFormCaptchaMode.upsert({
      where: { form },
      create: { form, activeUntil: until, reason },
      update: { activeUntil: until, reason },
    });
    // Відкриття епізоду — окремий умовний UPDATE: під рядковим блокуванням його
    // виграє рівно один із паралельних запитів, тож алерт не дублюється.
    const opened = await prisma.publicFormCaptchaMode.updateMany({
      where: { form, episodeOpen: false },
      data: { episodeOpen: true, episodeStartedAt: new Date() },
    });
    return opened.count === 1;
  },
  async closeExpired(now) {
    return prisma.$queryRaw<
      {
        form: string;
        reason: string;
        startedAt: Date | null;
        activeUntil: Date;
      }[]
    >`
      UPDATE "PublicFormCaptchaMode"
      SET "episodeOpen" = false, "updatedAt" = ${now}
      WHERE "episodeOpen" = true AND "activeUntil" <= ${now}
      RETURNING "form", "reason", "episodeStartedAt" AS "startedAt", "activeUntil"
    `;
  },
  async prune(before) {
    await prisma.publicFormHit.deleteMany({
      where: { createdAt: { lt: before } },
    });
  },
};

const unavailableAlertAt = new Map<string, number>();

export const defaultCaptchaDeps: CaptchaDeps = {
  store: prismaCaptchaStore,
  verify: (token, remoteIp, action) =>
    verifyTurnstileToken(token, remoteIp, action),
  isProber: isSeclogProber,
  isHosting: isHostingIp,
  alert: (text) => notifyCaptchaAlert(`${text} (aiupskill.live)`),
  alertDeduped: async (key, text) => {
    // Один процес pm2 — достатньо пам'яті процесу: раз на годину на причину.
    const last = unavailableAlertAt.get(key) ?? 0;
    if (Date.now() - last < 60 * 60_000) return;
    unavailableAlertAt.set(key, Date.now());
    await defaultCaptchaDeps.alert(text);
  },
  enabled: async () => process.env.ADAPTIVE_CAPTCHA_DISABLED !== "1",
  siteKey: () => process.env.TURNSTILE_SITE_KEY?.trim() || null,
  secretConfigured: () => !!process.env.TURNSTILE_SECRET_KEY?.trim(),
  now: () => new Date(),
};

/**
 * Гейт для роута публічної форми. Повертає `null`, коли заявку можна обробляти
 * далі, інакше — готову відповідь 428.
 */
export async function requireAdaptiveCaptcha(
  req: Request,
  form: CaptchaForm,
  deps: CaptchaDeps = defaultCaptchaDeps,
): Promise<NextResponse | null> {
  const decision = await evaluateCaptcha(deps, {
    form,
    ip: req.headers.get("x-real-ip")?.trim() || null,
    token: req.headers.get(TOKEN_HEADER)?.trim() || null,
  });
  return decisionResponse(decision);
}

export function decisionResponse(
  decision: CaptchaDecision,
): NextResponse | null {
  if (decision.ok) return null;
  return NextResponse.json(decision.body, { status: decision.status });
}

/** Періодичне прибирання: вимкнення прострочених режимів і старих подань. */
export async function sweepCaptchaModes(
  deps: CaptchaDeps = defaultCaptchaDeps,
): Promise<number> {
  const now = deps.now();
  const closed = await closeExpiredModes(deps, now);
  await deps.store.prune(new Date(now.getTime() - HIT_RETENTION_MS));
  return closed;
}
