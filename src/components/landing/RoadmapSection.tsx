"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    num: "01",
    icon: "🚁",
    title: "HELICOPTER VIEW",
    timing: "1 година",
    price: "Безкоштовно",
    desc: "Експерт за 1 годину дає погляд з висоти. Ви розумієте: де ви зараз, куди рухатись, що автоматизувати першим.",
    details: [
      "Аналіз бізнесу і процесів",
      "AI-аудит компанії",
      "Персональний roadmap автоматизації",
    ],
    note: "Проводить Ярослав або один з 100+ випускників курсу",
    cta: { text: "Замовити консультацію", href: "#consultation", external: false },
  },
  {
    num: "02",
    icon: "🎓",
    title: "НАВЧАННЯ ВСІХ СПІВРОБІТНИКІВ",
    timing: "5 днів, 10 годин",
    price: "Від $49/людину",
    desc: "100% ваших співробітників проходять курс. За 5 днів кожен будує свою першу автоматизацію. Перша маленька перемога — за перших 30 хвилин.",
    details: [
      "5 модулів — від аудиту до деплою",
      "Кожен будує працюючу автоматизацію",
      "Менеджер-дашборд для керівника",
      "Сертифікат по завершенню",
    ],
    note: null,
    cta: {
      text: "Спробувати безкоштовно",
      href: "https://accelerator.aiadvisoryboard.me/register?plan=trial",
      external: true,
    },
  },
  {
    num: "03",
    icon: "📊",
    title: "ЗБІР ДАНИХ ТА AI-АНАЛІТИКА",
    timing: "Постійно",
    price: "Перший місяць безкоштовно",
    desc: "Кожен співробітник щодня відповідає на 3 питання: що зробив, що планує, яка допомога потрібна. AI-помічник аналізує дані і підказує керівнику, де вузькі місця.",
    details: [
      "Щоденний цифровий слід команди",
      "AI-аналітика продуктивності",
      "Автоматичні рекомендації для керівника",
    ],
    note: "Перший місяць безкоштовно для випускників курсу",
    cta: {
      text: "AI Advisory Board →",
      href: "https://aiadvisoryboard.me",
      external: true,
    },
  },
];

export default function RoadmapSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-white" id="roadmap">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-3 animate-in",
            isVisible && "visible"
          )}
        >
          Як перевести компанію на AI: 3 кроки
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-12 max-w-2xl mx-auto animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Від &ldquo;ми нічого не знаємо про AI&rdquo; до AI-enabled команди
        </p>

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={cn(
                "card animate-in relative overflow-hidden",
                i === 1 && "border-primary ring-2 ring-primary/10",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 200}ms` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />

              <div className="flex flex-col md:flex-row gap-6 pl-4">
                <div className="flex items-start gap-4 md:w-48 flex-shrink-0">
                  <span className="text-4xl font-bold text-primary/20">
                    {step.num}
                  </span>
                  <span className="text-3xl mt-1">{step.icon}</span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-h3 text-text">{step.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {step.timing}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-accent/10 text-amber-700 rounded-full font-medium">
                      {step.price}
                    </span>
                  </div>

                  <p className="text-body text-text-secondary mb-3">
                    {step.desc}
                  </p>

                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mb-3">
                    {step.details.map((d, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="text-success mt-0.5">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>

                  {step.note && (
                    <p className="text-xs text-text-secondary italic mb-3">
                      {step.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center md:w-52 flex-shrink-0">
                  <a
                    href={step.cta.href}
                    target={step.cta.external ? "_blank" : undefined}
                    rel={step.cta.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "w-full text-center py-3 px-5 rounded-lg font-semibold transition-all text-sm",
                      i === 0 ? "btn-primary" : "btn-secondary"
                    )}
                  >
                    {step.cta.text}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
