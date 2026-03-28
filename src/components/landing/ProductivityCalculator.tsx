"use client";

import { useState } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";

const ROLES = [
  { key: "marketer", label: "Маркетолог" },
  { key: "sales", label: "SDR/Продажі" },
  { key: "hr", label: "HR" },
  { key: "copywriter", label: "Копірайтер" },
  { key: "analyst", label: "Аналітик" },
  { key: "operations", label: "Операції" },
  { key: "ceo", label: "CEO" },
] as const;

type RoleKey = (typeof ROLES)[number]["key"];

const ROLE_MULTIPLIERS: Record<
  RoleKey,
  {
    conservative: number;
    conservativeSource: string;
    optimistic: number;
    optimisticSource: string;
    description: string;
    tasks: string[];
  }
> = {
  marketer: {
    conservative: 1.4,
    conservativeSource: "PwC: 66% приріст + Creative teams +60%",
    optimistic: 2.5,
    optimisticSource: "Anthropic 5x на контент-задачах",
    description: "Контент, SEO, email — високий потенціал. Стратегія залишається людською.",
    tasks: ["Контент x3", "SEO x4", "Email x5", "Звіти x3", "Ресерч x2.5"],
  },
  sales: {
    conservative: 1.3,
    conservativeSource: "Cornell/NBER: 14% середній приріст",
    optimistic: 2.0,
    optimisticSource: "Single AI agent 3.2x крос-функціонально",
    description: "Ресерч і листи автоматизуються. Живі переговори — ні.",
    tasks: ["Outreach x3", "Ресерч x4", "КП x5", "CRM x3", "Follow-up x2"],
  },
  hr: {
    conservative: 1.35,
    conservativeSource: "IBM AskHR: 94% запитів, менеджери +75%",
    optimistic: 2.0,
    optimisticSource: "Скринінг резюме 5x, описи вакансій автоматизовані",
    description: "Скринінг і документи — високий потенціал. Soft skills — людина.",
    tasks: ["Резюме x5", "Вакансії x4", "Листування x3", "FAQ x4", "Звіти x2.5"],
  },
  copywriter: {
    conservative: 1.6,
    conservativeSource: "Anthropic: 81% медіана на текстових задачах",
    optimistic: 3.0,
    optimisticSource: "Anthropic: до 5x на контент-задачах",
    description: "Найвищий потенціал — текст це сильна сторона AI.",
    tasks: ["Статті x4", "Описи x8", "Соцмережі x5", "Email x4", "Переклад x6"],
  },
  analyst: {
    conservative: 1.15,
    conservativeSource: "METR RCT + UChicago: суперечливі дані",
    optimistic: 1.8,
    optimisticSource: "GitHub+MIT: 2.2x на коді",
    description: "Новачки прискорюються, експерти іноді сповільнюються.",
    tasks: ["Дані x3", "Звіти x4", "Дашборди x2", "Чистка x5", "Прогнози x2"],
  },
  operations: {
    conservative: 1.34,
    conservativeSource: "Brynjolfsson: +34% для новачків, +14% середній",
    optimistic: 2.0,
    optimisticSource: "IBM: 70% запитів оброблені AI",
    description: "Customer support — найдослідженіша сфера.",
    tasks: ["Документи x3", "Тікети x4", "SOP x5", "Протоколи x4", "Логістика x1.5"],
  },
  ceo: {
    conservative: 1.25,
    conservativeSource: "McKinsey: менше 10% use cases проходять пілот",
    optimistic: 2.0,
    optimisticSource: "Ресерч, звіти, стратегічний аналіз",
    description: "CEO бенефіт непрямий — через ефективність команди.",
    tasks: ["Email x3", "Зустрічі x5", "Ресерч x3", "LinkedIn x4", "Звіти x3"],
  },
};

const SOURCES = [
  { label: "Anthropic: 5x", detail: "100K задач" },
  { label: "PwC: 66%", detail: "308 компаній" },
  { label: "Stanford+WB: 2.5x", detail: "18 задач" },
];

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-text-secondary text-sm">{label}</span>
        <span className="text-text font-bold text-sm">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary"
      />
    </div>
  );
}

function BarRow({
  label,
  routine,
  creative,
  freed,
  total,
}: {
  label: string;
  routine: number;
  creative: number;
  freed: number;
  total: number;
}) {
  const pct = (v: number) => `${Math.max(0, (v / total) * 100)}%`;
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary text-xs w-28 flex-shrink-0 text-right">
        {label}
      </span>
      <div className="flex-1 flex h-6 rounded-full overflow-hidden bg-gray-100">
        <div className="bg-red-400/60 transition-all duration-300" style={{ width: pct(routine) }} />
        <div className="bg-blue-400/60 transition-all duration-300" style={{ width: pct(creative) }} />
        {freed > 0 && (
          <div className="bg-green-400/60 transition-all duration-300" style={{ width: pct(freed) }} />
        )}
      </div>
    </div>
  );
}

export default function ProductivityCalculator() {
  const { ref, isVisible } = useIntersection();
  const [role, setRole] = useState<RoleKey>("marketer");
  const [teamSize, setTeamSize] = useState(10);
  const [salary, setSalary] = useState(800);
  const [routineHours, setRoutineHours] = useState(20);

  const data = ROLE_MULTIPLIERS[role];
  const hourlyRate = salary / (4.3 * 40);

  const conservativeSaved = routineHours * (1 - 1 / data.conservative) * teamSize;
  const optimisticSaved = routineHours * (1 - 1 / data.optimistic) * teamSize;

  const conservativeYearlySavings = conservativeSaved * hourlyRate * 4.3 * 12;
  const optimisticYearlySavings = optimisticSaved * hourlyRate * 4.3 * 12;

  const courseCost = teamSize * 49;
  const paybackDays = Math.ceil(courseCost / (conservativeYearlySavings / 365));
  const effectiveTeam = Math.round(teamSize * data.optimistic);

  const routineAfterConservative = routineHours / data.conservative;
  const routineAfterOptimistic = routineHours / data.optimistic;
  const creativeHours = 40 - routineHours;

  return (
    <section id="calculator" className="section-padding bg-surface" ref={ref}>
      <div className="container-main">
        <div className="text-center mb-12">
          <div className={cn("text-primary font-bold text-sm uppercase tracking-widest mb-4 animate-in", isVisible && "visible")}>
            Калькулятор
          </div>
          <h2 className={cn("text-h2 text-text mb-4 animate-in", isVisible && "visible")} style={{ transitionDelay: "100ms" }}>
            Порахуйте продуктивність вашої команди з AI
          </h2>
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto mb-12">
          {SOURCES.map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-surface-alt border border-border">
              <div className="text-text font-bold text-sm">{s.label}</div>
              <div className="text-text-secondary text-xs">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Role pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                role === r.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200 hover:text-text"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Role description + task pills */}
        <div className="text-center mb-8">
          <p className="text-text-secondary text-sm mb-3">{data.description}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {data.tasks.map((t) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="max-w-2xl mx-auto space-y-6 mb-12">
          <SliderInput label="Людей у команді" value={teamSize} min={1} max={50} onChange={setTeamSize} />
          <SliderInput label="Зарплата $/міс" value={salary} min={300} max={5000} step={50} onChange={setSalary} format={(v) => `$${v}`} />
          <SliderInput label="Годин рутини/тижд" value={routineHours} min={5} max={35} onChange={setRoutineHours} format={(v) => `${v} год`} />
        </div>

        {/* Results: two columns */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          <div className="p-6 rounded-2xl border border-green-500/20 bg-green-50">
            <div className="text-green-600 font-bold text-sm uppercase tracking-widest mb-3">
              Консервативний (RCT-дані)
            </div>
            <div className="text-4xl font-black text-text mb-1">x{data.conservative}</div>
            <div className="text-text-secondary text-xs mb-4">{data.conservativeSource}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Вивільнено</span>
                <span className="text-text font-bold">{Math.round(conservativeSaved)} год/тижд</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Економія</span>
                <span className="text-text font-bold">${Math.round(conservativeYearlySavings).toLocaleString()}/рік</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-primary/20 bg-primary-light">
            <div className="text-primary font-bold text-sm uppercase tracking-widest mb-3">
              Оптимістичний (AI-агенти)
            </div>
            <div className="text-4xl font-black text-text mb-1">x{data.optimistic}</div>
            <div className="text-text-secondary text-xs mb-4">{data.optimisticSource}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Вивільнено</span>
                <span className="text-text font-bold">{Math.round(optimisticSaved)} год/тижд</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Економія</span>
                <span className="text-text font-bold">${Math.round(optimisticYearlySavings).toLocaleString()}/рік</span>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After bars */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="space-y-4">
            <BarRow label="До AI" routine={routineHours} creative={creativeHours} freed={0} total={40} />
            <BarRow label="Після (конс.)" routine={routineAfterConservative} creative={creativeHours} freed={routineHours - routineAfterConservative} total={40} />
            <BarRow label="Після (оптим.)" routine={routineAfterOptimistic} creative={creativeHours} freed={routineHours - routineAfterOptimistic} total={40} />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400/60" /> Рутина</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-400/60" /> Творча робота</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-400/60" /> Вивільнений час</span>
          </div>
        </div>

        {/* Team equivalent card */}
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-border bg-white text-center mb-10 shadow-md">
          <div className="text-text-secondary text-sm mb-2">Еквівалент для команди</div>
          <div className="text-3xl font-black text-text mb-1">= {effectiveTeam} людей без AI</div>
          <div className="text-text-secondary text-sm">Ваша команда з {teamSize} → працює як {effectiveTeam}</div>
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-text-secondary">Вартість навчання</div>
              <div className="text-text font-bold">${courseCost}</div>
            </div>
            <div>
              <div className="text-text-secondary">Окупність (конс.)</div>
              <div className="text-text font-bold">
                {paybackDays > 0 && paybackDays < 365 ? `${paybackDays} днів` : "< 1 день"}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a href="#consultation" className="btn-primary">
            Хочете точний розрахунок? Замовити консультацію &rarr;
          </a>
        </div>

        {/* Sources + disclaimer */}
        <div className="text-center text-text-secondary/60 text-xs max-w-3xl mx-auto space-y-2">
          <p>
            На основі: Anthropic 5x (100K задач), PwC 66% (308 компаній), Stanford 2.5x (18 задач),
            Cornell 14-34% (customer support), IBM $4.5B (270K працівників), METR RCT (розробники)
          </p>
          <p>
            Калькулятор показує потенціал на основі опублікованих досліджень.
            Реальний результат залежить від складності задач і мотивації команди.
          </p>
        </div>
      </div>
    </section>
  );
}
