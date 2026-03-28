"use client";

import { ACCELERATOR_URL } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="section-padding pt-32 md:pt-40 bg-surface" id="hero">
      <div className="container-main">
        <div className="grid md:grid-cols-[55%_45%] gap-8 md:gap-12 items-center">
          {/* Left: Text */}
          <div>
            <p className="text-primary font-semibold mb-4 text-lg">
              Для CEO та керівників відділів
            </p>
            <h1 className="text-h1 text-text mb-6">
              Впровадіть AI у вашу
              <br />
              компанію. Системно.
              <br />
              <span className="text-primary">За 2 тижні.</span>
              <br />
              З результатом.
            </h1>
            <p className="text-body text-text-secondary mb-8 max-w-lg">
              Кожен ваш співробітник побудує працюючу AI-автоматизацію для своєї
              посади.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#consultation" className="btn-primary">
                Замовити консультацію
              </a>
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
