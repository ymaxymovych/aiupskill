"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { ACCELERATOR_URL, PRICING } from "@/lib/constants";

const TIERS = [
  {
    key: "trial",
    name: "Trial",
    price: "$0",
    priceUah: "0 UAH",
    per: "",
    desc: "1 модуль",
    features: ["AI-аудит рутини", "Модуль 1", "Без картки"],
    cta: "Почати",
    href: `${ACCELERATOR_URL}/register?plan=trial`,
    external: true,
    popular: false,
  },
  {
    key: "solo",
    name: "Solo",
    price: "$79",
    priceUah: "3 200 UAH",
    per: "/ людину",
    desc: "1 людина, 6 модулів",
    features: [
      "Все з Trial",
      "6 модулів",
      "Персональний дашборд",
      "Сертифікат",
    ],
    cta: "Купити",
    href: `${ACCELERATOR_URL}/register?plan=solo`,
    external: true,
    popular: true,
  },
  {
    key: "team",
    name: "Team",
    price: "$290",
    priceUah: "11 900 UAH",
    per: "/ до 5 людей",
    desc: "До 5 людей, 6 модулів",
    features: [
      "Все з Solo × 5 людей",
      "Менеджер-дашборд",
      "Код запрошення",
      "Командний прогрес",
    ],
    cta: "Купити",
    href: `${ACCELERATOR_URL}/register?plan=team`,
    external: true,
    popular: false,
  },
];

export default function PricingSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="pricing">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-2 animate-in",
            isVisible && "visible"
          )}
        >
          Прозоро. Без підписок. Разовий платіж.
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Доступ на 1 рік.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {TIERS.map((tier, i) => (
            <div
              key={tier.key}
              className={cn(
                "card relative animate-in",
                tier.popular && "border-primary ring-2 ring-primary/20",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Популярний
                </div>
              )}
              <h3 className="text-h3 text-text mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-primary">
                  {tier.price}
                </span>
                {tier.per && (
                  <span className="text-sm text-text-secondary">{tier.per}</span>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-1">{tier.priceUah}</p>
              <p className="text-sm text-text-secondary mb-4">{tier.desc}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="text-success mt-0.5">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={tier.href}
                target={tier.external ? "_blank" : undefined}
                rel={tier.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "block text-center w-full py-3 rounded-lg font-semibold transition-all",
                  tier.popular
                    ? "btn-primary"
                    : "btn-secondary"
                )}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise block */}
        <div
          className={cn(
            "card bg-surface-alt text-center animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "700ms" }}
        >
          <h3 className="text-h3 text-text mb-3">Більше 5 людей?</h3>
          <div className="flex flex-wrap justify-center gap-8 mb-4 text-sm text-text-secondary">
            <span>
              <strong className="text-text">Department</strong> (до 30) — $1 900
            </span>
            <span>
              <strong className="text-text">Corporation</strong> (50+) — від
              $3 500
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Включає Q&A сесії з Ярославом, бонус-модулі та персональну стратегію.
          </p>
          <a href="#consultation" className="btn-primary">
            Замовити консультацію — підберемо тариф &rarr;
          </a>
          <p className="text-xs text-text-secondary mt-4">
            Потрібна оплата за рахунком? yaroslav@aiupskill.live
          </p>
        </div>
      </div>
    </section>
  );
}
