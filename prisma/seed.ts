import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed CourseConfig
  const existingConfig = await prisma.courseConfig.findFirst();
  if (!existingConfig) {
    await prisma.courseConfig.create({
      data: {
        durationDays: 5,
        durationHours: 10,
        modulesCount: 5,
        firstWinMinutes: 30,
        firstAutomationDay: 1,
        supportWeeks: 4,
        accessMonths: 12,
      },
    });
    console.log("✅ CourseConfig seeded");
  } else {
    console.log("⏭️ CourseConfig already exists");
  }

  // Seed B2BCoursePricing
  const existingPricing = await prisma.b2BCoursePricing.findFirst();
  if (!existingPricing) {
    await prisma.b2BCoursePricing.createMany({
      data: [
        { minPeople: 1, maxPeople: 1, pricePerPerson: 99 },
        { minPeople: 2, maxPeople: 5, pricePerPerson: 79 },
        { minPeople: 6, maxPeople: 9, pricePerPerson: 72 },
        { minPeople: 10, maxPeople: 29, pricePerPerson: 65 },
        { minPeople: 30, maxPeople: 49, pricePerPerson: 55 },
        { minPeople: 50, maxPeople: 99, pricePerPerson: 49 },
        { minPeople: 100, maxPeople: null, pricePerPerson: 0 }, // 0 = consultation required
      ],
    });
    console.log("✅ B2BCoursePricing seeded (7 tiers)");
  } else {
    console.log("⏭️ B2BCoursePricing already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
