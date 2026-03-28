"use client";

import { FadeIn, GlassCard, GradientText } from "./motion";

const EXAMPLES = [
  {
    role: "БУХГАЛТЕР",
    flow: ["Рахунок", "Перевірка", "Оплата"],
    chain: "Email → OCR → Перевірка → Оплата",
  },
  {
    role: "МАРКЕТОЛОГ",
    flow: ["Заявка", "Кваліфікація", "Лист"],
    chain: "Webhook → AI-скоринг → CRM → Email",
  },
  {
    role: "HR",
    flow: ["Резюме", "Оцінка", "Запрошення"],
    chain: "Email → Парсинг → AI-оцінка → Автовідповідь",
  },
];

export default function V2Keyboard() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Будь-яка посада, де працюють з клавіатурою,
            <br />
            <GradientText>піддається автоматизації</GradientText>
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="text-center text-white/45 max-w-2xl mx-auto mb-6 space-y-2">
            <p>Робота кожного складається з трьох кроків:</p>
            <div className="flex justify-center gap-4 text-sm font-medium text-white/60">
              <span>1. Отримати інформацію</span>
              <span className="text-white/20">→</span>
              <span>2. Обробити</span>
              <span className="text-white/20">→</span>
              <span>3. Прийняти рішення</span>
            </div>
            <p>AI-агенти вміють робити всі три кроки. Автономно. 24/7.</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {EXAMPLES.map((ex, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.1}>
              <GlassCard glow="blue" className="p-6 h-full">
                <p className="text-xs font-bold text-white/30 tracking-widest uppercase mb-4">
                  {ex.role}
                </p>
                <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                  {ex.flow.map((step, j) => (
                    <span key={j} className="flex items-center gap-2">
                      {j > 0 && <span className="text-white/20">→</span>}
                      <span className="px-2 py-1 bg-white/[0.06] rounded">{step}</span>
                    </span>
                  ))}
                </div>
                <div className="v2-divider mb-4" />
                <p className="text-xs text-white/30 mb-1">AI-ланцюжок:</p>
                <code className="text-sm text-blue-400/80">{ex.chain}</code>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
