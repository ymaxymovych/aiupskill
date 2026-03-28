"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function PotentialResourceSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface">
      <div className="container-main max-w-3xl" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-6 animate-in",
            isVisible && "visible"
          )}
        >
          Чому після курсу співробітники самі хочуть автоматизувати
        </h2>

        <div
          className={cn(
            "text-body text-text-secondary space-y-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <p>
            Ваші співробітники <strong className="text-text">знають</strong>, що в їхній
            роботі є рутина, яку хотілося б прибрати. Вони живуть з цим щодня.
          </p>
          <p>
            Але в них не було <strong className="text-text">інструменту</strong>.
          </p>
          <p>
            Курс дає інструмент. І відбувається хімічна реакція:
          </p>
        </div>

        <div
          className={cn(
            "my-8 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <p className="text-lg md:text-xl font-semibold text-primary">
            знання що робити + уміння як зробити = людина не може зупинитись
          </p>
        </div>

        <div
          className={cn(
            "text-body text-text-secondary space-y-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <p>
            Як гроші в кишені хочуть бути витрачені, як спортивний автомобіль
            хоче, щоб натиснули газ — так навичка побудови автоматизацій хоче бути застосована.
          </p>
          <p className="font-medium text-text">
            Ви не знаєте, хто з ваших співробітників стане AI-чемпіоном.
            Тому дайте шанс кожному.
          </p>
        </div>
      </div>
    </section>
  );
}
