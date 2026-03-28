import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "150 AI-автоматизацій для бізнесу: готові ланцюжки | AI Upskill",
  description:
    "Каталог AI-автоматизацій: ліди, контент, HR, аналітика, документи, фінанси. Кожна — з кроками ланцюжка, інструментами та ROI.",
};

const CATEGORIES = [
  { name: "Ліди та продажі", emoji: "💰", count: 20 },
  { name: "Контент та маркетинг", emoji: "📝", count: 20 },
  { name: "HR та рекрутинг", emoji: "👥", count: 15 },
  { name: "Аналітика та звітність", emoji: "📊", count: 15 },
  { name: "Документи та бек-офіс", emoji: "📄", count: 15 },
  { name: "Клієнтський сервіс", emoji: "🎧", count: 15 },
  { name: "Управління та операції", emoji: "⚙️", count: 15 },
  { name: "Фінанси", emoji: "💳", count: 15 },
  { name: "Галузеві", emoji: "🏭", count: 20 },
];

export default function AutomationsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <div className="container-main section-padding">
          <Breadcrumbs items={[{ label: "Автоматизації" }]} />

          <h1 className="text-h1 text-text mb-4">
            150 AI-автоматизацій для бізнесу
          </h1>
          <p className="text-body text-text-secondary mb-10 max-w-3xl">
            Готові ланцюжки для кожної ролі: тригер → збір даних → AI-обробка → дія → результат.
            Кожна автоматизація — з конкретними інструментами та цифрами ROI.
          </p>

          {/* Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="card !p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h2 className="font-semibold text-text">{cat.name}</h2>
                </div>
                <p className="text-sm text-text-secondary">
                  {cat.count} автоматизацій
                </p>
              </div>
            ))}
          </div>

          {/* Placeholder for generated content */}
          <div className="card bg-surface-alt text-center">
            <p className="text-text-secondary mb-4">
              Повний каталог з фільтрами та карткам автоматизацій буде доступний
              після генерації контенту.
            </p>
            <div className="flex justify-center gap-3">
              <a href="/#consultation" className="btn-primary">
                Замовити AI-аудит вашої компанії
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
