export const ACCELERATOR_URL = "https://accelerator.aiadvisoryboard.me";
export const TELEGRAM_URL = "https://t.me/YaroslavMaxymovych";
export const LINKEDIN_URL = "https://linkedin.com/in/yaroslavmaxymovych";
export const EMAIL = "hello@aiupskill.live";
export const CEO_EMAIL = "ceo@aiupskill.live";

export const NAV_ITEMS = [
  { label: "Програма", href: "#program" },
  { label: "Ціни", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const PRICING = {
  trial: { name: "Trial", price: 0, priceUah: 0, seats: 1, modules: 1 },
  solo: { name: "Solo", price: 79, priceUah: 3200, seats: 1, modules: 6 },
  team: { name: "Team", price: 290, priceUah: 11900, seats: 5, modules: 6 },
  department: { name: "Department", price: 1900, seats: 30, modules: 6 },
  corporation: { name: "Corporation", price: 3500, seats: 50, modules: 6 },
} as const;
