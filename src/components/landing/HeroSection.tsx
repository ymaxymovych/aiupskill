"use client";

import { useState } from "react";
import { ACCELERATOR_URL } from "@/lib/constants";
import { ConsultationModal } from "@/components/shared/ConsultationModal";

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="section-padding pt-32 md:pt-40 bg-surface" id="hero">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="container-main">
        <div className="grid md:grid-cols-[55%_45%] gap-8 md:gap-12 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-primary font-semibold mb-4 text-lg">
              AI-агенти збільшують продуктивність до 5 раз — Anthropic, 100 000 задач
            </p>
            <h1 className="text-h1 text-text mb-6">
              Кожен ваш співробітник
              <br />
              побудує AI-автоматизацію
              <br />
              для своєї посади.
              <br />
              <span className="text-primary">За 5 днів.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-medium mb-8 max-w-lg">
              Від маркетолога до бухгалтера. Своїми руками. Без коду.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                Замовити консультацію
              </button>
              <a
                href={`${ACCELERATOR_URL}/register?plan=trial`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Спробувати безкоштовно
              </a>
            </div>
            <div className="flex gap-8 mt-6 text-sm text-text-secondary">
              <span>15 хвилин — розберемо задачі вашої команди</span>
              <span className="hidden sm:inline">
                Перший модуль — без оплати
              </span>
            </div>
          </div>

          {/* Right: Video placeholder */}
          <div className="relative aspect-video bg-surface-alt rounded-2xl overflow-hidden border border-border shadow-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-secondary">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="font-medium text-text">Відео 3 хв</p>
              <p className="text-sm">Відео скоро буде доступне</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
