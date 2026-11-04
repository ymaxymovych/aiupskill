/**
 * Клієнтська половина адаптивної капчі (`adaptiveCaptcha.ts`).
 *
 * Звичайний `fetch`, поки сервер не відповів 428 `{captchaRequired, siteKey}`.
 * Тоді поверх сторінки показується віджет Cloudflare Turnstile; щойно людина
 * пройшла перевірку, той самий запит (те саме тіло — введені тексти не
 * губляться) повторюється із заголовком `x-turnstile-token`. Закрив віджет —
 * повертається відповідь 428, і форма показує її `error` як звичайну помилку.
 *
 * Тіло запиту має бути повторно відправним (рядок JSON, FormData) — так шлють
 * усі наші форми.
 */
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_HEADER = "x-turnstile-token";
const WIDGET_ERROR_URL = "/api/captcha/widget-error";

/** Запасний контакт, який сервер кладе в 428 (з констант сайту). */
type Contact = {
  telegram: string;
  telegramUrl: string;
  phone: string;
  phoneHref: string;
};
type Challenge = { siteKey: string; action: string; contact: Contact | null };

/**
 * Коди Turnstile, що означають НАШУ конфігурацію (хибний ключ сайту, домен не
 * дозволено, ключ вимкнено), а не проблему людини: віджет токена не видасть
 * ніколи. Про такі сервер має дізнатися (маячок → алерт у топік 8).
 */
const CONFIG_ERROR = /^(110[12]\d{2}|4000[27]0)$/;
const MAX_ATTEMPTS = 3;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action?: string;
      callback: (token: string) => void;
      "error-callback"?: (code?: string) => void;
      "expired-callback"?: () => void;
      language?: string;
    },
  ) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_URL;
      s.async = true;
      s.onload = () =>
        window.turnstile
          ? resolve(window.turnstile)
          : reject(new Error("turnstile api missing"));
      s.onerror = () => {
        scriptPromise = null;
        reject(new Error("turnstile script failed"));
      };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

/** Показати віджет; resolve(token) або resolve(null), якщо людина закрила вікно. */
/**
 * Віджет не видає токена: людина бачить, що сталося і куди написати, а
 * заповнена форма під вікном лишається як є (гейт #4940 F5). Обходу капчі тут
 * немає — лише контакт і «Скасувати».
 */
function showFallback(status: HTMLElement, contact: Contact | null): void {
  status.textContent = "Не вдалося завантажити перевірку. Введене у формі збережено.";
  if (!contact) return;
  const line = document.createElement("span");
  line.append(document.createElement("br"), "Напишіть нам у Telegram ");
  const tg = document.createElement("a");
  tg.href = contact.telegramUrl;
  tg.target = "_blank";
  tg.rel = "noopener";
  tg.textContent = contact.telegram;
  const phone = document.createElement("a");
  phone.href = contact.phoneHref;
  phone.textContent = contact.phone;
  line.append(tg, " або напишіть на ", phone, ".");
  status.append(line);
}

function reportWidgetError(code: string, action: string): void {
  // Без PII: лише код помилки й ім'я форми. Помилка маячка нічого не ламає.
  fetch(WIDGET_ERROR_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, action }),
    keepalive: true,
  }).catch(() => undefined);
}

function solveTurnstile({
  siteKey,
  action,
  contact,
}: Challenge): Promise<string | null> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:rgba(15,15,20,.55);padding:16px";
    const card = document.createElement("div");
    card.style.cssText =
      "background:#fff;color:#111;border-radius:14px;padding:20px;max-width:360px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,.25);font:15px/1.4 system-ui,sans-serif;text-align:center";
    const title = document.createElement("p");
    title.textContent =
      "Підтвердіть, що ви не робот — і ми одразу надішлемо форму.";
    title.style.cssText = "margin:0 0 14px";
    const box = document.createElement("div");
    box.style.cssText = "display:flex;justify-content:center;min-height:65px";
    const status = document.createElement("p");
    status.style.cssText = "margin:10px 0 0;font-size:13px;color:#b42318";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Скасувати";
    cancel.style.cssText =
      "margin-top:12px;background:none;border:0;color:#555;text-decoration:underline;cursor:pointer;font:inherit";
    card.append(title, box, status, cancel);
    overlay.append(card);
    document.body.append(overlay);

    let widgetId: string | null = null;
    let reported = false;
    const done = (token: string | null) => {
      try {
        if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      } catch {
        /* віджет уже прибрано */
      }
      overlay.remove();
      resolve(token);
    };
    cancel.onclick = () => done(null);

    loadTurnstile()
      .then((api) => {
        widgetId = api.render(box, {
          sitekey: siteKey,
          action,
          language: document.documentElement.lang || "auto",
          callback: (token) => done(token),
          "error-callback": (code?: string) => {
            showFallback(status, contact);
            const c = String(code ?? "");
            if (CONFIG_ERROR.test(c) && !reported) {
              reported = true;
              reportWidgetError(c, action);
            }
          },
          "expired-callback": () => {
            status.textContent = "Перевірка застаріла — пройдіть її ще раз.";
          },
        });
      })
      .catch(() => showFallback(status, contact));
  });
}

/** Сервер просить капчу: ключ сайту й `action` форми, інакше null. */
async function captchaChallenge(
  res: Response,
): Promise<Challenge | null> {
  if (res.status !== 428) return null;
  try {
    const data = (await res.clone().json()) as {
      captchaRequired?: unknown;
      siteKey?: unknown;
      action?: unknown;
      contact?: Partial<Contact> | null;
    };
    if (
      data.captchaRequired !== true ||
      typeof data.siteKey !== "string" ||
      typeof data.action !== "string"
    )
      return null;
    const c = data.contact;
    const contact =
      c &&
      typeof c.telegram === "string" &&
      typeof c.telegramUrl === "string" &&
      typeof c.phone === "string" &&
      typeof c.phoneHref === "string"
        ? (c as Contact)
        : null;
    return { siteKey: data.siteKey, action: data.action, contact };
  } catch {
    return null;
  }
}

export async function fetchWithCaptcha(
  input: string,
  init: RequestInit = {},
): Promise<Response> {
  let res = await fetch(input, init);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const challenge = await captchaChallenge(res);
    if (!challenge) return res;
    const token = await solveTurnstile(challenge);
    if (!token) return res;
    const headers = new Headers(init.headers);
    headers.set(TOKEN_HEADER, token);
    res = await fetch(input, { ...init, headers });
  }
  return res;
}
