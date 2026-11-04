export async function notifyCaptchaAlert(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN не задано для алерта капчі");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.CAPTCHA_ALERT_CHAT_ID || "-1003557288154",
      message_thread_id: Number(process.env.CAPTCHA_ALERT_THREAD_ID || 8),
      text,
    }),
    signal: AbortSignal.timeout(5_000),
  });
  const result = (await response.json()) as { ok?: boolean };
  if (!response.ok || result.ok !== true) {
    throw new Error("Telegram не прийняв алерт капчі");
  }
}

export async function notifyTelegram(data: {
  name: string;
  contact: string;
  preferredTime?: string | null;
  companyUrl?: string | null;
  employeeCount?: number | null;
  industry?: string | null;
  auditResult?: {
    summary?: {
      annual_savings_usd?: number;
    };
  } | null;
  source?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = `🔔 *Нова заявка на консультацію!*

*Ім'я:* ${data.name}
*Контакт:* ${data.contact}
*Зручний час:* ${data.preferredTime || "Не вказано"}
*Компанія:* ${data.companyUrl || "Не вказано"}
*Співробітників:* ${data.employeeCount || "Не вказано"}
*Галузь:* ${data.industry || "Не визначено"}
*AI-аудит:* ${data.auditResult ? "Пройдений ✅" : "Ні"}
${data.auditResult?.summary?.annual_savings_usd ? `*Потенційна економія:* ${data.auditResult.summary.annual_savings_usd.toLocaleString("uk-UA")} грн/рік` : ""}
*Джерело CTA:* ${data.source || "unknown"}`;

  try {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch (e) {
    console.error("Telegram notification failed:", e);
  }
}
