"use client";

import { FadeIn, GlowBlob } from "./motion";

export default function V2FirstWin() {
  return (
    <section className="py-20 relative overflow-hidden">
      <GlowBlob color="blue" size="300px" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Авторська методика: спершу зроби — потім зрозумій
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-white/50 mb-8">
            Більшість курсів починають з теорії. Ми починаємо з результату.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="inline-block bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-xl px-10 py-5 mb-8">
            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Перша перемога — за 30 хвилин.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-white/50 mb-4">
            Ваш співробітник ще не розуміє, що саме він зробив.
            Але автоматизація вже працює. Прямо перед ним.
          </p>
          <p className="text-white italic mb-4">
            &ldquo;Нічого собі, в мене получилось!&rdquo;
          </p>
          <p className="text-white/40 text-sm">
            Саме цей момент створює віру: якщо в мене вийшло це —
            вийде і решта. Точка неповернення — перші 30 хвилин.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
