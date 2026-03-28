import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import DynamicPrice from "@/components/shared/DynamicPrice";
import ShareWithManager from "@/components/shared/ShareWithManager";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let automation;
  try {
    automation = await prisma.b2BAutomation.findUnique({ where: { slug } });
  } catch {
    return {};
  }
  if (!automation) return {};

  return {
    title: `${automation.name}: AI-ланцюжок | AI Upskill`,
    description: `Як автоматизувати ${automation.name.toLowerCase()} за допомогою n8n та AI. ROI $${automation.moneySavedMonth}/міс.`,
  };
}

export default async function AutomationPage({ params }: Props) {
  const { slug } = await params;

  let automation;
  try {
    automation = await prisma.b2BAutomation.findUnique({ where: { slug } });
  } catch {
    notFound();
  }
  if (!automation) notFound();

  const content = automation.content as Record<string, unknown>;
  const steps = (content?.steps || []) as Array<{
    step: string;
    tool: string;
    description: string;
  }>;
  const problem = (content?.problem as string) || "";
  const results = content?.results as Record<string, string> | undefined;

  const pageUrl = `https://aiupskill.live/automations/${slug}`;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Автоматизації", href: "/automations" },
              { label: automation.name },
            ]}
          />

          <h1 className="text-h1 text-text mb-4">
            {automation.name}
          </h1>

          {/* Meta block */}
          <div className="flex flex-wrap gap-3 mb-6 text-sm">
            <span className="px-2 py-1 bg-gray-100 rounded text-text-secondary">
              ⭐ {automation.complexity === "low" ? "Легка" : automation.complexity === "high" ? "Складна" : "Середня"}
            </span>
            {automation.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-1 bg-primary/5 rounded text-primary"
              >
                {tool}
              </span>
            ))}
            <span className="px-2 py-1 bg-green-50 rounded text-green-600">
              ~${automation.moneySavedMonth}/міс
            </span>
            <span className="px-2 py-1 bg-blue-50 rounded text-blue-600">
              {automation.hoursSavedWeek} год/тижд
            </span>
          </div>

          {/* Problem */}
          {problem && (
            <>
              <h2 className="text-h2 text-text mb-3">Проблема</h2>
              <p className="text-body text-text-secondary mb-8">{problem}</p>
            </>
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <>
              <h2 className="text-h2 text-text mb-4">
                Як працює цей AI-ланцюжок
              </h2>
              <div className="space-y-4 mb-8">
                {steps.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-text">
                        {s.step}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {s.description}
                      </p>
                      <p className="text-xs text-primary mt-0.5">
                        Інструмент: {s.tool}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Results */}
          {results && (
            <>
              <h2 className="text-h2 text-text mb-3">Результат</h2>
              <div className="card bg-surface-alt mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {Object.entries(results).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-xs text-text-secondary">{key}</p>
                      <p className="text-lg font-bold text-text">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ROI comparison */}
          <h2 className="text-h2 text-text mb-3">
            ROI цієї автоматизації
          </h2>
          <DynamicPrice people={1} variant="block" showPayback={true} className="mb-4" />

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Навчіться будувати такі ланцюжки за 5 днів
            </a>
            <a href="/#consultation" className="btn-secondary">
              Замовити консультацію
            </a>
            <ShareWithManager pageUrl={pageUrl} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
