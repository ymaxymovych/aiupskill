import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import IndustrySidebar from "@/components/seo/IndustrySidebar";
import DynamicPrice from "@/components/shared/DynamicPrice";
import ShareWithManager from "@/components/shared/ShareWithManager";
import {
  INDUSTRIES,
  ROLES,
  findIndustry,
  findRole,
} from "@/lib/seo/industries-roles";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ industry: string; role: string }>;
}

export async function generateStaticParams() {
  const params: { industry: string; role: string }[] = [];
  for (const ind of INDUSTRIES) {
    for (const role of ROLES) {
      params.push({ industry: ind.slug, role: role.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, role } = await params;
  const ind = findIndustry(industry);
  const r = findRole(role);
  if (!ind || !r) return {};
  return {
    title: `AI-автоматизації для ${r.name} в ${ind.name} | AI Upskill`,
    description: `AI-ланцюжки для ${r.name} в ${ind.name}. n8n, Claude API, CRM. Курс від $49, окупність від 5 днів.`,
  };
}

export default async function RolePage({ params }: Props) {
  const { industry: indSlug, role: roleSlug } = await params;
  const ind = findIndustry(indSlug);
  const role = findRole(roleSlug);
  if (!ind || !role) notFound();

  // Fetch interviews for this industry+role combo
  let interviews: { id: string; name: string; headline: string | null; jobTitle: string }[] = [];
  try {
    interviews = await prisma.b2BGeneratedInterview.findMany({
      where: { industry: ind.dbCode, role: role.dbCode, language: "uk" },
      select: { id: true, name: true, headline: true, jobTitle: true },
      take: 8,
      orderBy: { viewCount: "desc" },
    });
  } catch {
    // DB not available
  }

  const pageUrl = `https://aiupskill.live/cases/${indSlug}/${roleSlug}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding">
          <div className="flex gap-8">
            <IndustrySidebar currentSlug={indSlug} />

            <div className="flex-1 min-w-0">
              <Breadcrumbs
                items={[
                  { label: "Кейси", href: "/cases" },
                  { label: ind.name, href: `/cases/${indSlug}` },
                  { label: role.name },
                ]}
              />

              <h1 className="text-h1 text-text mb-2">
                {role.emoji} AI-автоматизації для {role.name} в {ind.name}
              </h1>
              <p className="text-lg text-text-secondary mb-8">
                Ланцюжки, які ваш {role.name.toLowerCase()} побудує за 5 днів
              </p>

              {/* ROI Block */}
              <h2 className="text-h2 text-text mb-4">
                ROI курсу для {role.name}
              </h2>
              <DynamicPrice
                people={1}
                showSlider={false}
                showPayback={true}
                variant="block"
                className="mb-4"
              />

              <ShareWithManager
                pageUrl={pageUrl}
                roleName={role.name}
                industryName={ind.name}
                paybackDays={5}
                className="mb-12"
              />

              {/* CTA */}
              <div className="flex gap-3 mb-12">
                <a
                  href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Спробувати безкоштовно
                </a>
                <a href="/#consultation" className="btn-secondary">
                  Замовити консультацію
                </a>
              </div>

              {/* Scenarios (interviews) */}
              {interviews.length > 0 && (
                <>
                  <h2 className="text-h2 text-text mb-4">Сценарії з практики</h2>
                  <p className="text-xs text-text-secondary mb-4 italic">
                    * Імена змінено. Сценарії побудовані на основі типових ситуацій в галузі.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-12">
                    {interviews.map((iv) => (
                      <Link
                        key={iv.id}
                        href={`/cases/${indSlug}/${roleSlug}/${iv.id}`}
                        className="card !p-4 hover:border-primary/40 transition-all group"
                      >
                        <p className="text-sm font-medium text-text group-hover:text-primary transition-colors mb-1">
                          {iv.headline || iv.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {iv.name}, {iv.jobTitle}
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Cross-links */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-h3 text-text mb-3">
                    {role.name} в інших галузях
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.filter((i) => i.slug !== indSlug).map((i) => (
                      <Link
                        key={i.slug}
                        href={`/cases/${i.slug}/${roleSlug}`}
                        className="text-sm px-3 py-1.5 bg-surface rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        {i.emoji} {i.name.split(" / ")[0]}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-h3 text-text mb-3">
                    Інші ролі в {ind.name.split(" / ")[0]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.filter((r) => r.slug !== roleSlug).map((r) => (
                      <Link
                        key={r.slug}
                        href={`/cases/${indSlug}/${r.slug}`}
                        className="text-sm px-3 py-1.5 bg-surface rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        {r.emoji} {r.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
