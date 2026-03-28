"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const MISTAKES = [
  {
    icon: "❌",
    title: "Купити ChatGPT Team",
    result: "ніхто не користується",
  },
  {
    icon: "❌",
    title: "Відправити на відео-курс",
    result: "забувають через тиждень",
  },
  {
    icon: "❌",
    title: "Найняти AI-консультанта",
    result: "він піде, знання з ним",
  },
  {
    icon: "❌",
    title: "Автоматизувати 1 процес",
    result: "решта працює по-старому",
  },
];

export default function ProblemBlock() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="problem">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-6 animate-in",
            isVisible && "visible"
          )}
        >
          Чому 80% компаній провалюють впровадження AI
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center max-w-2xl mx-auto mb-12 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Типовий сценарій: CEO купує ChatGPT Team за $25/людину. Кидає лінк в
          корпоративний Slack. Через місяць дивиться статистику — 3 людини з 50
          хоч раз зайшли. Решта забули пароль.
        </p>
        <p
          className={cn(
            "text-body text-text-secondary text-center max-w-2xl mx-auto mb-12 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          Чому так? Бо ChatGPT без контексту вашої роботи — це розумний Google.
          Він знає все про оточуючий світ, але нічого про ваші процеси, клієнтів,
          продукт.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {MISTAKES.map((m, i) => (
            <div
              key={i}
              className={cn(
                "card text-center animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="font-semibold text-text mb-2">{m.title}</h3>
              <p className="text-sm text-text-secondary">{m.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
