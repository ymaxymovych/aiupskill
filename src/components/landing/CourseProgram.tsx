"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const MODULES = [
  { num: "01", title: "Аудит рутини + перша перемога", desc: "AI аналізує робочий день, підказує що автоматизувати. Перша маленька перемога за 30 хвилин — людина руками збирає першу автоматизацію." },
  { num: "02", title: "Як думати для AI", desc: "Промпт-інжиніринг без води. Як ставити задачі агентам. Як формулювати ТЗ для автоматизації. Різниця між «попросити ChatGPT» і «побудувати ланцюжок»." },
  { num: "03", title: "AI-інструменти та агенти", desc: "Claude, ChatGPT, n8n, vibe-coding, API-інтеграції. Практичний огляд: що для чого, коли яке. Не теорія — руками спробувати кожен." },
  { num: "04", title: "Побудова AI-ланцюжка", desc: "Від ТЗ до працюючого прототипу. Тригер → обробка → AI-компонент → дія → результат. Повноцінна автоматизація для своєї посади." },
  { num: "05", title: "Запуск, вимірювання, здача", desc: "Деплой автоматизації. Як виміряти ROI. Як довести цінність керівництву. Здача фінального проекту — працююча автоматизація 24/7." },
];

export default function CourseProgram() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" id="program">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-2 animate-in",
            isVisible && "visible"
          )}
        >
          5 модулів. 10 годин. 1 автоматизація.
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Кожен модуль відкривається після здачі попереднього.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <div
              key={i}
              className={cn(
                "card !p-5 flex items-start gap-4 animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <span className="text-2xl font-bold text-primary/30 shrink-0">
                {m.num}
              </span>
              <div>
                <h3 className="font-semibold text-text">{m.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="#program"
            className="text-primary font-semibold hover:underline"
          >
            Повна програма &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
