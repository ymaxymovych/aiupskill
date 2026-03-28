"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

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

export default function AuthorSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="author">
      <div className="container-main" ref={ref}>
        <div className="grid md:grid-cols-[300px_1fr] gap-10 items-start">
          {/* Photo */}
          <div
            className={cn(
              "aspect-[3/4] bg-surface-alt rounded-2xl border border-border overflow-hidden mx-auto md:mx-0 w-full max-w-[300px] animate-in",
              isVisible && "visible"
            )}
          >
            <img
              src="/images/author.png"
              alt="Ярослав Максимович"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bio — від першої особи */}
          <div>
            <h2
              className={cn(
                "text-h2 text-text mb-6 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              Ярослав Максимович
            </h2>

            <ul className="space-y-3 mb-6">
              {ACHIEVEMENTS.map((a, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-start gap-3 text-body animate-in",
                    isVisible && "visible"
                  )}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                >
                  <span className="text-primary mt-1">→</span>
                  <span className="text-text">{a}</span>
                </li>
              ))}
            </ul>

            <blockquote
              className={cn(
                "border-l-4 border-primary pl-4 py-3 mb-6 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              <p className="text-text leading-relaxed mb-2">
                &ldquo;Свій перший AI-проект я будував 500 годин.
                Другий — лише 30.
                Розробив програму, де за 10 годин
                кожен зробить свою першу автоматизацію.
              </p>
              <p className="text-text leading-relaxed">
                Я не теоретик, не коуч і не програміст.
                У мене мислення керівника — бо я ніколи
                не працював за зарплату.&rdquo;
              </p>
            </blockquote>

            {/* Forbes */}
            <div
              className={cn(
                "mb-6 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                FORBES
              </p>
              <div className="flex flex-wrap gap-4">
                {FORBES.map((f) => (
                  <a
                    key={f.href}
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline font-medium text-sm"
                  >
                    <span>📰</span>
                    {f.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div
              className={cn(
                "flex flex-wrap gap-4 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "700ms" }}
            >
              <a
                href="https://www.facebook.com/yaroslav.maxymovych/posts/pfbid02g3mpcjaKwkFChuDZK46okoSdSdouceYASXQ3eVNvkpPPYL9oUL8NuD5u2vbNnga9l"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Facebook →
              </a>
              <a
                href="https://t.me/YaroslavMaxymovych"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Telegram →
              </a>
              <a
                href="https://linkedin.com/in/yaroslavmaxymovych"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                LinkedIn →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
