"use client";

import { FadeIn, GlassCard, GradientText } from "./motion";

const STATS = [
  { value: "5x", label: "приріст продуктивності", source: "Anthropic", detail: "100 000 задач" },
  { value: "66%", label: "приріст ефективності", source: "PwC", detail: "308 компаній" },
  { value: "4.5 млрд", label: "приріст прибутку", source: "IBM", detail: "270 000 людей" },
  { value: "+38-50%", label: "виконання планів", source: "Дослідження", detail: "планування + звітність" },
  { value: "17%→37%", label: "залученість після навчання", source: "Gartner", detail: "подвоєння мотивації" },
];

export default function V2Research() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Результати, підтверджені <GradientText>дослідженнями</GradientText>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STATS.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <GlassCard glow="violet" className="p-5 text-center h-full">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 font-medium mb-2">{stat.label}</div>
                <div className="text-xs text-white/30">
                  <span className="font-medium">{stat.source}</span> · {stat.detail}
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="flex flex-wrap justify-center gap-6 mt-10 items-center">
            <span className="text-sm text-white/25">Як бачено у:</span>
            <span className="text-sm font-bold text-white/50">FORBES</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
