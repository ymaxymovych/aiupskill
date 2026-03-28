"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function FirstWinSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="py-16 bg-primary/5" ref={ref}>
      <div className="container-main max-w-2xl text-center">
        <h2
          className={cn(
            "text-2xl md:text-3xl font-bold text-text mb-4 animate-in",
            isVisible && "visible"
          )}
        >
          Авторська методика: спершу зроби — потім зрозумій
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary mb-6 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          Більшість курсів починають з теорії. Ми починаємо з результату.
        </p>
        <div
          className={cn(
            "inline-block bg-white border border-primary/20 rounded-xl px-8 py-4 mb-6 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-xl md:text-2xl font-bold text-primary">
            Перша перемога — за 30 хвилин.
          </p>
        </div>
        <p
          className={cn(
            "text-body text-text-secondary mb-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "250ms" }}
        >
          Ваш співробітник ще не розуміє, що саме він зробив.
          Але автоматизація вже працює. Прямо перед ним.
        </p>
        <p
          className={cn(
            "text-body text-text italic mb-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          &ldquo;Нічого собі, в мене получилось!&rdquo;
        </p>
        <p
          className={cn(
            "text-body text-text-secondary animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "350ms" }}
        >
          Саме цей момент створює віру: якщо в мене вийшло це —
          вийде і решта. Далі йде розуміння, інструменти,
          і повноцінний проект. Але точка неповернення —
          перші 30 хвилин.
        </p>
      </div>
    </section>
  );
}
