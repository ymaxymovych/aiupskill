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

        {/* Dynamic pricing slider */}
        <FadeIn delay={0.15}>
          <div className="[&_*]:!bg-transparent [&_.bg-white]:!bg-white/[0.04] [&_.bg-gray-50]:!bg-white/[0.03] [&_.bg-green-50]:!bg-green-500/[0.06] [&_.bg-blue-50]:!bg-blue-500/[0.06] [&_.text-gray-900]:!text-white [&_.text-gray-700]:!text-white/70 [&_.text-gray-500]:!text-white/45 [&_.text-gray-400]:!text-white/30 [&_.border-gray-200]:!border-white/[0.08] [&_.border-gray-300]:!border-white/[0.1]">
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
