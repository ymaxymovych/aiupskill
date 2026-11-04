/**
 * Серверна перевірка токена Cloudflare Turnstile (siteverify).
 *
 * Три результати, а не два: «не пройшов» (бот або протухлий токен — показати
 * віджет ще раз) і «не змогли спитати Cloudflare» (мережа, 5xx, таймаут, немає
 * секрету) — різні речі. Друге в режимі капчі — відмова «спробуйте за хвилину»,
 * ніколи не тихий пропуск.
 *
 * Назовні йдуть рівно токен і IP відвідувача (`remoteip`) — більше нічого.
 */
import crypto from "node:crypto";

export const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 5_000;

/** Сторінки з віджетом: токен із чужого сайту з тим самим ключем не приймаємо. */
export const ALLOWED_HOSTNAMES: ReadonlySet<string> = new Set([
  "aiupskill.live",
  "www.aiupskill.live",
]);

export type TurnstileVerdict =
  | { outcome: "passed" }
  | { outcome: "failed"; errorCodes: string[] }
  | { outcome: "unavailable"; detail: string };

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
  /** `action` віджета — ім'я форми, яке сервер передав у 428. */
  expectedAction: string,
  opts: {
    secret?: string | null;
    fetchImpl?: typeof fetch;
    allowedHostnames?: ReadonlySet<string>;
  } = {},
): Promise<TurnstileVerdict> {
  const secret =
    opts.secret === undefined
      ? process.env.TURNSTILE_SECRET_KEY?.trim() || null
      : opts.secret;
  if (!secret) {
    console.error(
      "[turnstile] TURNSTILE_SECRET_KEY не задано — перевірка неможлива",
    );
    return { outcome: "unavailable", detail: "no_secret" };
  }
  // Токен Turnstile — до 2048 символів; довше — не токен.
  if (token.length > 2048)
    return { outcome: "failed", errorCodes: ["invalid-input-response"] };

  const form = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: crypto.randomUUID(),
  });
  if (remoteIp) form.set("remoteip", remoteIp);

  let res: Response;
  try {
    res = await (opts.fetchImpl ?? fetch)(SITEVERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[turnstile] siteverify недоступний", error);
    return { outcome: "unavailable", detail: "network" };
  }
  if (!res.ok) {
    console.error(`[turnstile] siteverify відповів HTTP ${res.status}`);
    return { outcome: "unavailable", detail: `http_${res.status}` };
  }

  let data: {
    success?: unknown;
    "error-codes"?: unknown;
    hostname?: unknown;
    action?: unknown;
  } | null;
  try {
    data = (await res.json()) as typeof data;
  } catch {
    return { outcome: "unavailable", detail: "bad_json" };
  }
  if (!data || typeof data !== "object") {
    return { outcome: "unavailable", detail: "bad_json" };
  }
  if (data.success === true) {
    const hosts = opts.allowedHostnames ?? ALLOWED_HOSTNAMES;
    if (typeof data.hostname !== "string" || !hosts.has(data.hostname)) {
      return { outcome: "failed", errorCodes: ["foreign-hostname"] };
    }
    if (data.action !== expectedAction) {
      return { outcome: "failed", errorCodes: ["wrong-action"] };
    }
    return { outcome: "passed" };
  }

  const errorCodes = Array.isArray(data["error-codes"])
    ? data["error-codes"].filter((c): c is string => typeof c === "string")
    : [];
  // Помилки НАШОЇ конфігурації — це не «бот», а «перевірка не працює».
  if (
    errorCodes.some(
      (c) =>
        c === "missing-input-secret" ||
        c === "invalid-input-secret" ||
        c === "internal-error",
    )
  ) {
    console.error(
      "[turnstile] siteverify відмовив через конфігурацію",
      errorCodes,
    );
    return { outcome: "unavailable", detail: errorCodes.join(",") };
  }
  return { outcome: "failed", errorCodes };
}
