"use client";

import { FadeIn, GradientText, GlowBlob } from "./motion";

export default function V2McKinsey() {
  return (
    <section className="py-20 relative overflow-hidden">
      <GlowBlob color="violet" size="400px" className="top-[-100px] left-1/2 -translate-x-1/2 opacity-20" />
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed mb-6">
              <GradientText from="from-white/90" to="to-white/60">
                &ldquo;80% компаній впровадили AI.
                <br />
                80% з них не бачать впливу на прибуток.&rdquo;
              </GradientText>
            </blockquote>
            <p className="text-sm text-white/30 mb-8">— McKinsey, 2025</p>
            <div className="v2-divider mx-auto max-w-xs mb-8" />
            <p className="text-lg text-white/50">
              Різниця між першими і другими —{" "}
              <span className="text-white font-medium">навчена команда.</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
