"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const ROWS = [
  {
    feature: "Що робить",
    chatgpt: "Відповідає на питання",
    agent: "Виконує задачі автономно",
  },
  {
    feature: "Потрібна людина?",
    chatgpt: "Щоразу",
    agent: "Тільки для налаштування",
  },
  {
    feature: "Працює 24/7?",
    chatgpt: "Ні",
    agent: "Так",
  },
  {
    feature: "Знає ваш бізнес?",
    chatgpt: "Ні (загальні знання)",
    agent: "Так (навчений на ваших даних)",
  },
  {
    feature: "Масштабується?",
    chatgpt: "Ні (1 людина = 1 чат)",
    agent: "Так (1 агент = необмежено задач)",
  },
  {
    feature: "Приклад",
    chatgpt: '"Напиши мені пост"',
    agent: "Агент сам створює контент-план, пише, публікує, аналізує",
  },
];

export default function NotChatGPT() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface-alt" id="not-chatgpt">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-4 animate-in",
            isVisible && "visible"
          )}
        >
          Це НЕ навчання ChatGPT
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center max-w-2xl mx-auto mb-10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Ми вчимо будувати AI-агентів — автоматизації, що працюють без участі
          людини.
        </p>

        {/* Desktop table */}
        <div
          className={cn(
            "hidden md:block overflow-hidden rounded-xl border border-border animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <table className="w-full">
            <thead>
              <tr className="bg-surface-alt">
                <th className="text-left p-4 text-text-secondary font-medium w-1/4"></th>
                <th className="text-left p-4 text-text-secondary font-medium w-[37.5%]">
                  <span className="text-error">ChatGPT (як зараз)</span>
                </th>
                <th className="text-left p-4 font-medium w-[37.5%]">
                  <span className="text-success">AI-агент (що будуємо)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-surface"}
                >
                  <td className="p-4 font-medium text-text">{row.feature}</td>
                  <td className="p-4 text-text-secondary">{row.chatgpt}</td>
                  <td className="p-4 text-text font-medium">{row.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className={cn(
                "card !p-4 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <p className="font-semibold text-text mb-2">{row.feature}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-error text-xs font-medium mb-1">ChatGPT</p>
                  <p className="text-text-secondary">{row.chatgpt}</p>
                </div>
                <div>
                  <p className="text-success text-xs font-medium mb-1">
                    AI-агент
                  </p>
                  <p className="text-text">{row.agent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
