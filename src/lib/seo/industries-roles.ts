export interface Industry {
  slug: string;
  name: string;
  emoji: string;
  dbCode: string; // maps to B2BGeneratedInterview.industry
}

export interface Role {
  slug: string;
  name: string;
  emoji: string;
  dbCode: string; // maps to B2BGeneratedInterview.role
}

export const INDUSTRIES: Industry[] = [
  { slug: "e-commerce", name: "E-commerce / Інтернет-магазин", emoji: "🛒", dbCode: "ecommerce" },
  { slug: "marketynh-ahentstvo", name: "Маркетинг-агентство", emoji: "📢", dbCode: "agency" },
  { slug: "it-kompaniya", name: "IT-компанія", emoji: "💻", dbCode: "it" },
  { slug: "vyrobnytstvo", name: "Виробництво", emoji: "🏭", dbCode: "manufacturing" },
  { slug: "posluhy", name: "Сфера послуг", emoji: "🔧", dbCode: "services" },
  { slug: "nerukhomist", name: "Нерухомість", emoji: "🏠", dbCode: "realestate" },
  { slug: "lohistyka", name: "Логістика", emoji: "🚛", dbCode: "logistics" },
  { slug: "osvita", name: "Освіта / EdTech", emoji: "📚", dbCode: "education" },
  { slug: "medytsyna", name: "Медицина / Фарма", emoji: "🏥", dbCode: "medical" },
  { slug: "yurysprudentsiya", name: "Юриспруденція", emoji: "⚖️", dbCode: "legal" },
];

export const ROLES: Role[] = [
  { slug: "marketoloh", name: "Маркетолог", emoji: "📊", dbCode: "marketer" },
  { slug: "prodazhi", name: "Менеджер з продажів", emoji: "💼", dbCode: "sales" },
  { slug: "hr", name: "HR-менеджер", emoji: "👥", dbCode: "hr" },
  { slug: "kerivnyk", name: "CEO / Власник", emoji: "👔", dbCode: "ceo" },
  { slug: "operatsii", name: "Операційний менеджер", emoji: "⚙️", dbCode: "operations" },
  { slug: "kopiraiter", name: "Копірайтер", emoji: "✍️", dbCode: "copywriter" },
  { slug: "analityk", name: "Аналітик", emoji: "📈", dbCode: "analyst" },
  { slug: "bukhhalter", name: "Бухгалтер", emoji: "🧮", dbCode: "accountant" },
];

export function findIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function findRole(slug: string): Role | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function findIndustryByDbCode(code: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.dbCode === code);
}

export function findRoleByDbCode(code: string): Role | undefined {
  return ROLES.find((r) => r.dbCode === code);
}
