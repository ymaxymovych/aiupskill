import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { callOpenRouter, parseJSONFromAI } from "@/lib/ai-client";

const INDUSTRIES = [
  { slug: "e-commerce", name: "E-commerce / Інтернет-магазин", dbCode: "ecommerce" },
  { slug: "marketynh-ahentstvo", name: "Маркетинг-агентство", dbCode: "agency" },
  { slug: "it-kompaniya", name: "IT-компанія", dbCode: "it" },
  { slug: "vyrobnytstvo", name: "Виробництво", dbCode: "manufacturing" },
  { slug: "posluhy", name: "Сфера послуг", dbCode: "services" },
  { slug: "nerukhomist", name: "Нерухомість", dbCode: "realestate" },
  { slug: "lohistyka", name: "Логістика", dbCode: "logistics" },
  { slug: "osvita", name: "Освіта / EdTech", dbCode: "education" },
  { slug: "medytsyna", name: "Медицина / Фарма", dbCode: "medical" },
  { slug: "yurysprudentsiya", name: "Юриспруденція", dbCode: "legal" },
];

const ROLES = [
  { slug: "marketoloh", name: "Маркетолог", dbCode: "marketer" },
  { slug: "prodazhi", name: "Менеджер з продажів", dbCode: "sales" },
  { slug: "hr", name: "HR-менеджер", dbCode: "hr" },
  { slug: "kerivnyk", name: "CEO / Власник", dbCode: "ceo" },
  { slug: "operatsii", name: "Операційний менеджер", dbCode: "operations" },
  { slug: "kopiraiter", name: "Копірайтер", dbCode: "copywriter" },
  { slug: "analityk", name: "Аналітик", dbCode: "analyst" },
  { slug: "bukhhalter", name: "Бухгалтер", dbCode: "accountant" },
];

const SYSTEM = `Ти генеруєш SEO-контент для порталу AI Upskill (курс AI-автоматизацій, 5 днів, від 1 999 грн/люд).
МОВА: українська. Без AI-кліше. Конкретні ланцюжки з n8n, Claude API, CRM-інтеграціями.
Відповідай ТІЛЬКИ валідним JSON.`;

// --- Generate industry hubs ---
async function generateIndustryHub(ind: typeof INDUSTRIES[0]) {
  const existing = await prisma.b2BIndustryHub.findUnique({ where: { slug: ind.slug } });
  if (existing) return { slug: ind.slug, status: "exists" };

  const prompt = `Згенеруй контент для галузевого хабу: "${ind.name}"

JSON:
{
  "intro": "3-4 речення вступу про AI-автоматизації в цій галузі",
  "processes_table": [
    {"department": "Маркетинг", "process": "Кваліфікація лідів", "chain_short": "FB Lead → n8n → AI → CRM → Email", "time_saving": "15 год/тижд", "money_saving": "~16 000 грн/міс"},
    ... (мінімум 15 рядків для різних відділів)
  ],
  "input_processing_decision_examples": [
    {"role": "Менеджер з продажів", "input": "Нова заявка", "processing": "AI кваліфікує", "decision": "Автоматична відповідь", "automation": "Webhook → AI → CRM → Email"}
  ],
  "faq": [
    {"q": "Чим AI-автоматизації відрізняються від ChatGPT?", "a": "..."},
    {"q": "Мої співробітники не технічні. Чи впораються?", "a": "..."},
    ... (5-7 питань специфічних для галузі)
  ],
  "geo_facts": [
    "Автоматизація кваліфікації лідів в ${ind.name} скорочує час реакції з 2 годин до 2 хвилин",
    ... (мінімум 10 фактів з цифрами)
  ]
}`;

  try {
    const response = await callOpenRouter({ prompt, systemPrompt: SYSTEM, maxTokens: 3000, temperature: 0.7 });
    const content = parseJSONFromAI(response);
    await prisma.b2BIndustryHub.create({
      data: { slug: ind.slug, name: ind.name, emoji: "", content: content as object },
    });
    return { slug: ind.slug, status: "created" };
  } catch (e) {
    return { slug: ind.slug, status: `error: ${e instanceof Error ? e.message : "unknown"}` };
  }
}

// --- Generate role pages ---
async function generateRolePage(ind: typeof INDUSTRIES[0], role: typeof ROLES[0]) {
  const existing = await prisma.b2BRolePage.findFirst({
    where: { industrySlug: ind.slug, roleSlug: role.slug },
  });
  if (existing) return { key: `${ind.slug}/${role.slug}`, status: "exists" };

  const prompt = `Згенеруй контент для рольової сторінки: "${role.name}" в "${ind.name}"

JSON:
{
  "top5_automations": [
    {
      "name": "Автоматична кваліфікація лідів",
      "problem": "2-3 речення з цифрами",
      "chain_steps": [
        {"step": "Тригер", "tool": "Facebook Lead Ad", "what": "нова заявка"},
        {"step": "Збір даних", "tool": "n8n", "what": "збір контактних даних"},
        {"step": "AI-обробка", "tool": "Claude API", "what": "скоринг та кваліфікація"},
        {"step": "Дія", "tool": "Pipedrive API", "what": "створення угоди"},
        {"step": "Результат", "tool": "Gmail API", "what": "персоналізована відповідь"}
      ],
      "results": {"time_before": "2 години", "time_after": "2 хвилини", "saving_hours_week": 15, "saving_usd_month": 800}
    },
    ... (5 штук, різних)
  ],
  "input_processing_decision": [
    {"task": "Обробка заявок", "input": "нова заявка", "processing": "AI кваліфікує", "decision": "автоматична відповідь", "without_ai": "20 хвилин", "with_ai": "2 хвилини"},
    ... (3-4 приклади)
  ],
  "other_tasks": [
    "Задача — ланцюжок скорочено — N год/тижд",
    ... (10-15 штук)
  ],
  "faq": [
    {"q": "...", "a": "..."},
    ... (3-5 питань специфічних для ролі в галузі)
  ]
}`;

  try {
    const response = await callOpenRouter({ prompt, systemPrompt: SYSTEM, maxTokens: 3000, temperature: 0.7 });
    const content = parseJSONFromAI(response);
    await prisma.b2BRolePage.create({
      data: { industrySlug: ind.slug, roleSlug: role.slug, content: content as object },
    });
    return { key: `${ind.slug}/${role.slug}`, status: "created" };
  } catch (e) {
    return { key: `${ind.slug}/${role.slug}`, status: `error: ${e instanceof Error ? e.message : "unknown"}` };
  }
}

export async function POST(req: Request) {
  const { secret, type, batchSize = 5, offset = 0 } = await req.json();

  if (secret !== process.env.OPENROUTER_API_KEY?.slice(0, 10)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (type === "industry_hubs") {
    const batch = INDUSTRIES.slice(offset, offset + batchSize);
    const results = [];
    for (const ind of batch) {
      results.push(await generateIndustryHub(ind));
    }
    return NextResponse.json({
      type: "industry_hubs",
      total: INDUSTRIES.length,
      offset,
      processed: results,
      nextOffset: offset + batchSize < INDUSTRIES.length ? offset + batchSize : null,
    });
  }

  if (type === "role_pages") {
    // Flatten all combos
    const allCombos: { ind: typeof INDUSTRIES[0]; role: typeof ROLES[0] }[] = [];
    for (const ind of INDUSTRIES) {
      for (const role of ROLES) {
        allCombos.push({ ind, role });
      }
    }
    const batch = allCombos.slice(offset, offset + batchSize);
    const results = [];
    for (const { ind, role } of batch) {
      results.push(await generateRolePage(ind, role));
    }
    return NextResponse.json({
      type: "role_pages",
      total: allCombos.length,
      offset,
      processed: results,
      nextOffset: offset + batchSize < allCombos.length ? offset + batchSize : null,
    });
  }

  return NextResponse.json({ error: "type must be 'industry_hubs' or 'role_pages'" }, { status: 400 });
}
