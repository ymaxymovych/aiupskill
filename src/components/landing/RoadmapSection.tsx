"use client";

import { useState } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { ConsultationModal } from "@/components/shared/ConsultationModal";
import { ACCELERATOR_URL } from "@/lib/constants";

export default function RoadmapSection() {
  const { ref, isVisible } = useIntersection();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="section-padding bg-white" id="roadmap">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="container-main max-w-3xl" ref={ref}>
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold text-text text-center mb-12 animate-in",
            isVisible && "visible"
          )}
        >
          Як перевести компанію на AI:
        </h2>

        {/* Step 1 */}
        <div
          className={cn(
            "relative border border-border rounded-xl p-6 md:p-8 mb-2 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl font-black text-primary/20 leading-none shrink-0">
              1
            </span>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-text mb-1">
                ПОРАДЬСЯ З ЕКСПЕРТОМ
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                1 година · Безкоштовно
              </p>
              <p className="text-body text-text-secondary mb-4">
                Розберемо ваш бізнес і покажемо,
                що автоматизувати першим.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-primary text-sm"
              >
                Забронювати консультацію
              </button>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center py-2">
          <svg className="w-6 h-10 text-primary/30" viewBox="0 0 24 40" fill="none">
            <path d="M12 0v34m0 0l-8-8m8 8l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Step 2 */}
        <div
          className={cn(
            "relative border-2 border-primary rounded-xl p-6 md:p-8 mb-2 ring-2 ring-primary/10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl font-black text-primary/20 leading-none shrink-0">
              2
            </span>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-text mb-1">
                НАВЧИ 100% СПІВРОБІТНИКІВ
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                5 днів · Від 1 999 грн/людину
              </p>
              <p className="text-body text-text-secondary mb-2">
                Кожен побудує працюючу автоматизацію для своєї посади.
                Не дивиться відео. Не проходить тест. А будує працюючий інструмент.
              </p>
              <p className="text-sm text-text-secondary mb-4">
                Маркетолог — генератор контенту.
                Бухгалтер — автоматизацію звітів.
                HR — скринер резюме.
                Перша — вже в перший день.
              </p>
              <a
                href={`${ACCELERATOR_URL}/register?plan=trial`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Спробувати безкоштовно
              </a>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center py-2">
          <svg className="w-6 h-10 text-primary/30" viewBox="0 0 24 40" fill="none">
            <path d="M12 0v34m0 0l-8-8m8 8l8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Step 3 */}
        <div
          className={cn(
            "relative border border-border rounded-xl p-6 md:p-8 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl font-black text-primary/20 leading-none shrink-0">
              3
            </span>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-text mb-1">
                ЗБЕРІТЬ ТЕ, ЧОГО AI ПРО ВАС НЕ ЗНАЄ
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                Перший місяць сервісу — безкоштовно
              </p>
              <div className="text-body text-text-secondary mb-4 space-y-2">
                <p>
                  CRM зберігає клієнтів. ERP — фінанси. Але ніхто не зберігає головне:
                  чим займається кожен співробітник щодня.
                </p>
                <p>
                  Без цих даних AI не може підказати, що оптимізувати у вашій компанії.
                </p>
                <p>
                  Три питання на день від кожного: що зробив, що планує, яка допомога потрібна.
                  AI аналізує і підказує керівнику, де рухатись швидше.
                </p>
              </div>
              <a
                href="https://aiadvisoryboard.me"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Підключити AI Advisory Board &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
