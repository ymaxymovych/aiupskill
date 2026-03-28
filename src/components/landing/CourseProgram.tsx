"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { ACCELERATOR_URL } from "@/lib/constants";

const MODULES = [
  { num: "01", title: "Аудит рутини", desc: "AI знаходить задачі для автоматизації" },
  { num: "02", title: "Мислення для AI", desc: "Промт-інжиніринг без води" },
  { num: "03", title: "AI-інструменти", desc: "Claude, ChatGPT, агенти" },
  { num: "04", title: "Побудова автоматизації", desc: "Від ТЗ до прототипу за вечір" },
  { num: "05", title: "Запуск і вимірювання", desc: "Деплой, аналітика, ROI" },
  { num: "06", title: "Фінальний проект", desc: "Здача повноцінної автоматизації" },
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
          6 модулів. ~20 годин. 1 автоматизація.
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
            href={`${ACCELERATOR_URL}/#program`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Повна програма &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
