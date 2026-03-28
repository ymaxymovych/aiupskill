"use client";

import { FadeIn, GlassCard } from "./motion";
import DynamicPrice from "@/components/shared/DynamicPrice";
import { ACCELERATOR_URL } from "@/lib/constants";

export default function V2Pricing() {
  return (
    <section className="py-20 md:py-28" id="pricing">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Trial */}
        <FadeIn>
          <GlassCard className="mb-8 p-6 text-center border-dashed" glow="none">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">0 грн</span>
                <span className="text-sm text-white/40 ml-2">— перший модуль безкоштовно</span>
              </div>
              <div className="text-left text-sm text-white/40">
                <p>✓ AI-аудит вашої рутини</p>
                <p>✓ Перша перемога за 30 хвилин</p>
                <p>✓ Без картки, без зобов&apos;язань</p>
              </div>
              <a
                href={`${ACCELERATOR_URL}/register?plan=trial`}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-btn-secondary whitespace-nowrap text-sm"
              >
                Спробувати безкоштовно
              </a>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Dynamic pricing slider — dark theme overrides */}
        <FadeIn delay={0.15}>
          <div className="v2-pricing-dark">
            <DynamicPrice
              people={10}
              showSlider={true}
              showPayback={true}
              variant="hero"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
