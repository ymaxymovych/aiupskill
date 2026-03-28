"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function McKinseyQuote() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="py-16 md:py-20 bg-[#111827]" ref={ref}>
      <div className="container-main max-w-3xl text-center">
        <blockquote
          className={cn(
            "animate-in",
            isVisible && "visible"
          )}
        >
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-4">
            &ldquo;80% компаній впровадили AI.
            <br />
            80% з них не бачать впливу на прибуток.&rdquo;
          </p>
          <footer className="text-gray-400 text-sm mb-6">
            — McKinsey, 2025
          </footer>
        </blockquote>
        <p
          className={cn(
            "text-lg md:text-xl text-[#f59e0b] font-semibold animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          Різниця між першими і другими — навчена команда.
        </p>
      </div>
    </section>
  );
}
