"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { Search, Wrench, Rocket, BarChart3 } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Знаходить рутину",
    description:
      "AI аналізує його робочий день і показує що можна автоматизувати",
  },
  {
    icon: Wrench,
    title: "Вчиться інструментам",
    description: "Не теорія, а практика з Claude, ChatGPT, n8n",
  },
  {
    icon: Rocket,
    title: "Будує автоматизацію",
    description: "Реальний працюючий інструмент для своєї посади",
  },
  {
    icon: BarChart3,
    title: "Запускає і вимірює",
    description: "Деплоїть, рахує скільки часу зекономив",
  },
];

export default function SolutionBlock() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface-alt" id="solution">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-4 animate-in",
            isVisible && "visible"
          )}
        >
          Наш підхід: навчити кожного будувати автоматизації
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center max-w-2xl mx-auto mb-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          FedEx навчає AI 400 000 своїх співробітників. Не тільки IT-відділ.
          Всіх. Чому? Бо вони не знають хто з цих людей стане AI-чемпіоном.
        </p>
        <p
          className={cn(
            "text-body text-text-secondary text-center max-w-2xl mx-auto mb-12 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          Ми робимо те саме, але для вашої компанії. Кожен ваш співробітник — від
          маркетолога до бухгалтера:
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={cn(
                "card text-center animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary">{s.description}</p>
            </div>
          ))}
        </div>

        <blockquote
          className={cn(
            "text-center text-lg md:text-xl font-medium text-text max-w-3xl mx-auto border-l-4 border-primary pl-6 py-4 bg-white rounded-r-lg animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          &ldquo;Коли людина САМА побудувала автоматизацію — вона перестає боятись
          AI. Вона починає бачити можливості всюди. Ваша команда перетворюється з
          &lsquo;споживачів AI&rsquo; на &lsquo;будівників AI&rsquo;.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
