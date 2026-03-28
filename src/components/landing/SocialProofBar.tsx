"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { value: 100000, label: "задач досліджено", suffix: "", source: "Anthropic" },
  { value: 5, label: "продуктивність", suffix: "x", source: "дослідження" },
  { value: 2, label: "тижні до результату", suffix: "", source: "6 модулів" },
  { value: 0, label: "годин теорії", suffix: "", source: "" },
  { value: 1, label: "модуль безкоштовно", suffix: "", source: "Перший" },
  { value: 2, label: "публікації Forbes", suffix: "", source: "Forbes" },
];

function StatItem({
  value,
  label,
  suffix,
  source,
  active,
}: {
  value: number;
  label: string;
  suffix: string;
  source: string;
  active: boolean;
}) {
  const animated = useCountUp(value, 2000, active);
  const display = value === 0 ? "0" : value <= 5 ? String(animated) : animated.toLocaleString("uk-UA");

  return (
    <div className="text-center py-4">
      <div className="text-2xl md:text-3xl font-bold text-primary">
        {source === "Перший" ? "Перший" : display}
        {suffix}
      </div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
      {source && source !== "Перший" && (
        <div className="text-xs text-text-secondary/60 mt-0.5">({source})</div>
      )}
    </div>
  );
}

export default function SocialProofBar() {
  const { ref, isVisible } = useIntersection();

  return (
    <section ref={ref} className="bg-surface-alt border-y border-border">
      <div className="container-main py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <StatItem key={i} {...stat} active={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
