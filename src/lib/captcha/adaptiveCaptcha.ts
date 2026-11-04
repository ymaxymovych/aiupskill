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
 * Cloudflare недоступний або ключі не налаштовані → 503 «спробуйте за хвилину»
 * (fail-closed). Поза режимом гейт лише рахує подання — форма працює як раніше.
 *
 * Сховище — та сама PostgreSQL aiupskill, що й `rateLimit.ts` (Redis у курсі немає).
 * Вимикач: env `ADAPTIVE_CAPTCHA_DISABLED=1` (дефолт — увімкнено).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyCaptchaAlert } from "@/lib/telegram";
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
  getMode(form: string): Promise<CaptchaMode>;
  /** Продовжує режим; true рівно тоді, коли ЦЕЙ виклик відкрив новий епізод. */
  trigger(form: string, until: Date, reason: CaptchaReason): Promise<boolean>;
  /** Закриває прострочені епізоди; повертає кожен закритий рівно один раз. */
  closeExpired(
    now: Date,
  ): Promise<{ form: string; reason: string; startedAt: Date | null }[]>;
  prune(before: Date): Promise<void>;
};

export type CaptchaDeps = {
  store: CaptchaStore;
  verify: (token: string, remoteIp: string | null) => Promise<TurnstileVerdict>;
  isProber: (ip: string | null) => Promise<boolean>;
  alert: (text: string) => Promise<void>;
  enabled: () => Promise<boolean>;
  siteKey: () => string | null;
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
  | { ok: true; mode: "off" | "verified" }
  | {
      ok: false;
      status: 428;
      body: { captchaRequired: true; siteKey: string; error: string };
    }
  | { ok: false; status: 503; body: { error: string } };

export const CAPTCHA_REQUIRED_TEXT =
  "Підтвердіть, що ви не робот, і надішліть форму ще раз.";
export const CAPTCHA_UNAVAILABLE_TEXT =
  "Не вдалося перевірити, що ви не робот. Спробуйте за хвилину.";

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
  const active = !!mode && mode.activeUntil > now;

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
    );
    if (verdict.outcome === "unavailable") return unavailable();
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
    return required(deps);
  }

  return active ? required(deps) : { ok: true, mode: "off" };
}

function required(deps: CaptchaDeps): CaptchaDecision {
  const siteKey = deps.siteKey();
  if (!siteKey) {
    console.error(
      "[captcha] режим увімкнено, але ключі Turnstile не задано — відмовляю",
    );
    return unavailable();
  }
  return {
    ok: false,
    status: 428,
    body: { captchaRequired: true, siteKey, error: CAPTCHA_REQUIRED_TEXT },
  };
}

function unavailable(): CaptchaDecision {
  return { ok: false, status: 503, body: { error: CAPTCHA_UNAVAILABLE_TEXT } };
}

async function safeAlert(deps: CaptchaDeps, text: string): Promise<void> {
  try {
    await deps.alert(text);
  } catch (error) {
    console.error("[captcha] алерт у Telegram не пішов", error);
  }
}

/** Закрити прострочені режими й повідомити про кожне вимкнення рівно раз. */
export async function closeExpiredModes(
  deps: Pick<CaptchaDeps, "store" | "alert">,
  now: Date,
): Promise<number> {
  const closed = await deps.store.closeExpired(now);
  for (const c of closed) {
    const minutes = c.startedAt
      ? Math.round((now.getTime() - c.startedAt.getTime()) / 60_000)
      : null;
    await safeAlert(
      deps as CaptchaDeps,
      `✅ Капча Turnstile вимкнена на формі «${c.form}»: 60 хв без аномалій` +
        (minutes !== null ? ` (режим тривав ${minutes} хв).` : "."),
    );
  }
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
        SELECT COUNT(*) AS c
        FROM "PublicFormHit"
        WHERE "form" = ${form} AND "anomalous" = false
          AND "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY FLOOR(EXTRACT(EPOCH FROM "createdAt") / 600)
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
      { form: string; reason: string; startedAt: Date | null }[]
    >`
      UPDATE "PublicFormCaptchaMode"
      SET "episodeOpen" = false, "updatedAt" = ${now}
      WHERE "episodeOpen" = true AND "activeUntil" <= ${now}
      RETURNING "form", "reason", "episodeStartedAt" AS "startedAt"
    `;
  },
  async prune(before) {
    await prisma.publicFormHit.deleteMany({
      where: { createdAt: { lt: before } },
    });
  },
};

export const defaultCaptchaDeps: CaptchaDeps = {
  store: prismaCaptchaStore,
  verify: (token, remoteIp) => verifyTurnstileToken(token, remoteIp),
  isProber: isSeclogProber,
  alert: (text) => notifyCaptchaAlert(`${text} (aiupskill.live)`),
  enabled: async () => process.env.ADAPTIVE_CAPTCHA_DISABLED !== "1",
  siteKey: () =>
    process.env.TURNSTILE_SECRET_KEY?.trim()
      ? process.env.TURNSTILE_SITE_KEY?.trim() || null
      : null,
  now: () => new Date(),
};

/**
 * Гейт для роута публічної форми. Повертає `null`, коли заявку можна обробляти
 * далі, інакше — готову відповідь 428/503.
 */
export async function requireAdaptiveCaptcha(
  req: Request,
  form: string,
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
