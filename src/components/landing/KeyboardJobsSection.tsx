"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const EXAMPLES = [
  {
    role: "Бухгалтер",
    emoji: "🧮",
    input: { label: "Вхід", text: "Отримує рахунок від постачальника" },
    processing: { label: "Обробка", text: "Перевіряє реквізити, суму, відповідність договору" },
    decision: { label: "Рішення", text: "Проводить оплату" },
    chain: "Email → OCR → Перевірка по базі → Оплата через API банку",
  },
  {
    role: "Маркетолог",
    emoji: "📊",
    input: { label: "Вхід", text: "Нова заявка з Facebook" },
    processing: { label: "Обробка", text: "Кваліфікує ліда, підбирає пропозицію" },
    decision: { label: "Рішення", text: "Відправляє персоналізований лист" },
    chain: "Webhook → AI-скоринг → CRM → Автоматичний email",
  },
  {
    role: "HR",
    emoji: "👥",
    input: { label: "Вхід", text: "Резюме на пошту" },
    processing: { label: "Обробка", text: "Оцінює відповідність вакансії" },
    decision: { label: "Рішення", text: "Запрошує на співбесіду або відмовляє" },
    chain: "Email → Парсинг PDF → AI-оцінка → Автовідповідь",
  },
];

export default function KeyboardJobsSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-white">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-3 animate-in",
            isVisible && "visible"
          )}
        >
          Будь-яка посада, де працюють з клавіатурою, піддається автоматизації
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-10 max-w-3xl mx-auto animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Робота кожного співробітника складається з трьох кроків:
          отримати інформацію, обробити її, прийняти рішення.
          AI-агенти вміють робити всі три кроки. Автономно. 24/7.
        </p>

        {/* Visual: Input → Processing → Decision */}
        <div
          className={cn(
            "flex items-center justify-center gap-2 md:gap-4 mb-10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          {["Вхід", "→", "Обробка", "→", "Рішення"].map((item, i) =>
            item === "→" ? (
              <span key={i} className="text-primary text-xl font-bold">→</span>
            ) : (
              <div
                key={i}
                className="px-4 py-2 md:px-6 md:py-3 bg-primary/5 border border-primary/20 rounded-lg text-center"
              >
                <span className="text-sm md:text-base font-semibold text-primary">{item}</span>
              </div>
            )
          )}
        </div>

        {/* Example cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {EXAMPLES.map((ex, i) => (
            <div
              key={i}
              className={cn(
                "card animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{ex.emoji}</span>
                <h3 className="text-h3 text-text">{ex.role}</h3>
              </div>

              <div className="space-y-3 mb-4">
                {[ex.input, ex.processing, ex.decision].map((step, j) => (
                  <div key={j} className="flex gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5",
                        j === 0 && "bg-blue-50 text-blue-600",
                        j === 1 && "bg-amber-50 text-amber-600",
                        j === 2 && "bg-green-50 text-green-600"
                      )}
                    >
                      {step.label}
                    </span>
                    <span className="text-sm text-text-secondary">{step.text}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-text-secondary mb-1">AI-ланцюжок:</p>
                <p className="text-sm font-medium text-primary">{ex.chain}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-secondary text-center mt-6 italic">
          * Мова про посади, де основна робота відбувається за комп&apos;ютером.
          Є професії (будівельники, водії, хірурги), де автоматизація працює інакше.
        </p>
      </div>
    </section>
  );
}
