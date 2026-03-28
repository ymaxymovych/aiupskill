import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { INDUSTRIES, ROLES } from "@/lib/seo/industries-roles";

export const metadata: Metadata = {
  title: "Кейси AI-автоматизацій по галузях | AI Upskill",
  description:
    "Конкретні AI-ланцюжки автоматизацій для 10 галузей та 8 ролей. n8n, Claude API, CRM інтеграції з цифрами економії. Курс від $49/людину.",
};

export default function CasesHubPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding">
          <Breadcrumbs items={[{ label: "Кейси" }]} />

          <h1 className="text-h1 text-text mb-4">
            AI-автоматизації для бізнесу: кейси по галузях та ролях
          </h1>
          <p className="text-body text-text-secondary mb-10 max-w-3xl">
            Конкретні AI-ланцюжки з цифрами для кожної ролі у вашій галузі.
            Не абстрактне &ldquo;впровадження AI&rdquo; — а працюючі автоматизації:
            тригер → обробка → AI-компонент → дія → результат.
          </p>

          {/* Industry grid */}
          <h2 className="text-h2 text-text mb-6">Галузі</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/cases/${ind.slug}`}
                className="card !p-5 hover:border-primary/40 group transition-all"
              >
                <span className="text-3xl block mb-2">{ind.emoji}</span>
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {ind.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  8 ролей, 15-25 автоматизацій
                </p>
              </Link>
            ))}
          </div>

          {/* Roles grid */}
          <h2 className="text-h2 text-text mb-6">Ролі</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {ROLES.map((role) => (
              <div
                key={role.slug}
                className="card !p-5"
              >
                <span className="text-2xl block mb-2">{role.emoji}</span>
                <h3 className="font-semibold text-text mb-2">{role.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {INDUSTRIES.slice(0, 4).map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/cases/${ind.slug}/${role.slug}`}
                      className="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors"
                    >
                      {ind.emoji} {ind.name.split(" / ")[0].split("-")[0]}
                    </Link>
                  ))}
                  <span className="text-xs px-2 py-0.5 text-text-secondary">
                    +{INDUSTRIES.length - 4}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="card bg-surface-alt text-center">
            <h2 className="text-h3 text-text mb-3">
              Не знайшли свою галузь або роль?
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              Замовте AI-аудит — ми проаналізуємо ваш бізнес і покажемо
              конкретні автоматизації для вашої компанії.
            </p>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
