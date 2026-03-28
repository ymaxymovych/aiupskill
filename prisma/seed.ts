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

  // Seed B2BCoursePricing — UAH (гривні)
  // Delete old pricing and re-seed with UAH
  await prisma.b2BCoursePricing.deleteMany({});
  await prisma.b2BCoursePricing.createMany({
    data: [
      { minPeople: 1, maxPeople: 1, pricePerPerson: 4999, currency: "UAH" },
      { minPeople: 2, maxPeople: 4, pricePerPerson: 3999, currency: "UAH" },
      { minPeople: 5, maxPeople: 9, pricePerPerson: 2999, currency: "UAH" },
      { minPeople: 10, maxPeople: 19, pricePerPerson: 2499, currency: "UAH" },
      { minPeople: 20, maxPeople: 49, pricePerPerson: 2199, currency: "UAH" },
      { minPeople: 50, maxPeople: 99, pricePerPerson: 1999, currency: "UAH" },
      { minPeople: 100, maxPeople: null, pricePerPerson: 0, currency: "UAH" }, // 0 = consultation
    ],
  });
  console.log("✅ B2BCoursePricing seeded (7 tiers, UAH)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
