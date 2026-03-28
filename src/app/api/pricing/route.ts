import { NextResponse } from "next/server";
import { getPricingTiers, getCourseConfig } from "@/lib/course-config";

export async function GET() {
  try {
    const [tiers, config] = await Promise.all([
      getPricingTiers(),
      getCourseConfig(),
    ]);

    return NextResponse.json({
      tiers,
      config: {
        durationDays: config.durationDays,
        durationHours: config.durationHours,
        modulesCount: config.modulesCount,
        firstWinMinutes: config.firstWinMinutes,
        supportWeeks: config.supportWeeks,
        accessMonths: config.accessMonths,
      },
    });
  } catch {
    // Fallback response
    return NextResponse.json({
      tiers: [
        { minPeople: 1, maxPeople: 1, pricePerPerson: 4999 },
        { minPeople: 2, maxPeople: 4, pricePerPerson: 3999 },
        { minPeople: 5, maxPeople: 9, pricePerPerson: 2999 },
        { minPeople: 10, maxPeople: 19, pricePerPerson: 2499 },
        { minPeople: 20, maxPeople: 49, pricePerPerson: 2199 },
        { minPeople: 50, maxPeople: 99, pricePerPerson: 1999 },
        { minPeople: 100, maxPeople: null, pricePerPerson: 0 },
      ],
      config: {
        durationDays: 5,
        durationHours: 10,
        modulesCount: 5,
        firstWinMinutes: 30,
        supportWeeks: 4,
        accessMonths: 12,
      },
    });
  }
}
