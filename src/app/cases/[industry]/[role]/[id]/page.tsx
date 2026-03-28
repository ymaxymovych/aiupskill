import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import DynamicPrice from "@/components/shared/DynamicPrice";
import ShareWithManager from "@/components/shared/ShareWithManager";
import { findIndustry, findRole } from "@/lib/seo/industries-roles";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ industry: string; role: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, role, id } = await params;
  const ind = findIndustry(industry);
  const r = findRole(role);
  if (!ind || !r) return {};

  let interview;
  try {
    interview = await prisma.b2BGeneratedInterview.findUnique({ where: { id } });
  } catch {
    return {};
  }
  if (!interview) return {};

  const headline = interview.headline || interview.name;
  return {
    title: `${headline} | ${r.name} в ${ind.name} | AI Upskill`,
    description: `Сценарій: ${r.name.toLowerCase()} в ${ind.name.toLowerCase()}. AI-ланцюжок автоматизації. Курс від 1 999 грн, окупність від 5 днів.`,
  };
}

export default async function ScenarioPage({ params }: Props) {
  const { industry: indSlug, role: roleSlug, id } = await params;
  const ind = findIndustry(indSlug);
  const role = findRole(roleSlug);
  if (!ind || !role) notFound();

  let interview;
  try {
    interview = await prisma.b2BGeneratedInterview.findUnique({
      where: { id },
    });
    // Fire-and-forget view count increment
    prisma.b2BGeneratedInterview
      .update({ where: { id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});
  } catch {
    notFound();
  }
  if (!interview) notFound();

  const content = interview.content as Record<string, unknown>;
  const conclusion = content?.conclusion as Record<string, unknown> | undefined;
  const questions = (content?.questions || content?.interview) as
    | Array<{ question: string; answer: string }>
    | undefined;

  const pageUrl = `https://aiupskill.live/cases/${indSlug}/${roleSlug}/${id}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Кейси", href: "/cases" },
              { label: ind.name, href: `/cases/${indSlug}` },
              { label: role.name, href: `/cases/${indSlug}/${roleSlug}` },
              { label: interview.name },
            ]}
          />

          <h1 className="text-h1 text-text mb-2">
            {interview.headline || interview.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-text-secondary">
            <span>{interview.name}</span>
            <span>·</span>
            <span>{interview.jobTitle}</span>
            {interview.companyDesc && (
              <>
                <span>·</span>
                <span>{interview.companyDesc}</span>
              </>
            )}
            {interview.teamSize && (
              <>
                <span>·</span>
                <span>{interview.teamSize} людей</span>
              </>
            )}
          </div>

          <p className="text-xs text-text-secondary italic mb-8">
            * Ім&apos;я вигадане. Сценарій побудований на основі типових ситуацій в галузі.
          </p>

          {/* Interview Q&A */}
          {questions && questions.length > 0 && (
            <div className="space-y-6 mb-10">
              {questions.map((qa, i) => (
                <div key={i}>
                  <p className="font-semibold text-text mb-2">
                    {qa.question}
                  </p>
                  <p className="text-text-secondary leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ROI block */}
          {conclusion && (
            <div className="card bg-surface-alt mb-8">
              <h2 className="text-h3 text-text mb-4">Підсумок</h2>
              <DynamicPrice people={1} variant="block" showPayback={true} />
            </div>
          )}

          {/* Share + CTA */}
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Спробувати безкоштовно — перший модуль без оплати
            </a>
            <a href="/#consultation" className="btn-secondary">
              Замовити консультацію
            </a>
            <ShareWithManager
              pageUrl={pageUrl}
              roleName={role.name}
              industryName={ind.name}
            />
          </div>

          {/* Cross-links */}
          <div className="border-t border-border pt-6 space-y-4">
            <Link
              href={`/cases/${indSlug}/${roleSlug}`}
              className="text-sm text-primary hover:underline block"
            >
              ← Всі кейси: {role.name} в {ind.name}
            </Link>
            <Link
              href={`/cases/${indSlug}`}
              className="text-sm text-primary hover:underline block"
            >
              ← Всі ролі в {ind.name}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
