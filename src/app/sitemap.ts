import type { MetadataRoute } from "next";
import { INDUSTRIES, ROLES } from "@/lib/seo/industries-roles";
import { prisma } from "@/lib/db";

const BASE_URL = "https://aiupskill.live";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages
  entries.push(
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/cases`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/automations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  );

  // Industry hubs (10)
  for (const ind of INDUSTRIES) {
    entries.push({
      url: `${BASE_URL}/cases/${ind.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // Role pages (80)
  for (const ind of INDUSTRIES) {
    for (const role of ROLES) {
      entries.push({
        url: `${BASE_URL}/cases/${ind.slug}/${role.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Automation pages from DB
  try {
    const automations = await prisma.b2BAutomation.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    for (const auto of automations) {
      entries.push({
        url: `${BASE_URL}/automations/${auto.slug}`,
        lastModified: auto.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // DB not available
  }

  // Interview scenarios from DB
  try {
    const interviews = await prisma.b2BGeneratedInterview.findMany({
      select: { id: true, industry: true, role: true, updatedAt: true },
    });

    // Build industry/role slug lookup
    const indMap = new Map(INDUSTRIES.map((i) => [i.dbCode, i.slug]));
    const roleMap = new Map(ROLES.map((r) => [r.dbCode, r.slug]));

    for (const iv of interviews) {
      const indSlug = indMap.get(iv.industry);
      const roleSlug = roleMap.get(iv.role);
      if (indSlug && roleSlug) {
        entries.push({
          url: `${BASE_URL}/cases/${indSlug}/${roleSlug}/${iv.id}`,
          lastModified: iv.updatedAt,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // DB not available
  }

  return entries;
}
