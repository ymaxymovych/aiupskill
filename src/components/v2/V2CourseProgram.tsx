"use client";

import { FadeIn, GlassCard, GradientText } from "./motion";

const MODULES = [
  { num: "01", title: "Аудит рутини + перша перемога", desc: "AI аналізує робочий день, підказує що автоматизувати. Перша маленька перемога за 30 хвилин.", day: "День 1" },
  { num: "02", title: "Як думати для AI", desc: "Промпт-інжиніринг без води. Як ставити задачі агентам. Різниця між «попросити ChatGPT» і «побудувати ланцюжок».", day: "День 2" },
  { num: "03", title: "AI-інструменти та агенти", desc: "Claude, ChatGPT, n8n, vibe-coding, API-інтеграції. Не теорія — руками спробувати кожен.", day: "День 3" },
  { num: "04", title: "Побудова AI-ланцюжка", desc: "Від ТЗ до працюючого прототипу. Тригер → обробка → AI-компонент → дія → результат.", day: "День 4" },
  { num: "05", title: "Запуск, вимірювання, здача", desc: "Деплой автоматизації. Як виміряти ROI. Здача фінального проекту — працююча автоматизація 24/7.", day: "День 5" },
];

export default function V2CourseProgram() {
  return (
    <section className="py-20 md:py-28" id="program">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
            <GradientText>5 модулів.</GradientText> 10 годин. 1 автоматизація.
          </h2>
          <p className="text-white/40 text-center mb-12">
            Кожен модуль відкривається після здачі попереднього.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-violet-500/20 to-transparent" />

          <div className="space-y-4">
            {MODULES.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 ring-4 ring-[#0a0a0a] relative z-10" />
                  </div>

                  <GlassCard glow="blue" className="flex-1 p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold bg-gradient-to-b from-white/20 to-white/5 bg-clip-text text-transparent shrink-0">
                        {m.num}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">{m.title}</h3>
                          <span className="text-xs text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full">{m.day}</span>
                        </div>
                        <p className="text-sm text-white/40">{m.desc}</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
