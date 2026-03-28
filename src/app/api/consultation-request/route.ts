import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyTelegram } from "@/lib/telegram";
import { sendConfirmationEmail } from "@/lib/email";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (!checkRateLimit(ip)) {
      // Silent rate limit: show success but don't notify
      return NextResponse.json({ status: "ok", message: "Заявку отримано" });
    }

    const body = await req.json();
    const { name, contact, preferred_time, company_url, employee_count, audit_result, source } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Введіть ваше ім'я" }, { status: 400 });
    }
    if (!contact || contact.trim().length < 3) {
      return NextResponse.json({ error: "Введіть контакт" }, { status: 400 });
    }

    // Save to DB
    await prisma.consultationRequest.create({
      data: {
        name: name.trim(),
        contact: contact.trim(),
        preferredTime: preferred_time || null,
        companyUrl: company_url || null,
        employeeCount: employee_count ? Number(employee_count) : null,
        industry: audit_result?.company?.industry || null,
        auditResult: audit_result || undefined,
        source: source || "unknown",
      },
    });

    // Notify Telegram (non-blocking)
    notifyTelegram({
      name: name.trim(),
      contact: contact.trim(),
      preferredTime: preferred_time,
      companyUrl: company_url,
      employeeCount: employee_count ? Number(employee_count) : null,
      industry: audit_result?.company?.industry || null,
      auditResult: audit_result,
      source,
    }).catch(console.error);

    // Send confirmation email (non-blocking)
    sendConfirmationEmail({
      name: name.trim(),
      contact: contact.trim(),
      preferredTime: preferred_time,
    }).catch(console.error);

    return NextResponse.json({ status: "ok", message: "Заявку отримано" });
  } catch (error) {
    console.error("Consultation request error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
