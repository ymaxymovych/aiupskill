"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function CompetitivePressureSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-white">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-10 animate-in",
            isVisible && "visible"
          )}
        >
          Що буде, якщо ви не автоматизуєтесь
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Without AI */}
          <div
            className={cn(
              "card border-red-200 bg-red-50/30 animate-in",
              isVisible && "visible"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏢</span>
              <h3 className="text-h3 text-text">Ваша компанія (без AI)</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">✗</span>
                <div>
                  <p className="text-sm font-medium text-text">10 менеджерів з продажів</p>
                  <p className="text-xs text-text-secondary">Кожен обробляє 30 лідів/день</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">✗</span>
                <div>
                  <p className="text-sm font-medium text-text">Ручна обробка заявок</p>
                  <p className="text-xs text-text-secondary">Час реакції: 2-4 години</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">✗</span>
                <div>
                  <p className="text-sm font-medium text-text">Висока собівартість</p>
                  <p className="text-xs text-text-secondary">ФОП 10 людей = значні витрати/міс</p>
                </div>
              </li>
            </ul>
          </div>

          {/* With AI */}
          <div
            className={cn(
              "card border-green-200 bg-green-50/30 animate-in",
              isVisible && "visible"
            )}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <h3 className="text-h3 text-text">Конкурент (з AI-ланцюжками)</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-text">4 менеджери + AI-ланцюжки</p>
                  <p className="text-xs text-text-secondary">Кожен обробляє 150 лідів/день</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-text">Автоматична кваліфікація</p>
                  <p className="text-xs text-text-secondary">Час реакції: 2 хвилини, автоматично</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-medium text-text">Собівартість нижче в 3 рази</p>
                  <p className="text-xs text-text-secondary">Та ж продуктивність, менше людей</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <p
          className={cn(
            "text-body text-text-secondary text-center mt-8 max-w-2xl mx-auto animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "500ms" }}
        >
          Менша команда. Більша швидкість. Нижча ціна.
          Ринок сам відрегулює — питання лише, на якому боці ви опинитесь.
        </p>
      </div>
    </section>
  );
}
