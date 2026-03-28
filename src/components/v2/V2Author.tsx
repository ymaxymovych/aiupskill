"use client";

import { FadeIn, SlideIn, GradientText, GlowBlob } from "./motion";

const ACHIEVEMENTS = [
  "Перший в Україні продав стартап за 1 000 000+",
  "3000 співбесід, 300+ людей в управлінні",
  "50+ стартапів, 10 у прибуток, 4 продав",
  "К.т.н., прикладна математика + економіка",
];

const FORBES = [
  { title: "«Портфель аукціоніста»", href: "/pdf/forbes-portfolio-auctioneer.pdf" },
  { title: "«Інтелектуальні власники»", href: "/pdf/forbes-intellectual-owners.pdf" },
];

export default function V2Author() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="author">
      <GlowBlob color="blue" size="400px" className="top-0 left-[-200px] opacity-10" />
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-[280px_1fr] gap-10 items-start">
          <SlideIn from="left">
            <div className="relative mx-auto md:mx-0 w-full max-w-[280px]">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-white/[0.08]">
                <img
                  src="/images/author.png"
                  alt="Ярослав Максимович"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-blue-500/10 to-violet-500/10 -z-10 blur-xl" />
            </div>
          </SlideIn>

          <SlideIn from="right" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <GradientText>Ярослав Максимович</GradientText>
            </h2>

            <ul className="space-y-3 mb-6">
              {ACHIEVEMENTS.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-blue-400 mt-0.5">→</span>
                  <span className="text-white/70">{a}</span>
                </li>
              ))}
            </ul>

            <blockquote className="border-l-2 border-blue-500/30 pl-4 py-2 mb-6">
              <p className="text-white/60 leading-relaxed mb-2">
                &ldquo;Свій перший AI-проект я будував 500 годин.
                Другий — лише 30. Розробив програму, де за 10 годин
                кожен зробить свою першу автоматизацію.
              </p>
              <p className="text-white/60 leading-relaxed">
                Я не теоретик, не коуч і не програміст.
                У мене мислення керівника — бо я ніколи
                не працював за зарплату.&rdquo;
              </p>
            </blockquote>

            <div className="mb-6">
              <p className="text-xs font-bold text-white/25 tracking-widest uppercase mb-2">FORBES</p>
              <div className="flex flex-wrap gap-4">
                {FORBES.map((f) => (
                  <a
                    key={f.href}
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400/70 hover:text-blue-400 transition-colors"
                  >
                    📰 {f.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/yaroslav.maxymovych/posts/pfbid02g3mpcjaKwkFChuDZK46okoSdSdouceYASXQ3eVNvkpPPYL9oUL8NuD5u2vbNnga9l" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Facebook →</a>
              <a href="https://t.me/YaroslavMaxymovych" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Telegram →</a>
              <a href="https://linkedin.com/in/yaroslavmaxymovych" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">LinkedIn →</a>
            </div>
          </SlideIn>
        </div>

        {/* Social proof */}
        <FadeIn delay={0.3}>
          <div className="mt-16 text-center">
            <p className="text-lg text-white/50">
              &ldquo;Перші 14 випускників привели ще 5 знайомих.
              <br />
              Без реклами. Просто порекомендували.&rdquo;
            </p>
            <p className="text-sm text-white/30 mt-2">
              У третини з них вдалось зробити свій працюючий продукт за час навчання.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
