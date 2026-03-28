export interface Automation {
  id: string;
  department: DepartmentCode;
  title: string;
  description: string;
  hoursPerWeek: number;
  industries: IndustryCode[];
  priority: number;
}

export type DepartmentCode =
  | "marketing"
  | "sales"
  | "hr"
  | "finance"
  | "development"
  | "operations"
  | "support"
  | "legal"
  | "management";

export type IndustryCode =
  | "ecommerce"
  | "agency"
  | "it_software"
  | "manufacturing"
  | "services"
  | "real_estate"
  | "logistics"
  | "education"
  | "healthcare"
  | "legal"
  | "other"
  | "all";

export const INDUSTRIES: { code: IndustryCode; label: string }[] = [
  { code: "ecommerce", label: "E-commerce / Інтернет-магазин" },
  { code: "agency", label: "Маркетинг-агентство" },
  { code: "it_software", label: "IT-компанія / Software" },
  { code: "manufacturing", label: "Виробництво" },
  { code: "services", label: "Сфера послуг" },
  { code: "real_estate", label: "Нерухомість" },
  { code: "logistics", label: "Логістика / Дистрибуція" },
  { code: "education", label: "Освіта" },
  { code: "healthcare", label: "Медицина / Фарма" },
  { code: "legal", label: "Юриспруденція" },
  { code: "other", label: "Інше" },
];

export const AUTOMATIONS: Automation[] = [
  // Marketing (20)
  { id: "mkt-1", department: "marketing", title: "Авто-генерація контент-плану та постів для соцмереж", description: "AI-агент створює контент-план, пише пости, адаптує під платформи", hoursPerWeek: 12, industries: ["all"], priority: 10 },
  { id: "mkt-2", department: "marketing", title: "SEO-оптимізація існуючого контенту", description: "Аналіз ключових слів, переписування текстів, meta tags", hoursPerWeek: 8, industries: ["all"], priority: 8 },
  { id: "mkt-3", department: "marketing", title: "Email-маркетинг: генерація ланцюжків листів", description: "Створення welcome, nurture, promotional sequences", hoursPerWeek: 6, industries: ["all"], priority: 7 },
  { id: "mkt-4", department: "marketing", title: "Аналіз конкурентів і трендів", description: "Автоматичний моніторинг конкурентів, звіти про тренди ринку", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "mkt-5", department: "marketing", title: "Створення рекламних креативів та текстів", description: "Генерація рекламних текстів, A/B варіантів, адаптація під платформи", hoursPerWeek: 10, industries: ["all"], priority: 9 },
  { id: "mkt-6", department: "marketing", title: "A/B тестування заголовків і описів", description: "Генерація варіантів та аналіз результатів", hoursPerWeek: 3, industries: ["all"], priority: 5 },
  { id: "mkt-7", department: "marketing", title: "Генерація лід-магнітів", description: "Створення чеклістів, гайдів, white papers", hoursPerWeek: 5, industries: ["all"], priority: 6 },
  { id: "mkt-8", department: "marketing", title: "Моніторинг згадок бренду", description: "Автоматичне відстеження та аналіз згадок в мережі", hoursPerWeek: 2, industries: ["all"], priority: 4 },
  { id: "mkt-9", department: "marketing", title: "Адаптація контенту під платформи", description: "Переформатування контенту для LinkedIn, Instagram, Facebook, Telegram", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "mkt-10", department: "marketing", title: "Генерація відповідей на відгуки", description: "Автоматичні відповіді на відгуки та коментарі клієнтів", hoursPerWeek: 3, industries: ["ecommerce", "services", "all"], priority: 5 },
  { id: "mkt-11", department: "marketing", title: "Автоматизація звітності з рекламних кабінетів", description: "Збір даних, генерація звітів, виявлення трендів", hoursPerWeek: 5, industries: ["agency", "ecommerce", "all"], priority: 7 },
  { id: "mkt-12", department: "marketing", title: "Парсинг і аналіз аудиторії", description: "Збір та аналіз даних про цільову аудиторію", hoursPerWeek: 4, industries: ["all"], priority: 5 },
  { id: "mkt-13", department: "marketing", title: "Генерація landing page текстів", description: "Копірайтинг для лендінгів з урахуванням SEO", hoursPerWeek: 6, industries: ["all"], priority: 7 },
  { id: "mkt-14", department: "marketing", title: "Транскрипція і резюме зустрічей", description: "Автоматична транскрипція, summary, action items", hoursPerWeek: 3, industries: ["all"], priority: 5 },
  { id: "mkt-15", department: "marketing", title: "Створення presentation decks", description: "Генерація презентацій та pitch decks", hoursPerWeek: 4, industries: ["all"], priority: 5 },
  { id: "mkt-16", department: "marketing", title: "Генерація FAQ та довідкового контенту", description: "Створення баз знань, FAQ, help center статей", hoursPerWeek: 3, industries: ["all"], priority: 4 },
  { id: "mkt-17", department: "marketing", title: "Автоматичний переклад контенту", description: "Переклад та локалізація контенту для різних ринків", hoursPerWeek: 2, industries: ["all"], priority: 4 },
  { id: "mkt-18", department: "marketing", title: "Генерація YouTube Shorts / Reels сценаріїв", description: "Сценарії коротких відео для соцмереж", hoursPerWeek: 5, industries: ["all"], priority: 6 },
  { id: "mkt-19", department: "marketing", title: "Персоналізація контенту під сегменти", description: "Адаптація повідомлень для різних аудиторій", hoursPerWeek: 4, industries: ["all"], priority: 5 },
  { id: "mkt-20", department: "marketing", title: "Автоматизація influencer outreach", description: "Пошук інфлюенсерів, персоналізовані листи, трекінг", hoursPerWeek: 3, industries: ["ecommerce", "agency", "all"], priority: 4 },

  // Sales (15)
  { id: "sales-1", department: "sales", title: "AI-скринінг та scoring лідів", description: "Автоматичний аналіз лідів, пріоритизація, scoring", hoursPerWeek: 8, industries: ["all"], priority: 10 },
  { id: "sales-2", department: "sales", title: "Персоналізовані cold email ланцюжки", description: "Генерація персоналізованих листів на основі даних про компанію", hoursPerWeek: 10, industries: ["all"], priority: 9 },
  { id: "sales-3", department: "sales", title: "Автоматичні follow-up послідовності", description: "Інтелектуальні follow-up на основі поведінки ліда", hoursPerWeek: 5, industries: ["all"], priority: 8 },
  { id: "sales-4", department: "sales", title: "Генерація комерційних пропозицій", description: "Автоматичне створення КП на основі потреб клієнта", hoursPerWeek: 6, industries: ["all"], priority: 8 },
  { id: "sales-5", department: "sales", title: "CRM data enrichment", description: "Автоматичне збагачення даних про контакти та компанії", hoursPerWeek: 4, industries: ["all"], priority: 7 },
  { id: "sales-6", department: "sales", title: "Аналіз дзвінків (call intelligence)", description: "Транскрипція, аналіз sentiment, виявлення патернів", hoursPerWeek: 3, industries: ["all"], priority: 5 },
  { id: "sales-7", department: "sales", title: "Генерація відповідей на RFP/тендери", description: "Автоматичне заповнення тендерних документів", hoursPerWeek: 8, industries: ["it_software", "services", "all"], priority: 7 },
  { id: "sales-8", department: "sales", title: "Автоматичне оновлення pipeline", description: "Синхронізація даних між каналами та CRM", hoursPerWeek: 2, industries: ["all"], priority: 5 },
  { id: "sales-9", department: "sales", title: "LinkedIn outreach автоматизація", description: "Персоналізовані повідомлення, connection requests", hoursPerWeek: 6, industries: ["all"], priority: 7 },
  { id: "sales-10", department: "sales", title: "Генерація case studies", description: "Створення кейсів на основі даних про клієнтів", hoursPerWeek: 4, industries: ["all"], priority: 5 },
  { id: "sales-11", department: "sales", title: "Автоматична кваліфікація через чат-бот", description: "AI-бот кваліфікує ліди 24/7", hoursPerWeek: 5, industries: ["all"], priority: 6 },
  { id: "sales-12", department: "sales", title: "Конкурентний аналіз перед зустріччю", description: "Збір інформації про конкурентів клієнта", hoursPerWeek: 3, industries: ["all"], priority: 5 },
  { id: "sales-13", department: "sales", title: "Генерація pitch decks", description: "Персоналізовані презентації для кожного клієнта", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "sales-14", department: "sales", title: "Автоматичне створення quotes", description: "Генерація цінових пропозицій та рахунків", hoursPerWeek: 2, industries: ["all"], priority: 4 },
  { id: "sales-15", department: "sales", title: "Post-sale onboarding автоматизація", description: "Автоматичний онбординг нових клієнтів", hoursPerWeek: 3, industries: ["all"], priority: 5 },

  // HR (10)
  { id: "hr-1", department: "hr", title: "AI-скринер резюме та попередній відбір", description: "Автоматичний аналіз резюме, matching з вакансією", hoursPerWeek: 8, industries: ["all"], priority: 10 },
  { id: "hr-2", department: "hr", title: "Генерація описів вакансій", description: "Створення привабливих описів під різні платформи", hoursPerWeek: 3, industries: ["all"], priority: 7 },
  { id: "hr-3", department: "hr", title: "Автоматизація онбордингу", description: "Генерація онбординг-планів, чеклістів, матеріалів", hoursPerWeek: 5, industries: ["all"], priority: 8 },
  { id: "hr-4", department: "hr", title: "Аналіз задоволеності (sentiment analysis)", description: "Аналіз відгуків працівників, виявлення проблем", hoursPerWeek: 2, industries: ["all"], priority: 5 },
  { id: "hr-5", department: "hr", title: "Генерація performance review шаблонів", description: "Персоналізовані шаблони оцінки ефективності", hoursPerWeek: 3, industries: ["all"], priority: 6 },
  { id: "hr-6", department: "hr", title: "Автоматичне планування інтерв'ю", description: "Координація розкладу, нагадування, підготовка", hoursPerWeek: 2, industries: ["all"], priority: 5 },
  { id: "hr-7", department: "hr", title: "Генерація тренінгових матеріалів", description: "Створення навчальних програм та матеріалів", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "hr-8", department: "hr", title: "HR-бот для відповідей на типові питання", description: "24/7 бот для FAQ працівників", hoursPerWeek: 5, industries: ["all"], priority: 7 },
  { id: "hr-9", department: "hr", title: "Аналіз ринку зарплат", description: "Автоматичний збір та аналіз ринкових зарплат", hoursPerWeek: 2, industries: ["all"], priority: 4 },
  { id: "hr-10", department: "hr", title: "Автоматизація exit-інтерв'ю", description: "Збір та аналіз фідбеку від працівників що звільняються", hoursPerWeek: 1, industries: ["all"], priority: 3 },

  // Finance (5)
  { id: "fin-1", department: "finance", title: "Автоматизація звітності та рахунків", description: "Генерація фінансових звітів, обробка рахунків", hoursPerWeek: 6, industries: ["all"], priority: 8 },
  { id: "fin-2", department: "finance", title: "Прогнозування cash flow", description: "AI-прогнози грошових потоків на основі історичних даних", hoursPerWeek: 3, industries: ["all"], priority: 6 },
  { id: "fin-3", department: "finance", title: "Аналіз витрат та оптимізація", description: "Виявлення зайвих витрат, рекомендації по оптимізації", hoursPerWeek: 4, industries: ["all"], priority: 7 },
  { id: "fin-4", department: "finance", title: "Автоматична категоризація транзакцій", description: "Класифікація та тегування фінансових операцій", hoursPerWeek: 3, industries: ["all"], priority: 5 },
  { id: "fin-5", department: "finance", title: "Генерація податкових звітів", description: "Підготовка даних для податкової звітності", hoursPerWeek: 4, industries: ["all"], priority: 6 },

  // Development (5)
  { id: "dev-1", department: "development", title: "AI code review та документація", description: "Автоматична перевірка коду, генерація документації", hoursPerWeek: 10, industries: ["it_software", "all"], priority: 9 },
  { id: "dev-2", department: "development", title: "Генерація тестів", description: "Автоматичне створення unit та integration тестів", hoursPerWeek: 6, industries: ["it_software", "all"], priority: 7 },
  { id: "dev-3", department: "development", title: "Автоматизація деплойменту", description: "CI/CD оптимізація, автоматичні релізи", hoursPerWeek: 4, industries: ["it_software", "all"], priority: 6 },
  { id: "dev-4", department: "development", title: "Рефакторинг та оптимізація коду", description: "AI-допомога в покращенні якості коду", hoursPerWeek: 5, industries: ["it_software", "all"], priority: 6 },
  { id: "dev-5", department: "development", title: "Bug triage та аналіз логів", description: "Автоматичний аналіз помилок, класифікація багів", hoursPerWeek: 3, industries: ["it_software", "all"], priority: 5 },

  // Operations (5)
  { id: "ops-1", department: "operations", title: "Автоматизація документообігу", description: "Генерація, класифікація, маршрутизація документів", hoursPerWeek: 6, industries: ["all"], priority: 8 },
  { id: "ops-2", department: "operations", title: "AI-бот для внутрішньої підтримки", description: "Відповіді на питання працівників, SOP пошук", hoursPerWeek: 5, industries: ["all"], priority: 7 },
  { id: "ops-3", department: "operations", title: "Генерація SOP та інструкцій", description: "Створення та оновлення стандартних процедур", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "ops-4", department: "operations", title: "Автоматичне протоколювання зустрічей", description: "Транскрипція, summary, action items з мітингів", hoursPerWeek: 4, industries: ["all"], priority: 6 },
  { id: "ops-5", department: "operations", title: "Оптимізація процесів та workflow", description: "Аналіз bottleneck, рекомендації по покращенню", hoursPerWeek: 3, industries: ["all"], priority: 5 },
];

export function selectTopAutomations(
  industry: IndustryCode,
  departments: { code: DepartmentCode; count: number }[],
  totalEmployees: number,
  count = 5
): Automation[] {
  const deptCodes = new Set(departments.map((d) => d.code));

  const filtered = AUTOMATIONS.filter(
    (a) =>
      deptCodes.has(a.department) &&
      (a.industries.includes(industry) || a.industries.includes("all"))
  );

  const scored = filtered.map((a) => {
    const dept = departments.find((d) => d.code === a.department);
    const deptRatio = dept ? dept.count / totalEmployees : 0;
    const score = a.priority * 0.4 + a.hoursPerWeek * 0.3 + deptRatio * 10 * 0.2;
    return { automation: a, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const result: Automation[] = [];
  const deptCount: Record<string, number> = {};

  for (const { automation } of scored) {
    const dept = automation.department;
    if ((deptCount[dept] || 0) < 2) {
      result.push(automation);
      deptCount[dept] = (deptCount[dept] || 0) + 1;
    }
    if (result.length === count) break;
  }

  return result;
}
