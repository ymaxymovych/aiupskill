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
          Перша перемога — за 30 хвилин.
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          Ваш співробітник ще не розуміє, що робить.
          Але вже бачить: воно працює.
        </p>
        <p
          className={cn(
            "text-body text-text-secondary mt-2 font-medium animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "250ms" }}
        >
          Саме звідси береться мотивація дійти до кінця.
        </p>
      </div>
    </section>
  );
}
