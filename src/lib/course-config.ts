import { prisma } from "./db";

export interface CourseConfigData {
  durationDays: number;
  durationHours: number;
  modulesCount: number;
  firstWinMinutes: number;
  firstAutomationDay: number;
  supportWeeks: number;
  accessMonths: number;
}

const DEFAULTS: CourseConfigData = {
  durationDays: 5,
  durationHours: 10,
  modulesCount: 5,
  firstWinMinutes: 30,
  firstAutomationDay: 1,
  supportWeeks: 4,
  accessMonths: 12,
};

let cached: CourseConfigData | null = null;
let cachedAt = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getCourseConfig(): Promise<CourseConfigData> {
  if (cached && Date.now() - cachedAt < CACHE_TTL) return cached;

  try {
    const config = await prisma.courseConfig.findFirst();
    if (config) {
      cached = {
        durationDays: config.durationDays,
        durationHours: config.durationHours,
        modulesCount: config.modulesCount,
        firstWinMinutes: config.firstWinMinutes,
        firstAutomationDay: config.firstAutomationDay,
        supportWeeks: config.supportWeeks,
        accessMonths: config.accessMonths,
      };
      cachedAt = Date.now();
      return cached;
    }
  } catch {
    // DB not available, use defaults
  }

  return DEFAULTS;
}

export interface PricingTier {
  minPeople: number;
  maxPeople: number | null;
  pricePerPerson: number;
}

let pricingCached: PricingTier[] | null = null;
let pricingCachedAt = 0;

export async function getPricingTiers(): Promise<PricingTier[]> {
  if (pricingCached && Date.now() - pricingCachedAt < CACHE_TTL)
    return pricingCached;

  try {
    const tiers = await prisma.b2BCoursePricing.findMany({
      where: { isActive: true },
      orderBy: { minPeople: "asc" },
    });
    if (tiers.length > 0) {
      pricingCached = tiers.map((t) => ({
        minPeople: t.minPeople,
        maxPeople: t.maxPeople,
        pricePerPerson: t.pricePerPerson,
      }));
      pricingCachedAt = Date.now();
      return pricingCached;
    }
  } catch {
    // DB not available, use defaults
  }

  // Fallback pricing
  return [
    { minPeople: 1, maxPeople: 1, pricePerPerson: 99 },
    { minPeople: 2, maxPeople: 5, pricePerPerson: 79 },
    { minPeople: 6, maxPeople: 9, pricePerPerson: 72 },
    { minPeople: 10, maxPeople: 29, pricePerPerson: 65 },
    { minPeople: 30, maxPeople: 49, pricePerPerson: 55 },
    { minPeople: 50, maxPeople: 99, pricePerPerson: 49 },
    { minPeople: 100, maxPeople: null, pricePerPerson: 0 },
  ];
}

export function getPriceForPeople(
  tiers: PricingTier[],
  people: number
): number | null {
  for (const tier of tiers) {
    if (
      people >= tier.minPeople &&
      (tier.maxPeople === null || people <= tier.maxPeople)
    ) {
      return tier.pricePerPerson;
    }
  }
  return null;
}

export function getMinMaxPrice(tiers: PricingTier[]): {
  min: number;
  max: number;
} {
  const prices = tiers
    .filter((t) => t.pricePerPerson > 0)
    .map((t) => t.pricePerPerson);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
