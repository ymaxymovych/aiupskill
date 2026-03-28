"use client";

import { FadeIn, GlowBlob } from "./motion";

export default function V2Motivation() {
  return (
    <section className="py-20 relative overflow-hidden">
      <GlowBlob color="violet" size="350px" className="top-0 right-[-150px] opacity-15" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Чому після курсу співробітники самі хочуть автоматизувати
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-white/50 text-lg mb-4">
            Ваші співробітники <strong className="text-white">ЗНАЮТЬ</strong>, що в їхній
            роботі є рутина. Вони живуть з цим щодня.
          </p>
          <p className="text-white/50 text-lg mb-4">
            Але в них не було <strong className="text-white">інструменту</strong>.
          </p>
          <p className="text-white/50 text-lg mb-8">
            Курс дає інструмент. І відбувається хімічна реакція:
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="inline-block bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-xl px-10 py-5 mb-8">
            <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              знання що робити + уміння як зробити = людина не може зупинитись
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-white/40">
            Як спортивний автомобіль хоче, щоб натиснули газ — так навичка побудови
            автоматизацій хоче бути застосована. Дайте шанс кожному.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
