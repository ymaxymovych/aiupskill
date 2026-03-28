"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/cn";

const STATS = [
  {
    value: "5x",
    label: "приріст продуктивності",
    source: "Anthropic",
    detail: "100 000 задач",
  },
  {
    value: "66%",
    label: "приріст ефективності",
    source: "PwC",
    detail: "308 компаній",
  },
  {
    value: "$4.5B",
    label: "приріст прибутку",
    source: "IBM",
    detail: "270 000 людей",
  },
  {
    value: "+38-50%",
    label: "виконання планів",
    source: "Дослідження",
    detail: "планування + звітність = +3 год до робочого дня",
  },
  {
    value: "17%→37%",
    label: "залученість після навчання",
    source: "Gartner",
    detail: "подвоєння мотивації менеджерів",
  },
];

export default function ResearchStats() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface-alt">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-10 animate-in",
            isVisible && "visible"
          )}
        >
          Результати, підтверджені дослідженнями
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={cn(
                "card text-center animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-text font-medium mb-3">{stat.label}</div>
              <div className="text-sm text-text-secondary">
                <span className="font-semibold">{stat.source}</span> &middot;{" "}
                {stat.detail}
              </div>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex flex-wrap justify-center gap-8 mt-8 items-center animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          <span className="text-sm text-text-secondary">Як бачено у:</span>
          <span className="font-bold text-text">FORBES</span>
          <span className="text-sm text-text-secondary">
            &ldquo;Портфель аукціоніста&rdquo;
          </span>
          <span className="text-sm text-text-secondary">
            &ldquo;Інтелектуальні власники&rdquo;
          </span>
        </div>
      </div>
    </section>
  );
}
