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
const MAX_ATTEMPTS = 3;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      action?: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
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
function solveTurnstile(
  siteKey: string,
  action: string,
): Promise<string | null> {
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
          "error-callback": () => {
            status.textContent =
              "Не вдалося завантажити перевірку. Спробуйте за хвилину.";
          },
          "expired-callback": () => {
            status.textContent = "Перевірка застаріла — пройдіть її ще раз.";
          },
        });
      })
      .catch(() => {
        status.textContent =
          "Не вдалося завантажити перевірку. Спробуйте за хвилину.";
      });
  });
}

/** Сервер просить капчу: ключ сайту й `action` форми, інакше null. */
async function captchaChallenge(
  res: Response,
): Promise<{ siteKey: string; action: string } | null> {
  if (res.status !== 428) return null;
  try {
    const data = (await res.clone().json()) as {
      captchaRequired?: unknown;
      siteKey?: unknown;
      action?: unknown;
    };
    return data.captchaRequired === true &&
      typeof data.siteKey === "string" &&
      typeof data.action === "string"
      ? { siteKey: data.siteKey, action: data.action }
      : null;
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
    const token = await solveTurnstile(challenge.siteKey, challenge.action);
    if (!token) return res;
    const headers = new Headers(init.headers);
    headers.set(TOKEN_HEADER, token);
    res = await fetch(input, { ...init, headers });
  }
  return res;
}
