"use client";

import { useState } from "react";
import { FadeIn, GlassCard, GradientText } from "./motion";
import { ConsultationModal } from "@/components/shared/ConsultationModal";
import { ACCELERATOR_URL } from "@/lib/constants";

const STEPS = [
  {
    num: "1",
    title: "ПОРАДЬСЯ З ЕКСПЕРТОМ",
    sub: "1 година · Безкоштовно",
    text: "Розберемо ваш бізнес і покажемо, що автоматизувати першим.",
    cta: { label: "Забронювати консультацію", action: "modal" as const },
    glow: "blue" as const,
  },
  {
    num: "2",
    title: "НАВЧИ 100% СПІВРОБІТНИКІВ",
    sub: "5 днів · Від 1 999 грн/людину",
    text: "Кожен побудує працюючу автоматизацію для своєї посади. Не дивиться відео. Не проходить тест. А будує працюючий інструмент.",
    details: "Маркетолог — генератор контенту. Бухгалтер — автоматизацію звітів. HR — скринер резюме. Перша — вже в перший день.",
    cta: { label: "Спробувати безкоштовно", action: "trial" as const },
    glow: "violet" as const,
    highlighted: true,
  },
  {
    num: "3",
    title: "ЗБЕРІТЬ ТЕ, ЧОГО AI ПРО ВАС НЕ ЗНАЄ",
    sub: "Перший місяць сервісу — безкоштовно",
    text: "CRM зберігає клієнтів. ERP — фінанси. Але ніхто не зберігає головне: чим займається кожен співробітник щодня.",
    details: "Три питання на день від кожного: що зробив, що планує, яка допомога потрібна. AI аналізує і підказує керівнику, де рухатись швидше.",
    cta: { label: "Підключити AI Advisory Board →", action: "link" as const, href: "https://aiadvisoryboard.me" },
    glow: "blue" as const,
  },
];

export default function V2Roadmap() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 relative">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">
            <GradientText>Як перевести компанію на AI:</GradientText>
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={i}>
              <FadeIn delay={i * 0.15}>
                <GlassCard
                  glow={step.glow}
                  className={`p-6 md:p-8 ${step.highlighted ? "border-blue-500/20 ring-1 ring-blue-500/10" : ""}`}
                >
                  <div className="flex items-start gap-5">
                    <span className="text-5xl md:text-6xl font-black bg-gradient-to-b from-white/20 to-white/5 bg-clip-text text-transparent leading-none shrink-0">
                      {step.num}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/40 mb-3">{step.sub}</p>
                      <p className="text-white/55 mb-2">{step.text}</p>
                      {step.details && (
                        <p className="text-sm text-white/40 mb-4">{step.details}</p>
                      )}
                      {step.cta.action === "modal" ? (
                        <button
                          onClick={() => setModalOpen(true)}
                          className="v2-btn-secondary text-sm"
                        >
                          {step.cta.label}
                        </button>
                      ) : step.cta.action === "trial" ? (
                        <a
                          href={`${ACCELERATOR_URL}/register?plan=trial`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="v2-btn-secondary text-sm inline-block"
                        >
                          {step.cta.label}
                        </a>
                      ) : (
                        <a
                          href={step.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="v2-btn-secondary text-sm inline-block"
                        >
                          {step.cta.label}
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
