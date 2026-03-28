import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import IndustrySidebar from "@/components/seo/IndustrySidebar";
import DynamicPrice from "@/components/shared/DynamicPrice";
import { INDUSTRIES, ROLES, findIndustry } from "@/lib/seo/industries-roles";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: slug } = await params;
  const ind = findIndustry(slug);
  if (!ind) return {};
  return {
    title: `AI-автоматизації в ${ind.name}: ланцюжки для бізнесу | AI Upskill`,
    description: `AI-ланцюжки для ${ind.name}. Від кваліфікації лідів до автозвітності. Курс від 1 999 грн/людину.`,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { industry: slug } = await params;
  const ind = findIndustry(slug);
  if (!ind) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding">
          <div className="flex gap-8">
            <IndustrySidebar currentSlug={slug} />

            <div className="flex-1 min-w-0">
              <Breadcrumbs
                items={[
                  { label: "Кейси", href: "/cases" },
                  { label: ind.name },
                ]}
              />

              <h1 className="text-h1 text-text mb-4">
                {ind.emoji} AI-автоматизації в {ind.name}
              </h1>
              <p className="text-body text-text-secondary mb-8">
                Конкретні AI-ланцюжки для кожної ролі в {ind.name}.
                Не абстрактне &ldquo;впровадження AI&rdquo; — а автоматизації з кроками,
                інструментами та цифрами економії.
              </p>

              {/* Roles in this industry */}
              <h2 className="text-h2 text-text mb-6">
                Ролі в {ind.name.split(" / ")[0]}, які найбільше виграють від AI-автоматизацій
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {ROLES.map((role) => (
                  <Link
                    key={role.slug}
                    href={`/cases/${slug}/${role.slug}`}
                    className="card !p-4 hover:border-primary/40 group transition-all"
                  >
                    <span className="text-2xl block mb-2">{role.emoji}</span>
                    <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                      {role.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      Топ-5 автоматизацій →
                    </p>
                  </Link>
                ))}
              </div>

              {/* Input → Processing → Decision framework */}
              <h2 className="text-h2 text-text mb-6">
                Чому будь-яка посада з клав&apos;ятурою в {ind.name.split(" / ")[0]} піддається автоматизації
              </h2>
              <p className="text-body text-text-secondary mb-6">
                Робота кожного співробітника: отримати інформацію → обробити → прийняти рішення.
                AI-агенти вміють робити всі три кроки. Автономно. 24/7.
              </p>

              {/* ROI Calculator */}
              <h2 className="text-h2 text-text mb-6">
                ROI для вашої компанії в {ind.name.split(" / ")[0]}
              </h2>
              <DynamicPrice
                people={15}
                showSlider={true}
                showPayback={true}
                variant="hero"
                className="mb-12"
              />

              {/* CTA */}
              <div className="card bg-surface-alt text-center mb-12">
                <h2 className="text-h3 text-text mb-3">
                  Замовити AI-аудит для вашої компанії в {ind.name.split(" / ")[0]}
                </h2>
                <div className="flex justify-center gap-3">
                  <a href="/#consultation" className="btn-primary">
                    Замовити консультацію
                  </a>
                  <a
                    href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    Спробувати безкоштовно
                  </a>
                </div>
              </div>

              {/* Other industries */}
              <h2 className="text-h3 text-text mb-4">Інші галузі</h2>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.filter((i) => i.slug !== slug).map((i) => (
                  <Link
                    key={i.slug}
                    href={`/cases/${i.slug}`}
                    className="text-sm px-3 py-1.5 bg-surface rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {i.emoji} {i.name.split(" / ")[0]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
