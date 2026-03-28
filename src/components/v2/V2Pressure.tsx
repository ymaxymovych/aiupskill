"use client";

import { FadeIn, GlassCard, GradientText, AnimatedCounter } from "./motion";

export default function V2Pressure() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Що буде, якщо ви не автоматизуєтесь
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn delay={0.1}>
            <GlassCard glow="red" className="p-8 h-full">
              <p className="text-xs font-bold text-red-400/60 tracking-widest uppercase mb-4">
                Ваша компанія (без AI)
              </p>
              <div className="text-5xl font-black text-white/20 mb-4">
                <AnimatedCounter value={10} className="text-5xl font-black text-white/20" /> менеджерів
              </div>
              <p className="text-white/50 mb-2">Кожен обробляє <span className="text-white font-medium">30 заявок/день</span>. Вручну.</p>
              <p className="text-white/30 text-sm">Повільно. Дорого. Помилки.</p>
            </GlassCard>
          </FadeIn>

          <FadeIn delay={0.2}>
            <GlassCard glow="green" className="p-8 h-full border-green-500/10">
              <p className="text-xs font-bold text-green-400/60 tracking-widest uppercase mb-4">
                Конкурент (з AI-ланцюжками)
              </p>
              <div className="text-5xl font-black text-white/20 mb-4">
                <AnimatedCounter value={4} className="text-5xl font-black text-white/20" /> менеджери
              </div>
              <p className="text-white/50 mb-2">Кожен обробляє <span className="text-green-400 font-medium">150 заявок/день</span>. Автоматично.</p>
              <p className="text-white/30 text-sm">Менша команда. Вища швидкість. Нижча ціна.</p>
            </GlassCard>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <p className="text-center text-white/50 mt-10 text-lg">
            Питання не в тому, чи автоматизуватись.
            <br />
            Питання — <GradientText className="font-semibold">хто зробить це першим: ви чи конкурент.</GradientText>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
