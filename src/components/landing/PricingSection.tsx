"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { ACCELERATOR_URL } from "@/lib/constants";
import DynamicPrice from "@/components/shared/DynamicPrice";

export default function PricingSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="pricing">
      <div className="container-main" ref={ref}>
        {/* Trial card */}
        <div
          className={cn(
            "card mb-8 border-dashed border-2 border-gray-300 bg-gray-50/50 text-center animate-in",
            isVisible && "visible"
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div>
              <span className="text-3xl font-bold text-primary">0 грн</span>
              <span className="text-sm text-text-secondary ml-2">
                — перший модуль безкоштовно
              </span>
            </div>
            <div className="text-left text-sm text-text-secondary">
              <p>✓ AI-аудит вашої рутини</p>
              <p>✓ Перша маленька перемога за 30 хвилин</p>
              <p>✓ Без картки, без зобов&apos;язань</p>
            </div>
            <a
              href={`${ACCELERATOR_URL}/register?plan=trial`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              Спробувати безкоштовно
            </a>
          </div>
        </div>

        {/* Main dynamic pricing */}
        <div
          className={cn("animate-in", isVisible && "visible")}
          style={{ transitionDelay: "200ms" }}
        >
          <DynamicPrice
            people={10}
            showSlider={true}
            showPayback={true}
            variant="hero"
          />
        </div>
      </div>
    </section>
  );
}
