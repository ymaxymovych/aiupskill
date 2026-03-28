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
        { minPeople: 1, maxPeople: 1, pricePerPerson: 99 },
        { minPeople: 2, maxPeople: 5, pricePerPerson: 79 },
        { minPeople: 6, maxPeople: 9, pricePerPerson: 72 },
        { minPeople: 10, maxPeople: 29, pricePerPerson: 65 },
        { minPeople: 30, maxPeople: 49, pricePerPerson: 55 },
        { minPeople: 50, maxPeople: 99, pricePerPerson: 49 },
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
