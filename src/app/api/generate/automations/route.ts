import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { callOpenRouter, parseJSONFromAI } from "@/lib/ai-client";

// Full 150 automations from TZ C6.4
const AUTOMATIONS_LIST = [
  // Leads & Sales (20)
  { name: "Автоматична кваліфікація лідів з Facebook Lead Ads", category: "leads", roles: ["marketer", "sales"], complexity: "medium" },
  { name: "Автоматичний follow-up для необроблених лідів", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "AI-скоринг лідів за текстом заявки", category: "leads", roles: ["sales", "marketer"], complexity: "medium" },
  { name: "Автоматична відповідь на заявку з сайту за 2 хвилини", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "Персоналізована email-серія для nurturing", category: "leads", roles: ["marketer", "sales"], complexity: "medium" },
  { name: "Автоматичне призначення лідів менеджерам", category: "leads", roles: ["sales", "operations"], complexity: "low" },
  { name: "Чат-бот кваліфікація через Telegram", category: "leads", roles: ["sales"], complexity: "medium" },
  { name: "Автоматичний збір лідів з Google Forms в CRM", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "AI-генерація комерційних пропозицій", category: "leads", roles: ["sales"], complexity: "high" },
  { name: "Автоматичне оновлення статусів угод в CRM", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "Парсинг email-запитів та автоматична маршрутизація", category: "leads", roles: ["sales", "operations"], complexity: "medium" },
  { name: "Автоматична підготовка follow-up після зустрічі", category: "leads", roles: ["sales"], complexity: "medium" },
  { name: "AI-аналіз запису дзвінка з витягуванням дій", category: "leads", roles: ["sales", "operations"], complexity: "high" },
  { name: "Автоматичне створення задач після дзвінка", category: "leads", roles: ["sales"], complexity: "low" },
  { name: "Мультиканальний follow-up email плюс Telegram", category: "leads", roles: ["sales"], complexity: "medium" },
  { name: "Автоматичний збір контактів з Google Maps", category: "leads", roles: ["sales"], complexity: "medium" },
  { name: "LinkedIn outreach з AI-персоналізацією", category: "leads", roles: ["sales", "marketer"], complexity: "high" },
  { name: "Автоматична підготовка презентації під клієнта", category: "leads", roles: ["sales"], complexity: "high" },
  { name: "AI-прогнозування ймовірності закриття угоди", category: "leads", roles: ["sales", "analyst"], complexity: "high" },
  { name: "Автоматичне оновлення pipeline-звіту для CEO", category: "leads", roles: ["sales", "ceo"], complexity: "medium" },
  // Content & Marketing (20)
  { name: "Автоматична генерація описів товарів", category: "content", roles: ["copywriter", "marketer"], complexity: "medium" },
  { name: "Масова генерація SEO мета-тегів", category: "content", roles: ["marketer", "copywriter"], complexity: "low" },
  { name: "Автоматичне створення постів для соцмереж", category: "content", roles: ["copywriter", "marketer"], complexity: "medium" },
  { name: "AI-рерайт контенту під різні платформи", category: "content", roles: ["copywriter"], complexity: "low" },
  { name: "Автоматичний переклад контенту UA та EN", category: "content", roles: ["copywriter"], complexity: "low" },
  { name: "Генерація email-розсилок з персоналізацією", category: "content", roles: ["marketer"], complexity: "medium" },
  { name: "Автоматичний щотижневий дайджест для клієнтів", category: "content", roles: ["marketer"], complexity: "medium" },
  { name: "AI-генерація варіантів рекламних текстів", category: "content", roles: ["marketer", "copywriter"], complexity: "medium" },
  { name: "Автоматичний звіт по ефективності контенту", category: "content", roles: ["marketer", "analyst"], complexity: "medium" },
  { name: "Генерація FAQ на основі звернень клієнтів", category: "content", roles: ["copywriter"], complexity: "medium" },
  { name: "Автоматичне створення карток товарів для маркетплейсів", category: "content", roles: ["marketer"], complexity: "medium" },
  { name: "AI-аналіз відгуків клієнтів з категоризацією", category: "content", roles: ["marketer", "analyst"], complexity: "medium" },
  { name: "Автоматичний моніторинг згадок бренду", category: "content", roles: ["marketer"], complexity: "medium" },
  { name: "Генерація сценаріїв для відео-контенту", category: "content", roles: ["copywriter"], complexity: "medium" },
  { name: "Автоматична оптимізація заголовків за CTR", category: "content", roles: ["marketer", "copywriter"], complexity: "medium" },
  { name: "AI-генерація креативів для реклами", category: "content", roles: ["marketer"], complexity: "high" },
  { name: "Контент-план на місяць з AI-генерацією", category: "content", roles: ["marketer", "copywriter"], complexity: "medium" },
  { name: "Автоматична публікація в кілька соцмереж", category: "content", roles: ["marketer"], complexity: "low" },
  { name: "AI-аналіз контенту конкурентів", category: "content", roles: ["marketer", "analyst"], complexity: "high" },
  { name: "Автоматичний ресайз банерів під різні платформи", category: "content", roles: ["marketer"], complexity: "low" },
  // HR (15)
  { name: "Автоматичний скринінг резюме з AI-оцінкою", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "Генерація описів вакансій", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "Автоматична відповідь кандидатам", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "AI-формування питань для інтервю", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "Автоматичне збирання рефералів з Telegram", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "Онбординг-ланцюжок для нового співробітника", category: "hr", roles: ["hr", "operations"], complexity: "medium" },
  { name: "Автоматичне створення щомісячного HR-звіту", category: "hr", roles: ["hr", "analyst"], complexity: "medium" },
  { name: "AI-аналіз пульс-опитувань", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "Автоматичне нагадування про випробувальні терміни", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "Парсинг резюме з email в базу", category: "hr", roles: ["hr"], complexity: "medium" },
  { name: "AI-порівняння кандидатів по критеріях", category: "hr", roles: ["hr"], complexity: "high" },
  { name: "Автоматичний збір фідбеку після інтервю", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "Генерація офферів з шаблонів", category: "hr", roles: ["hr"], complexity: "low" },
  { name: "Автоматичний трекінг відпусток та лікарняних", category: "hr", roles: ["hr", "operations"], complexity: "low" },
  { name: "Автоматична перевірка рекомендацій", category: "hr", roles: ["hr"], complexity: "medium" },
  // Analytics (15)
  { name: "Автоматичний щотижневий звіт по KPI", category: "analytics", roles: ["analyst", "ceo"], complexity: "medium" },
  { name: "AI-аналіз даних з Google Analytics", category: "analytics", roles: ["analyst", "marketer"], complexity: "medium" },
  { name: "Автоматична звітність по рекламних кампаніях", category: "analytics", roles: ["marketer", "analyst"], complexity: "medium" },
  { name: "Зведений дашборд з кількох джерел", category: "analytics", roles: ["analyst", "ceo"], complexity: "high" },
  { name: "Автоматичне порівняння план та факт", category: "analytics", roles: ["analyst", "ceo"], complexity: "medium" },
  { name: "AI-виявлення аномалій в даних продажів", category: "analytics", roles: ["analyst", "sales"], complexity: "high" },
  { name: "Автоматичний звіт по NPS та CSAT", category: "analytics", roles: ["analyst"], complexity: "medium" },
  { name: "Конкурентний моніторинг цін з алертами", category: "analytics", roles: ["analyst", "marketer"], complexity: "high" },
  { name: "Автоматична підготовка звіту для інвестора", category: "analytics", roles: ["analyst", "ceo"], complexity: "high" },
  { name: "AI-прогнозування трендів", category: "analytics", roles: ["analyst"], complexity: "high" },
  { name: "Автоматичний збір даних з кількох CRM", category: "analytics", roles: ["analyst", "operations"], complexity: "medium" },
  { name: "AI-сегментація клієнтської бази", category: "analytics", roles: ["analyst", "marketer"], complexity: "high" },
  { name: "Автоматичний когортний аналіз", category: "analytics", roles: ["analyst"], complexity: "high" },
  { name: "Звіт по unit-економіці з автооновленням", category: "analytics", roles: ["analyst", "ceo"], complexity: "high" },
  { name: "AI-рекомендації по оптимізації воронки", category: "analytics", roles: ["analyst", "marketer"], complexity: "high" },
  // Documents & Back-office (15)
  { name: "Автоматичне заповнення шаблонів договорів", category: "documents", roles: ["accountant", "operations"], complexity: "medium" },
  { name: "AI-перевірка документів на помилки", category: "documents", roles: ["accountant"], complexity: "medium" },
  { name: "Автоматичний реєстр кореспонденції", category: "documents", roles: ["operations"], complexity: "low" },
  { name: "Парсинг PDF-рахунків в таблицю", category: "documents", roles: ["accountant"], complexity: "medium" },
  { name: "Автоматичне створення актів виконаних робіт", category: "documents", roles: ["accountant"], complexity: "low" },
  { name: "AI-екстракція даних з сканів OCR", category: "documents", roles: ["accountant", "operations"], complexity: "high" },
  { name: "Автоматичне нагадування про дедлайни", category: "documents", roles: ["operations"], complexity: "low" },
  { name: "Генерація протоколів зустрічей з аудіо", category: "documents", roles: ["operations", "ceo"], complexity: "high" },
  { name: "Автоматична звірка реєстрів", category: "documents", roles: ["accountant"], complexity: "medium" },
  { name: "AI-класифікація вхідних листів", category: "documents", roles: ["operations"], complexity: "medium" },
  { name: "Автоматичне архівування документів з тегуванням", category: "documents", roles: ["operations"], complexity: "medium" },
  { name: "AI-генерація юридичних висновків", category: "documents", roles: ["operations"], complexity: "high" },
  { name: "Автоматичний контроль версій документів", category: "documents", roles: ["operations"], complexity: "medium" },
  { name: "Парсинг банківських виписок", category: "documents", roles: ["accountant"], complexity: "medium" },
  { name: "AI-перевірка відповідності регуляторним вимогам", category: "documents", roles: ["accountant"], complexity: "high" },
  // Customer Service (15)
  { name: "AI-відповіді на типові питання клієнтів", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "Автоматична маршрутизація звернень", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "AI-генерація відповідей на негативні відгуки", category: "service", roles: ["marketer"], complexity: "medium" },
  { name: "Автоматичний збір зворотного звязку", category: "service", roles: ["operations", "marketer"], complexity: "low" },
  { name: "Чат-бот з базою знань компанії", category: "service", roles: ["operations"], complexity: "high" },
  { name: "Автоматичне ескалювання критичних звернень", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "AI-аналіз тональності звернень", category: "service", roles: ["analyst", "operations"], complexity: "medium" },
  { name: "Автоматичний follow-up після вирішення проблеми", category: "service", roles: ["operations"], complexity: "low" },
  { name: "Мультимовна підтримка через AI-переклад", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "Автоматичне оновлення бази знань", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "AI-прогнозування відтоку клієнтів", category: "service", roles: ["analyst", "sales"], complexity: "high" },
  { name: "Автоматичне створення тікетів з email", category: "service", roles: ["operations"], complexity: "low" },
  { name: "AI-пріоритизація черги звернень", category: "service", roles: ["operations"], complexity: "medium" },
  { name: "Автоматичний збір відгуків на Google та Facebook", category: "service", roles: ["marketer"], complexity: "low" },
  { name: "Персоналізовані рекомендації по cross-sell", category: "service", roles: ["sales", "marketer"], complexity: "high" },
  // Operations & Management (15)
  { name: "Автоматичний збір daily standup від команди", category: "operations", roles: ["operations", "ceo"], complexity: "low" },
  { name: "AI-аналіз продуктивності по відділах", category: "operations", roles: ["ceo", "operations"], complexity: "medium" },
  { name: "Автоматичне планування зустрічей", category: "operations", roles: ["operations"], complexity: "low" },
  { name: "AI-генерація порядку денного для мітингів", category: "operations", roles: ["operations", "ceo"], complexity: "medium" },
  { name: "Автоматичний трекінг OKR та KPI", category: "operations", roles: ["operations", "ceo"], complexity: "medium" },
  { name: "AI-аналіз ризиків проектів", category: "operations", roles: ["operations", "ceo"], complexity: "high" },
  { name: "Автоматичне створення проектних планів", category: "operations", roles: ["operations"], complexity: "medium" },
  { name: "AI-розподіл задач по навантаженню", category: "operations", roles: ["operations"], complexity: "high" },
  { name: "Автоматичний контроль бюджету проекту", category: "operations", roles: ["operations", "accountant"], complexity: "medium" },
  { name: "AI-прогнозування затримок проекту", category: "operations", roles: ["operations"], complexity: "high" },
  { name: "Автоматичний збір метрик з різних систем", category: "operations", roles: ["analyst", "operations"], complexity: "medium" },
  { name: "AI-оптимізація розкладу змін", category: "operations", roles: ["operations", "hr"], complexity: "high" },
  { name: "Автоматичне створення звітів для ради директорів", category: "operations", roles: ["ceo", "analyst"], complexity: "high" },
  { name: "AI-аналіз ефективності процесів", category: "operations", roles: ["operations", "analyst"], complexity: "high" },
  { name: "Автоматичний моніторинг SLA", category: "operations", roles: ["operations"], complexity: "medium" },
  // Finance (15)
  { name: "Автоматична категоризація витрат", category: "finance", roles: ["accountant"], complexity: "low" },
  { name: "AI-прогнозування cash flow", category: "finance", roles: ["accountant", "ceo"], complexity: "high" },
  { name: "Автоматичне створення фінансових звітів", category: "finance", roles: ["accountant"], complexity: "medium" },
  { name: "AI-аналіз дебіторської заборгованості", category: "finance", roles: ["accountant"], complexity: "medium" },
  { name: "Автоматичне нагадування про оплату", category: "finance", roles: ["accountant"], complexity: "low" },
  { name: "AI-виявлення аномалій у витратах", category: "finance", roles: ["accountant", "ceo"], complexity: "high" },
  { name: "Автоматична звірка банківських виписок", category: "finance", roles: ["accountant"], complexity: "medium" },
  { name: "AI-оптимізація витрат по категоріях", category: "finance", roles: ["accountant", "ceo"], complexity: "high" },
  { name: "Автоматичний розрахунок зарплат", category: "finance", roles: ["accountant", "hr"], complexity: "medium" },
  { name: "AI-прогнозування виручки", category: "finance", roles: ["analyst", "ceo"], complexity: "high" },
  { name: "Автоматичне створення податкових звітів", category: "finance", roles: ["accountant"], complexity: "high" },
  { name: "AI-аналіз рентабельності продуктів", category: "finance", roles: ["analyst", "ceo"], complexity: "high" },
  { name: "Автоматичний контроль лімітів витрат", category: "finance", roles: ["accountant"], complexity: "low" },
  { name: "AI-порівняння постачальників по ціні", category: "finance", roles: ["accountant", "operations"], complexity: "medium" },
  { name: "Автоматичне формування бюджету", category: "finance", roles: ["accountant", "ceo"], complexity: "high" },
  // Industry-specific (15)
  { name: "Автоматичне оновлення залишків на маркетплейсах", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "AI-ціноутворення на основі конкурентів", category: "industry", roles: ["analyst", "marketer"], complexity: "high" },
  { name: "Автоматична обробка повернень в e-commerce", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "AI-підбір обєктів нерухомості під запит клієнта", category: "industry", roles: ["sales"], complexity: "high" },
  { name: "Автоматичне оновлення шахматок нерухомості", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "AI-оптимізація маршрутів доставки", category: "industry", roles: ["operations"], complexity: "high" },
  { name: "Автоматичний трекінг вантажів", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "AI-прогнозування затримок доставки", category: "industry", roles: ["operations", "analyst"], complexity: "high" },
  { name: "Автоматична обробка записів на прийом в медицині", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "Автоматичне нагадування пацієнтам", category: "industry", roles: ["operations"], complexity: "low" },
  { name: "AI-аналіз договорів на ризики", category: "industry", roles: ["operations"], complexity: "high" },
  { name: "AI-перевірка завдань студентів", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "Автоматична генерація тестів для навчання", category: "industry", roles: ["operations"], complexity: "medium" },
  { name: "AI-прогнозування потреб в сировині", category: "industry", roles: ["operations", "analyst"], complexity: "high" },
  { name: "Автоматичне бронювання через чат-бот", category: "industry", roles: ["operations", "sales"], complexity: "medium" },
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

const SYSTEM_PROMPT = `Ти генеруєш контент для сторінки AI-автоматизації на SEO-порталі B2B курсу AI Upskill.

КОНТЕКСТ: Курс навчає будувати AI-автоматизаційні ланцюжки (n8n, vibe-coding, API). 5 днів, 10 годин, 5 модулів. Ціна від 1 999 до 4 999 грн/людину.

ПРАВИЛА:
1. Кожен крок — конкретний інструмент: n8n, Claude API, Gmail API, Telegram Bot API, Pipedrive API, Google Sheets API
2. НЕ писати: "AI допоможе", "впровадження AI", "в умовах цифрової трансформації"
3. Цифри ROI реалістичні для України
4. МОВА: українська, без AI-маркерів
5. Мінімум 5 фактів з цифрами

Відповідай ТІЛЬКИ валідним JSON без markdown.`;

export async function POST(req: Request) {
  const { secret, batchSize = 5, offset = 0 } = await req.json();

  if (secret !== process.env.OPENROUTER_API_KEY?.slice(0, 10)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const batch = AUTOMATIONS_LIST.slice(offset, offset + batchSize);
  const results: { name: string; slug: string; status: string }[] = [];

  for (const auto of batch) {
    const slug = slugify(auto.name);

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

JSON:
{
  "problem": "3-4 речення з цифрами проблеми",
  "steps": [
    {"step": "Тригер", "tool": "назва інструменту", "description": "що відбувається"},
    {"step": "Збір даних", "tool": "n8n HTTP Request", "description": "..."},
    {"step": "AI-обробка", "tool": "Claude API через n8n", "description": "..."},
    {"step": "Дія", "tool": "CRM/Email API", "description": "..."},
    {"step": "Результат", "tool": "Telegram/Gmail", "description": "..."}
  ],
  "results": {"Час реакції": "з X → Y", "Економія": "N год/тижд", "ROI": "$N/міс"},
  "hours_saved_week": число,
  "money_saved_month": число,
  "build_time_hours": число,
  "tools": ["n8n", "Claude API", "..."]
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
