import { NextResponse } from "next/server";
import { callOpenRouter, parseJSONFromAI } from "@/lib/ai-client";
import {
  AUTOMATIONS,
  selectTopAutomations,
  type DepartmentCode,
  type IndustryCode,
} from "@/lib/automations-db";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 10): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (val.resetAt < now) rateLimitMap.delete(key);
  }
}, 600_000);

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 3000);
}

function sanitize(text: string, maxLen = 200): string {
  return text.replace(/[<>{}[\]]/g, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

const DEFAULT_DEPARTMENTS: { code: DepartmentCode; name: string; ratio: number }[] = [
  { code: "marketing", name: "Маркетинг", ratio: 0.15 },
  { code: "sales", name: "Продажі", ratio: 0.2 },
  { code: "development", name: "Розробка", ratio: 0.2 },
  { code: "hr", name: "HR", ratio: 0.08 },
  { code: "finance", name: "Фінанси", ratio: 0.07 },
  { code: "operations", name: "Операції/Адмін", ratio: 0.1 },
  { code: "management", name: "Керівництво", ratio: 0.05 },
];

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Забагато запитів. Спробуйте через годину." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const websiteUrl = body.website_url ? sanitize(body.website_url, 500) : null;
    const employeeCount = Math.max(1, Math.min(100000, Number(body.employee_count) || 10));
    const manualIndustry = body.industry ? sanitize(body.industry, 50) : null;
    const manualDepartments = body.departments || null;

    let companyContext = "";
    let companyName = "";
    let industryCode: IndustryCode = "other";
    let companyDescription = "";
    let departments: { code: DepartmentCode; name: string; count: number; icon: string }[] = [];

    // Fetch website if provided
    if (websiteUrl && /^https?:\/\//.test(websiteUrl)) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const siteRes = await fetch(websiteUrl, {
          signal: controller.signal,
          headers: { "User-Agent": "Mozilla/5.0 (compatible; AIUpskillBot/1.0)" },
        });
        clearTimeout(timeout);
        companyContext = stripHtml(await siteRes.text());
      } catch {
        // Website fetch failed, proceed without context
      }
    }

    // Try AI analysis for company parsing
    if (companyContext || manualIndustry) {
      try {
        const prompt = companyContext
          ? `Ти аналізуєш вебсайт компанії для AI-аудиту. На основі контенту визнач:
1. Назву компанії
2. Галузь (одна з: ecommerce, agency, it_software, manufacturing, services, real_estate, logistics, education, healthcare, legal, other)
3. Короткий опис діяльності (1 речення)
4. Ймовірну структуру відділів для компанії на ${employeeCount} людей

Контент сайту: ${companyContext}

Відповідь ТІЛЬКИ JSON:
{
  "name": "назва компанії",
  "industry_code": "код_галузі",
  "description": "опис",
  "departments": [
    {"name": "назва відділу", "code": "marketing|sales|hr|finance|development|operations|support|legal|management", "estimated_count": число, "icon": "emoji"}
  ]
}`
          : `Створи типову структуру компанії у галузі "${manualIndustry}" на ${employeeCount} людей.

Відповідь ТІЛЬКИ JSON:
{
  "name": "Типова компанія",
  "industry_code": "код_галузі з: ecommerce, agency, it_software, manufacturing, services, real_estate, logistics, education, healthcare, legal, other",
  "description": "опис галузі",
  "departments": [
    {"name": "назва відділу", "code": "marketing|sales|hr|finance|development|operations|support|legal|management", "estimated_count": число, "icon": "emoji"}
  ]
}`;

        const aiResponse = await callOpenRouter({
          systemPrompt: "You are an AI business analyst. Always respond in Ukrainian. Respond ONLY with valid JSON.",
          prompt,
          maxTokens: 1000,
          temperature: 0.5,
        });

        const parsed = parseJSONFromAI<{
          name?: string;
          industry_code?: string;
          description?: string;
          departments?: { name: string; code: string; estimated_count: number; icon: string }[];
        }>(aiResponse);

        companyName = parsed.name || "";
        industryCode = (parsed.industry_code as IndustryCode) || "other";
        companyDescription = parsed.description || "";
        departments = (parsed.departments || []).map((d) => ({
          code: d.code as DepartmentCode,
          name: d.name,
          count: d.estimated_count,
          icon: d.icon || "",
        }));
      } catch (e) {
        console.error("AI company parse error:", e);
      }
    }

    // Fallback departments if AI didn't provide them
    if (departments.length === 0) {
      departments = DEFAULT_DEPARTMENTS.map((d) => ({
        code: d.code,
        name: d.name,
        count: Math.max(1, Math.round(employeeCount * d.ratio)),
        icon: "",
      }));
    }

    // Use manual departments if provided (refinement)
    if (manualDepartments && Array.isArray(manualDepartments)) {
      departments = manualDepartments.map((d: { code: string; name: string; count: number }) => ({
        code: d.code as DepartmentCode,
        name: d.name,
        count: d.count,
        icon: "",
      }));
    }

    // Select top automations
    const topAutomations = selectTopAutomations(
      industryCode,
      departments.map((d) => ({ code: d.code, count: d.count })),
      employeeCount
    );

    // Calculate ROI
    const totalHoursPerWeek = topAutomations.reduce((sum, a) => sum + a.hoursPerWeek, 0);
    const avgHourlyRate = 208; // conservative 208 грн/год (35000/168) for Ukraine market
    const annualSavings = Math.round(totalHoursPerWeek * 52 * avgHourlyRate);
    const trainingCost = employeeCount <= 1 ? 79 : employeeCount <= 5 ? 290 : employeeCount <= 30 ? 1900 : 3500;
    const paybackDays = annualSavings > 0 ? Math.ceil((trainingCost / annualSavings) * 365) : 999;
    const teamMultiplier = Math.round((1 + totalHoursPerWeek / (employeeCount * 40)) * 10) / 10;

    const totalAutomationsAvailable = AUTOMATIONS.filter(
      (a) => a.industries.includes(industryCode) || a.industries.includes("all")
    ).length;

    return NextResponse.json({
      status: "ok",
      company: {
        name: companyName,
        industry: industryCode,
        description: companyDescription,
        employee_count: employeeCount,
        departments,
      },
      top_automations: topAutomations.map((a) => ({
        department: a.department,
        title: a.title,
        description: a.description,
        hours_saved_per_week: a.hoursPerWeek,
      })),
      total_automations_available: totalAutomationsAvailable,
      summary: {
        total_hours_saved_per_week: totalHoursPerWeek,
        annual_savings_usd: annualSavings,
        training_cost_usd: trainingCost,
        payback_days: paybackDays,
        team_multiplier: teamMultiplier,
      },
    });
  } catch (error) {
    console.error("AI audit error:", error);
    return NextResponse.json({ status: "error", message: "Помилка аналізу" }, { status: 500 });
  }
}
