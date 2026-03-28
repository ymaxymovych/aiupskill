"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function SocialProofReal() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="py-12 bg-surface" ref={ref}>
      <div className="container-main max-w-2xl text-center">
        <blockquote
          className={cn(
            "animate-in",
            isVisible && "visible"
          )}
        >
          <p className="text-lg md:text-xl font-semibold text-text mb-3">
            &ldquo;Перші 14 випускників привели ще 5 знайомих.
            Без реклами. Просто порекомендували.&rdquo;
          </p>
          <p className="text-body text-text-secondary">
            У третини з них вдалось зробити свій працюючий продукт
            за час навчання.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
