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
