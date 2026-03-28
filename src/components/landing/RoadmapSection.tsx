"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { Phone, GraduationCap, HeartHandshake } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Phone,
    title: "КОНСУЛЬТАЦІЯ",
    time: "15 хвилин",
    price: "Безкоштовно",
    items: ["Аналіз бізнесу", "AI-аудит компанії", "Персональний roadmap"],
    cta: { label: "Записатись", href: "#consultation" },
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "НАВЧАННЯ",
    time: "2 тижні, ~20 годин",
    price: "$79-99/людину",
    items: [
      "6 модулів",
      "Кожен будує автоматизацію",
      "Менеджер-дашборд",
      "Сертифікат",
    ],
    cta: { label: "Детальніше", href: "#program" },
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "ПІДТРИМКА",
    time: "4 тижні",
    price: "Включено у вартість",
    items: [
      "Telegram-чат випускників",
      "Щотижневий Q&A з Ярославом",
      "Допомога з 2-ю автоматизацією",
      "Фідбек на фінальний проект",
    ],
    cta: null,
  },
];

export default function RoadmapSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="roadmap">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-2 animate-in",
            isVisible && "visible"
          )}
        >
          Від &ldquo;ми нічого не знаємо про AI&rdquo;
        </h2>
        <p
          className={cn(
            "text-h3 text-primary text-center mb-12 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          до AI-enabled команди
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={cn(
                "card relative animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 200}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-h3 text-text mb-2">{step.title}</h3>
              <div className="flex gap-4 text-sm text-text-secondary mb-4">
                <span>{step.time}</span>
                <span className="font-semibold text-primary">{step.price}</span>
              </div>
              <ul className="space-y-2">
                {step.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-success mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              {step.cta && (
                <a
                  href={step.cta.href}
                  className="inline-block mt-6 text-primary font-semibold hover:underline"
                >
                  {step.cta.label} &rarr;
                </a>
              )}

              {/* Arrow connector (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-5 text-border text-2xl">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#consultation" className="btn-primary">
            Почати з консультації &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
