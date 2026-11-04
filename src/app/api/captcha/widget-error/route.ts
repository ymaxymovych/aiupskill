/**
 * Маячок від клієнта капчі: віджет Turnstile повернув помилку конфігурації
 * (хибний ключ сайту, домен не дозволено) і токена не видасть (як у course, #4940 F5).
 * Лише код і ім'я форми, ліміт за IP, алерт раз на годину на код. Капчу НЕ вимикає.
 */
import { NextResponse } from "next/server";
import { defaultCaptchaDeps } from "@/lib/captcha/adaptiveCaptcha";

// Лише коди конфігурації Turnstile — вигаданий код не породжує новий алерт.
const CODE = /^(110[12]\d{2}|4000[27]0)$/;
const ACTION = /^[a-z0-9-]{1,32}$/;
const perIp = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  // nginx ставить X-Real-IP сам; перший X-Forwarded-For підробляє будь-хто.
  const ip = req.headers.get("x-real-ip")?.trim() || "unknown";
  const now = Date.now();
  const entry = perIp.get(ip);
  if (!entry || entry.resetAt < now) perIp.set(ip, { count: 1, resetAt: now + 3600_000 });
  else if (++entry.count > 5) return NextResponse.json({ ok: false }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { code?: unknown; action?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code : "";
  const action = typeof body?.action === "string" ? body.action : "";
  if (!CODE.test(code) || !ACTION.test(action)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await defaultCaptchaDeps.alertDeduped(
    // Один ключ на всі коди: щонайбільше один алерт на годину, скільки б IP не прийшло.
    "captcha-widget-error",
    `⚠️ Віджет Turnstile не видає токен (код ${code}, форма «${action}») — ` +
      `перевір TURNSTILE_SITE_KEY і домени віджета в Cloudflare. ` +
      `Людям показано запасний контакт; капча при цьому не вимкнена.`,
  );
  return NextResponse.json({ ok: true });
}
