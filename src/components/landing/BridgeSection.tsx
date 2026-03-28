"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

export default function BridgeSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="py-10 bg-white" ref={ref}>
      <div className="container-main max-w-2xl">
        <p
          className={cn(
            "text-lg md:text-xl font-semibold text-primary text-center leading-relaxed animate-in",
            isVisible && "visible"
          )}
        >
          AI Upskill працює інакше:
          <br />
          не один процес — а кожна посада.
          <br />
          Не відео — а руками.
          <br />
          Не консультант — а ваші власні люди.
        </p>
      </div>
    </section>
  );
}
