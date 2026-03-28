"use client";

import { FadeIn, GlassCard } from "./motion";

const MISTAKES = [
  { title: "Купити ChatGPT Team", result: "ніхто не користується" },
  { title: "Відправити на відео-курс", result: "забувають через тиждень" },
  { title: "Найняти AI-консультанта", result: "він піде, знання з ним" },
  { title: "Автоматизувати 1 процес", result: "решта працює по-старому" },
];

export default function V2Problem() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Чому 80% компаній провалюють впровадження AI
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-white/45 text-center max-w-2xl mx-auto mb-6">
            Типовий сценарій: CEO купує ChatGPT Team за 1 000 грн/людину. Кидає лінк в
            корпоративний Slack. Через місяць — 3 людини з 50 хоч раз зайшли.
          </p>
          <p className="text-white/45 text-center max-w-2xl mx-auto mb-12">
            ChatGPT без контексту вашої роботи — це розумний Google.
            Він знає все про світ, але нічого про ваші процеси.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MISTAKES.map((m, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.08}>
              <GlassCard glow="red" className="p-6 text-center h-full">
                <div className="text-3xl mb-3 text-red-400/60">✕</div>
                <h3 className="font-semibold text-white mb-2">{m.title}</h3>
                <p className="text-sm text-white/40">{m.result}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
