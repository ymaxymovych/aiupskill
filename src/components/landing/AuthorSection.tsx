"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { TELEGRAM_URL, LINKEDIN_URL } from "@/lib/constants";

const ACHIEVEMENTS = [
  "Перший в Україні продав стартап за $1М+",
  "3000 співбесід, 300+ людей в управлінні",
  "50+ стартапів, 10 у прибуток, 4 продав",
  "К.т.н., прикладна математика + економіка",
];

export default function AuthorSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="author">
      <div className="container-main" ref={ref}>
        <div className="grid md:grid-cols-[300px_1fr] gap-10 items-start">
          {/* Photo placeholder */}
          <div
            className={cn(
              "aspect-[3/4] bg-surface-alt rounded-2xl border border-border overflow-hidden mx-auto md:mx-0 w-full max-w-[300px] animate-in",
              isVisible && "visible"
            )}
          >
            <img
              src="https://media.licdn.com/dms/image/v2/D4D03AQGjVYPqE3gBSg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1719350091498?e=1726099200&v=beta&t=placeholder"
              alt="Ярослав Максимович"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `<div class="flex items-center justify-center h-full text-center text-text-secondary"><div><div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"><span class="text-3xl">&#128084;</span></div><p class="font-medium text-text">Ярослав Максимович</p></div></div>`;
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <h2
              className={cn(
                "text-h2 text-text mb-6 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              Про Ярослава
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
                  <span className="text-primary mt-1">&#10003;</span>
                  <span className="text-text">{a}</span>
                </li>
              ))}
            </ul>

            <blockquote
              className={cn(
                "border-l-4 border-primary pl-4 py-2 text-text-secondary italic mb-6 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              &ldquo;Я не просто навчаю AI — я будую компанії з AI всередині.
              Кожен інструмент, який ви отримаєте на курсі, я використовую сам у
              своїх бізнесах щодня.&rdquo;
            </blockquote>

            <div
              className={cn(
                "flex flex-wrap gap-4 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: "600ms" }}
            >
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Telegram &rarr;
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                LinkedIn &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
