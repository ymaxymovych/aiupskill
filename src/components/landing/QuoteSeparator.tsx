"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function QuoteSeparator() {
  const { ref, isVisible } = useIntersection();

  return (
    <section ref={ref} className="bg-surface-dark py-16 md:py-24">
      <div className="container-main text-center">
        <p
          className={cn(
            "text-2xl md:text-4xl font-bold text-text-on-dark leading-snug max-w-3xl mx-auto animate-in",
            isVisible && "visible"
          )}
        >
          1 співробітник з AI = 5 без AI
        </p>
        <p
          className={cn(
            "text-lg md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          Навіть якщо 80% не впораються — ті 20% що залишаться будуть робити ту ж
          роботу. А якщо впораються всі — компанія полетить.
        </p>
        <p
          className={cn(
            "text-sm text-gray-500 mt-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          — Anthropic, дослідження на 100 000 задачах
        </p>
      </div>
    </section>
  );
}
