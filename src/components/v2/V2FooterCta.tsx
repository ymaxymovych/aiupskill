"use client";

import { useState } from "react";
import { FadeIn, GlowBlob, GradientText } from "./motion";
import { ACCELERATOR_URL } from "@/lib/constants";
import { ConsultationModal } from "@/components/shared/ConsultationModal";

export default function V2FooterCta() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="consultation">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <GlowBlob color="blue" size="500px" className="top-[-200px] left-1/2 -translate-x-1/2 opacity-20" />
      <GlowBlob color="violet" size="400px" className="bottom-[-200px] right-[-100px] opacity-15" />

      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <GradientText>Безкоштовна консультація: 15 хвилин</GradientText>
          </h2>
          <p className="text-lg text-white/45 mb-10">
            Розберемо задачі вашої команди і підберемо план.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setModalOpen(true)} className="v2-btn-primary text-lg px-10">
              Замовити консультацію →
            </button>
            <a
              href={`${ACCELERATOR_URL}/register?plan=trial`}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-btn-secondary text-lg text-center"
            >
              Спробувати безкоштовно
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-sm text-white/25 mt-6">
            Або напишіть:{" "}
            <a href="https://t.me/YaroslavMaxymovych" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              t.me/YaroslavMaxymovych
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
