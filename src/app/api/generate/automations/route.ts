import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { callOpenRouter, parseJSONFromAI } from "@/lib/ai-client";

// List of 150 automations to generate (from TZ C6.4)
const AUTOMATIONS_LIST = [
  // Leads & Sales (20)
  { name: "Автоматична кваліфікація лідів з Facebook Lead Ads", category: "leads", roles: ["marketer", "sales"], complexity: "medium" },
  { name: "Автоматичний follow-up для необроблених лідів", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "AI-скоринг лідів за текстом заявки", category: "leads", roles: ["sales", "marketer"], complexity: "medium" },
  { name: "Автоматична відповідь на заявку з сайту за 2 хвилини", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "Персоналізована email-серія для nurturing", category: "leads", roles: ["marketer", "sales"], complexity: "medium" },
  { name: "Автоматичне призначення лідів менеджерам", category: "leads", roles: ["sales", "operations"], complexity: "low" },
  { name: "Чат-бот кваліфікація через Telegram", category: "leads", roles: ["sales"], complexity: "medium" },
  { name: "AI-генерація комерційних пропозицій", category: "leads", roles: ["sales"], complexity: "high" },
  { name: "Автоматичне оновлення статусів угод в CRM", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "AI-аналіз запису дзвінка з витягуванням дій", category: "leads", roles: ["sales", "operations"], complexity: "high" },
  // Content & Marketing (10 sample)
  { name: "Автоматична генерація описів товарів", category: "content", roles: ["copywriter", "marketer"], complexity: "medium" },
  { name: "Масова генерація SEO мета-тегів", category: "content", roles: ["marketer", "copywriter"], complexity: "low" },
  { name: "Автоматичне створення постів для соцмереж", category: "content", roles: ["copywriter", "marketer"], complexity: "medium" },
  { name: "Генерація email-розсилок з персоналізацією", category: "content", roles: ["marketer"], complexity: "medium" },
  { name: "AI-аналіз відгуків клієнтів з категоризацією", category: "content", roles: ["marketer", "analyst"], complexity: "medium" },
  // HR (5 sample)
  { name: "Автоматичний скринінг резюме з AI-оцінкою", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "Генерація описів вакансій", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "Онбординг-ланцюжок для нового співробітника", category: "hr", roles: ["hr", "operations"], complexity: "medium" },
  // Analytics (5 sample)
  { name: "Автоматичний щотижневий звіт по KPI", category: "analytics", roles: ["analyst", "ceo"], complexity: "medium" },
  { name: "AI-виявлення аномалій в даних продажів", category: "analytics", roles: ["analyst", "sales"], complexity: "high" },
  // Finance (3 sample)
  { name: "Автоматична категоризація витрат", category: "finance", roles: ["accountant"], complexity: "low" },
  { name: "Парсинг PDF-рахунків в таблицю", category: "documents", roles: ["accountant"], complexity: "medium" },
  { name: "AI-прогнозування cash flow", category: "finance", roles: ["accountant", "ceo"], complexity: "high" },
  // Operations (3 sample)
  { name: "Автоматичний збір daily standup від команди", category: "operations", roles: ["operations", "ceo"], complexity: "low" },
  { name: "AI-аналіз продуктивності по відділах", category: "operations", roles: ["ceo", "operations"], complexity: "medium" },
];

function slugify(name: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
    ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
    м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu",
    я: "ya", "'": "", "ʼ": "",
  };
  return name
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

const SYSTEM_PROMPT = `Ти генеруєш контент для сторінки конкретної AI-автоматизації на SEO-порталі B2B курсу AI Upskill.

КОНТЕКСТ КУРСУ:
- Курс навчає будувати AI-автоматизаційні ланцюжки (n8n, vibe-coding, API)
- Тривалість: 5 днів, 10 годин, 5 модулів
- Ціна: від $49 до $99 за людину
- Перша автоматизація — вже в перший день

ПРАВИЛА:
1. Кожен крок ланцюжка — конкретний інструмент: n8n, Claude API, Gmail API, Telegram Bot API, Pipedrive API, Google Sheets API тощо.
2. НІКОЛИ не писати: "AI допоможе", "впровадження AI", "використання ChatGPT", "в умовах цифрової трансформації"
3. Цифри ROI — реалістичні для України
4. Принцип 30% деталей: показуємо ЩО, ховаємо ЯК
5. МОВА: українська, без AI-маркерів
6. Мінімум 5 фактів з цифрами

Відповідай ТІЛЬКИ JSON без markdown.`;

export async function POST(req: Request) {
  const { secret, batchSize = 5, offset = 0 } = await req.json();

  if (secret !== process.env.OPENROUTER_API_KEY?.slice(0, 10)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batch = AUTOMATIONS_LIST.slice(offset, offset + batchSize);
  const results: { name: string; slug: string; status: string }[] = [];

  for (const auto of batch) {
    const slug = slugify(auto.name);

    // Check if already exists
    const existing = await prisma.b2BAutomation.findUnique({ where: { slug } });
    if (existing) {
      results.push({ name: auto.name, slug, status: "exists" });
      continue;
    }

    try {
      const prompt = `Згенеруй контент для автоматизації: "${auto.name}"
Категорія: ${auto.category}
Ролі: ${auto.roles.join(", ")}
Складність: ${auto.complexity}

JSON формат:
{
  "problem": "3-4 речення з конкретними цифрами",
  "steps": [
    {"step": "Тригер", "tool": "Facebook Lead Ads", "description": "Нова заявка з реклами"},
    {"step": "Збір даних", "tool": "n8n HTTP Request", "description": "..."},
    {"step": "AI-обробка", "tool": "Claude API через n8n", "description": "..."},
    {"step": "Дія", "tool": "Pipedrive API", "description": "..."},
    {"step": "Результат", "tool": "Gmail API", "description": "..."}
  ],
  "results": {"Час реакції": "з 2 год → 2 хв", "Економія": "15 год/тижд", "ROI": "$800/міс"},
  "hours_saved_week": 15,
  "money_saved_month": 800,
  "build_time_hours": 4,
  "tools": ["n8n", "Claude API", "Pipedrive"],
  "industry_examples": {"E-commerce": "...", "IT": "...", "Нерухомість": "..."}
}`;

      const aiResponse = await callOpenRouter({
        prompt,
        systemPrompt: SYSTEM_PROMPT,
        maxTokens: 2000,
        temperature: 0.7,
      });
      const content = parseJSONFromAI(aiResponse);

      await prisma.b2BAutomation.create({
        data: {
          slug,
          name: auto.name,
          category: auto.category,
          departments: [auto.category],
          industries: ["all"],
          roles: auto.roles,
          complexity: auto.complexity,
          content: content as object,
          hoursSavedWeek: (content as Record<string, number>).hours_saved_week || 10,
          moneySavedMonth: (content as Record<string, number>).money_saved_month || 500,
          buildTimeHours: (content as Record<string, number>).build_time_hours || 4,
          tools: (content as Record<string, string[]>).tools || ["n8n", "Claude API"],
          isActive: true,
        },
      });

      results.push({ name: auto.name, slug, status: "created" });
    } catch (error) {
      results.push({
        name: auto.name,
        slug,
        status: `error: ${error instanceof Error ? error.message : "unknown"}`,
      });
    }
  }

  return NextResponse.json({
    total: AUTOMATIONS_LIST.length,
    offset,
    batchSize,
    processed: results,
    nextOffset: offset + batchSize < AUTOMATIONS_LIST.length ? offset + batchSize : null,
  });
}
