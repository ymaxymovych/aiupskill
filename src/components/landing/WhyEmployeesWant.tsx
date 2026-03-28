"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function WhyEmployeesWant() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface" ref={ref}>
      <div className="container-main max-w-3xl text-center">
        <h2
          className={cn(
            "text-h2 text-text mb-6 animate-in",
            isVisible && "visible"
          )}
        >
          Чому після курсу співробітники самі хочуть автоматизувати
        </h2>
        <div
          className={cn("space-y-6 animate-in", isVisible && "visible")}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-body text-text-secondary leading-relaxed">
            Ваші співробітники <strong className="text-text">ЗНАЮТЬ</strong>, що
            в їхній роботі є рутина, яку хотілося б прибрати. Вони живуть з цим
            щодня.
          </p>
          <p className="text-body text-text-secondary leading-relaxed">
            Але в них не було інструменту.
          </p>
          <p className="text-body text-text leading-relaxed font-medium">
            Курс дає інструмент. І відбувається хімічна реакція:
          </p>
          <div className="inline-block bg-primary/5 border border-primary/20 rounded-xl px-8 py-4">
            <p className="text-lg text-text font-semibold">
              знання що робити + уміння як зробити
              <br />
              <span className="text-primary">
                = людина не може зупинитись
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
