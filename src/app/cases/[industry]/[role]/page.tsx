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
import { ROLE_CONTENT } from "@/lib/seo/role-content";
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
    description: `AI-ланцюжки для ${r.name} в ${ind.name}. n8n, Claude API, CRM. Курс від 1 999 грн, окупність від 5 днів.`,
  };
}

export default async function RolePage({ params }: Props) {
  const { industry: indSlug, role: roleSlug } = await params;
  const ind = findIndustry(indSlug);
  const role = findRole(roleSlug);
  if (!ind || !role) notFound();

  const content = ROLE_CONTENT[role.dbCode];

  let interviews: { id: string; name: string; headline: string | null; jobTitle: string }[] = [];
  try {
    interviews = await prisma.b2BGeneratedInterview.findMany({
      where: { industry: ind.dbCode, role: role.dbCode, language: "uk" },
      select: { id: true, name: true, headline: true, jobTitle: true },
      take: 8,
      orderBy: { viewCount: "desc" },
    });
  } catch {}

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

              {/* H1 */}
              <h1 className="text-h1 text-text mb-2">
                {role.emoji} AI-автоматизації для {role.name} в {ind.name}
              </h1>
              <p className="text-lg text-text-secondary mb-10">
                Ланцюжки, які ваш {role.name.toLowerCase()} побудує за 5 днів
              </p>

              {/* TOP-5 AUTOMATIONS */}
              {content && (
                <>
                  <h2 className="text-h2 text-text mb-6">
                    Топ-5 автоматизацій для {role.name}
                  </h2>
                  <div className="space-y-4 mb-12">
                    {content.topAutomations.map((auto, i) => (
                      <div key={i} className="border border-border rounded-xl p-5">
                        <div className="flex items-start gap-4">
                          <span className="text-2xl font-bold text-primary/30 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text mb-2">{auto.name}</h3>
                            <div className="bg-surface-alt rounded-lg px-4 py-2 mb-2">
                              <code className="text-sm text-text-secondary">{auto.chain}</code>
                            </div>
                            <span className="text-sm text-green-600 font-medium">
                              Економія: {auto.timeSaved}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* INPUT → PROCESSING → DECISION */}
                  <h2 className="text-h2 text-text mb-4">
                    Вхід → Обробка → Рішення
                  </h2>
                  <p className="text-text-secondary mb-4">
                    Як AI-ланцюжок працює для {role.name.toLowerCase()}:
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-12">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl mb-2">📥</div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Вхід</div>
                      <div className="text-sm font-medium text-text">{content.inputOutputDecision.input}</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="text-2xl mb-2">⚙️</div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Обробка</div>
                      <div className="text-sm font-medium text-text">{content.inputOutputDecision.processing}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl mb-2">✅</div>
                      <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Рішення</div>
                      <div className="text-sm font-medium text-text">{content.inputOutputDecision.decision}</div>
                    </div>
                  </div>

                  {/* OTHER TASKS */}
                  <h2 className="text-h2 text-text mb-4">
                    Інші задачі, які можна автоматизувати
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-2 mb-12">
                    {content.otherTasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-2 py-1">
                        <span className="text-primary mt-0.5 shrink-0">→</span>
                        <span className="text-sm text-text-secondary">{task}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ROI Block */}
              <h2 className="text-h2 text-text mb-4">
                Вартість: від 1 999 грн/людину
              </h2>
              <DynamicPrice
                people={1}
                showSlider={false}
                showPayback={true}
                variant="block"
                className="mb-4"
              />
              <div className="flex items-center gap-4 mb-12">
                <a href="/#pricing" className="text-primary hover:underline text-sm font-medium">
                  Розрахувати точну ціну →
                </a>
                <ShareWithManager
                  pageUrl={pageUrl}
                  roleName={role.name}
                  industryName={ind.name}
                  paybackDays={5}
                />
              </div>

              {/* CTA */}
              <div className="flex gap-3 mb-12">
                <a href="/#pricing" className="btn-primary">
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
                  <div className="grid sm:grid-cols-2 gap-4 mb-2">
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
                  <p className="text-xs text-text-secondary mb-12 italic">
                    * Імена змінено. Сценарії побудовані на основі типових ситуацій в галузі.
                  </p>
                </>
              )}

              {/* FAQ */}
              {content?.faq && (
                <>
                  <h2 className="text-h2 text-text mb-4">Часті питання</h2>
                  <div className="space-y-4 mb-12">
                    {content.faq.map((item, i) => (
                      <details key={i} className="border border-border rounded-lg">
                        <summary className="px-5 py-4 cursor-pointer font-medium text-text hover:bg-surface-alt/50">
                          {item.q}
                        </summary>
                        <p className="px-5 pb-4 text-text-secondary text-sm">{item.a}</p>
                      </details>
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
