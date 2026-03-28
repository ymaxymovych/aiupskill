"use client";

import { useState, useEffect } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/cn";
import { INDUSTRIES } from "@/lib/automations-db";
import { Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

type Phase = "IDLE" | "LOADING" | "RESULT" | "ERROR";
type LoadingStep = 0 | 1 | 2 | 3;

const LOADING_MESSAGES = [
  "Аналізуємо ваш сайт...",
  "Визначаємо галузь і структуру...",
  "Підбираємо автоматизації...",
  "Розраховуємо потенціал...",
];

interface AuditResult {
  company: {
    name: string;
    industry: string;
    description: string;
    employee_count: number;
    departments: { code: string; name: string; count: number; icon: string }[];
  };
  top_automations: {
    department: string;
    title: string;
    description: string;
    hours_saved_per_week: number;
  }[];
  total_automations_available: number;
  summary: {
    total_hours_saved_per_week: number;
    annual_savings_usd: number;
    training_cost_usd: number;
    payback_days: number;
    team_multiplier: number;
  };
}

export default function AuditWizard() {
  const { ref, isVisible } = useIntersection();
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [loadingStep, setLoadingStep] = useState<LoadingStep>(0);
  const [error, setError] = useState("");

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [industry, setIndustry] = useState("");
  const [showIndustry, setShowIndustry] = useState(false);

  const [result, setResult] = useState<AuditResult | null>(null);
  const [expandedAutomation, setExpandedAutomation] = useState<number | null>(null);

  // Check localStorage for cached result
  useEffect(() => {
    try {
      const cached = localStorage.getItem("aiupskill_audit");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.timestamp && Date.now() - data.timestamp < 7 * 24 * 3600_000) {
          setResult(data.result);
          setPhase("RESULT");
          setWebsiteUrl(data.website_url || "");
          setEmployeeCount(String(data.employee_count || ""));
        }
      }
    } catch {}
  }, []);

  // Loading animation
  useEffect(() => {
    if (phase !== "LOADING") return;
    const timers = [
      setTimeout(() => setLoadingStep(1), 3000),
      setTimeout(() => setLoadingStep(2), 7000),
      setTimeout(() => setLoadingStep(3), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const count = Number(employeeCount);
    if (!count || count < 1) {
      setError("Введіть кількість співробітників");
      return;
    }
    if (!websiteUrl && !industry) {
      setShowIndustry(true);
      setError("Вкажіть сайт компанії або оберіть галузь");
      return;
    }

    setError("");
    setPhase("LOADING");
    setLoadingStep(0);

    const minDelay = new Promise((r) => setTimeout(r, 10000));

    try {
      const [res] = await Promise.all([
        fetch("/api/ai-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            website_url: websiteUrl || undefined,
            employee_count: count,
            industry: industry || undefined,
          }),
        }),
        minDelay,
      ]);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Помилка аналізу");
      }

      const data = await res.json();
      setResult(data);
      setPhase("RESULT");

      // Save to localStorage
      localStorage.setItem(
        "aiupskill_audit",
        JSON.stringify({
          website_url: websiteUrl,
          employee_count: count,
          result: data,
          timestamp: Date.now(),
        })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Помилка аналізу");
      setPhase("ERROR");
    }
  }

  function handleReset() {
    setPhase("IDLE");
    setResult(null);
    setError("");
    localStorage.removeItem("aiupskill_audit");
  }

  return (
    <section className="section-padding bg-surface-alt" id="audit" ref={ref}>
      <div className="container-main max-w-3xl mx-auto">
        <h2
          className={cn(
            "text-h2 text-text text-center mb-3 animate-in",
            isVisible && "visible"
          )}
        >
          Розрахуйте потенціал AI для вашої компанії
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-8 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Безкоштовний AI-аудит за 30 секунд. Без реєстрації.
        </p>

        {/* IDLE: Form */}
        {phase === "IDLE" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Сайт компанії (опціонально)
                </label>
                <input
                  type="text"
                  placeholder="https://company.ua"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Кількість співробітників *
                </label>
                <input
                  type="number"
                  placeholder="47"
                  min="1"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(e.target.value)}
                  className={cn("input-field", !employeeCount && error && "!border-error")}
                />
              </div>
            </div>

            {(showIndustry || !websiteUrl) && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Галузь {websiteUrl ? "(опціонально)" : "*"}
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-field"
                >
                  <option value="">Оберіть вашу галузь</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.code} value={ind.code}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <p className="text-error text-sm">{error}</p>}

            <button type="submit" className="btn-primary w-full !py-4 text-lg">
              Розрахувати потенціал AI &rarr;
            </button>
          </form>
        )}

        {/* LOADING */}
        {phase === "LOADING" && (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-6" />
            <div className="space-y-3">
              {LOADING_MESSAGES.map((msg, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-sm transition-all duration-500",
                    i <= loadingStep
                      ? "text-text opacity-100 translate-y-0"
                      : "text-text-secondary opacity-0 translate-y-2"
                  )}
                >
                  {i < loadingStep ? "✓" : i === loadingStep ? "◉" : "○"} {msg}
                </p>
              ))}
            </div>
            <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden max-w-sm mx-auto">
              <div
                className="h-full bg-primary rounded-full transition-all duration-[15000ms] ease-out"
                style={{ width: phase === "LOADING" ? "95%" : "0%" }}
              />
            </div>
          </div>
        )}

        {/* ERROR */}
        {phase === "ERROR" && (
          <div className="text-center py-8">
            <p className="text-error mb-4">{error}</p>
            <button onClick={() => setPhase("IDLE")} className="btn-secondary">
              Спробувати ще раз
            </button>
          </div>
        )}

        {/* RESULT */}
        {phase === "RESULT" && result && (
          <div className="space-y-6">
            {/* Company info */}
            {result.company.name && (
              <div className="card !bg-primary-light border-primary/20">
                <h3 className="font-semibold text-text mb-1">
                  {result.company.name}
                </h3>
                {result.company.description && (
                  <p className="text-sm text-text-secondary">{result.company.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.company.departments.map((d, i) => (
                    <span key={i} className="text-xs bg-white rounded-full px-3 py-1 border border-border">
                      {d.icon} {d.name} ({d.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top automations */}
            <div>
              <h3 className="font-semibold text-text mb-3">
                ТОП-5 автоматизацій для вашої компанії
              </h3>
              <div className="space-y-2">
                {result.top_automations.map((a, i) => (
                  <div key={i} className="card !p-4 cursor-pointer" onClick={() => setExpandedAutomation(expandedAutomation === i ? null : i)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-text">{a.title}</p>
                        <p className="text-xs text-text-secondary">{a.department}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">
                          {a.hours_saved_per_week} год/тижд
                        </span>
                        {expandedAutomation === i ? (
                          <ChevronUp className="w-4 h-4 text-text-secondary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-secondary" />
                        )}
                      </div>
                    </div>
                    {expandedAutomation === i && (
                      <p className="text-sm text-text-secondary mt-2">{a.description}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-2">
                + ще {result.total_automations_available - 5} автоматизацій доступні для вашої галузі
              </p>
            </div>

            {/* ROI Summary */}
            <ROISummary summary={result.summary} />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#consultation" className="btn-primary flex-1 text-center">
                Отримати повний звіт &rarr; Безкоштовна консультація
              </a>
              <a href="#calculator" className="btn-secondary flex-1 text-center">
                Розрахувати детальніше &darr;
              </a>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Аналізувати ще раз
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ROISummary({ summary }: { summary: AuditResult["summary"] }) {
  const { ref, isVisible } = useIntersection();
  const savings = useCountUp(summary.annual_savings_usd, 2000, isVisible);
  const hours = useCountUp(summary.total_hours_saved_per_week, 1500, isVisible);

  return (
    <div ref={ref} className="card !bg-surface-dark text-text-on-dark">
      <h3 className="font-semibold mb-4 text-center">Потенціал вашої компанії</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-accent">
            {hours} год
          </div>
          <div className="text-xs text-gray-400">зекономлено / тиждень</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent">
            ${savings.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">економія / рік</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent">
            {summary.payback_days} днів
          </div>
          <div className="text-xs text-gray-400">окупність</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-accent">
            x{summary.team_multiplier}
          </div>
          <div className="text-xs text-gray-400">ефективність команди</div>
        </div>
      </div>
    </div>
  );
}
