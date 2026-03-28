import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function sendConfirmationEmail(data: {
  name: string;
  contact: string;
  preferredTime?: string | null;
}) {
  const r = getResend();
  if (!r) return;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact);
  if (!isEmail) return;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "noreply@aiupskill.live";

  try {
    await r.emails.send({
      from: `AI Upskill <${fromEmail}>`,
      to: data.contact,
      subject: "Ярослав з AI Upskill — ваша консультація",
      html: `
        <p>Привіт, ${data.name}!</p>
        <p>Дякую за заявку. Я зв'яжуся з вами ${data.preferredTime || "протягом 24 годин"}.</p>
        <p>На консультації ми:</p>
        <ul>
          <li>✓ Розберемо ваш бізнес і процеси</li>
          <li>✓ Покажемо повний AI-аудит (50+ автоматизацій)</li>
          <li>✓ Порахуємо точний ROI від навчання команди</li>
        </ul>
        <p>А поки — <a href="https://accelerator.aiadvisoryboard.me/register?plan=trial">спробуйте перший модуль безкоштовно →</a></p>
        <p>До зв'язку,<br>Ярослав Максимович<br>AI Upskill | aiupskill.live</p>
      `,
    });
  } catch (e) {
    console.error("Email send failed:", e);
  }
}
