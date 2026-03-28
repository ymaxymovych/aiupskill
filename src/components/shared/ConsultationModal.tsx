"use client";
import { useState, useEffect, useCallback } from "react";

const CALENDLY_URL = "https://calendly.com/yaroslav-maxymovych";
const TELEGRAM_LINK = "https://t.me/YaroslavMaxymovych";
const EMAIL_LINK = "mailto:ceo@aiadvisoryboard.me";

const INDUSTRIES = [
  "E-commerce / Інтернет-магазин",
  "Маркетинг-агентство",
  "IT-компанія",
  "Виробництво",
  "Сфера послуг",
  "Нерухомість",
  "Логістика",
  "Освіта / EdTech",
  "Медицина / Фарма",
  "Юриспруденція",
  "Інше",
];

interface AuditResult {
  recommendations: string[];
  totalHoursSaved: number;
  pricePerPerson: number;
  paybackDays: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ConsultationModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"calendly" | "audit">("audit");
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Audit
  const [website, setWebsite] = useState("");
  const [teamSize, setTeamSize] = useState(10);
  const [industry, setIndustry] = useState("");
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  // Step 2: Contact
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check if audit was already done (sessionStorage)
  useEffect(() => {
    if (!open) return;
    setSuccess(false);
    setError("");
    try {
      const saved = sessionStorage.getItem("aiupskill_audit_modal");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAuditResult(parsed.result);
        setWebsite(parsed.website || "");
        setTeamSize(parsed.teamSize || "5-9");
        setIndustry(parsed.industry || "");
        setStep(2); // Skip to step 2
      }
    } catch { /* empty */ }
  }, [open]);

  // Calendly init
  useEffect(() => {
    if (!open || mode !== "calendly") return;
    const container = document.getElementById("calendly-container-modal");
    if (!container) return;

    function initCalendly() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const C = (window as any).Calendly;
      if (C?.initInlineWidget) {
        container!.innerHTML = "";
        C.initInlineWidget({
          url: `${CALENDLY_URL}?hide_gdpr_banner=1&background_color=fafafa&text_color=1f2937&primary_color=1a56db`,
          parentElement: container,
        });
      }
    }

    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) {
      initCalendly();
    } else {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initCalendly;
      document.head.appendChild(script);
    }
  }, [open, mode]);

  const runAudit = useCallback(async () => {
    if (!industry) return;
    setAuditing(true);
    try {
      const res = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website_url: website || undefined,
          employee_count: teamSize,
          industry: industry,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const result: AuditResult = {
          recommendations: (data.top_automations || []).slice(0, 3).map(
            (a: { title: string; hours_saved_per_week: number }) =>
              `${a.title} — ~${a.hours_saved_per_week} год/тижд`
          ),
          totalHoursSaved: data.summary?.total_hours_saved_per_week || 20,
          pricePerPerson: data.summary?.training_cost_usd || 2199,
          paybackDays: data.summary?.payback_days || 5,
        };
        setAuditResult(result);
        sessionStorage.setItem("aiupskill_audit_modal", JSON.stringify({
          result, website, teamSize, industry,
        }));
        setStep(2);
      } else {
        // Fallback result
        setAuditResult({
          recommendations: [
            "Автоматизація звітності — ~8 год/тижд",
            "AI-кваліфікація лідів — ~12 год/тижд",
            "Генерація контенту — ~6 год/тижд",
          ],
          totalHoursSaved: 26,
          pricePerPerson: 2199,
          paybackDays: 5,
        });
        setStep(2);
      }
    } catch {
      // Fallback on error
      setAuditResult({
        recommendations: [
          "Автоматизація звітності — ~8 год/тижд",
          "AI-кваліфікація лідів — ~12 год/тижд",
          "Генерація контенту — ~6 год/тижд",
        ],
        totalHoursSaved: 26,
        pricePerPerson: 2199,
        paybackDays: 5,
      });
      setStep(2);
    } finally {
      setAuditing(false);
    }
  }, [website, teamSize, industry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phone ? `${email}, ${phone}` : email,
          preferred_time: comment || "",
          company_url: website,
          employee_count: teamSize,
          audit_result: auditResult,
          source: "consultation_modal_unified",
        }),
      });
      if (res.ok) {
        setSuccess(true);
        sessionStorage.removeItem("aiupskill_audit_modal");
      } else {
        const data = await res.json();
        setError(data.error || "Помилка. Спробуйте ще раз.");
      }
    } catch {
      setError("Помилка з'єднання. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10 text-xl"
        >
          ✕
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Безкоштовна консультація: 15 хвилин
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Розберемо задачі вашої команди і підберемо план.
          </p>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("calendly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "calendly"
                  ? "bg-[#1a56db] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              Обрати час для дзвінка
            </button>
            <button
              onClick={() => setMode("audit")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "audit"
                  ? "bg-[#1a56db] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              Або залишити заявку
            </button>
          </div>

          {/* === CALENDLY MODE === */}
          {mode === "calendly" && (
            <div
              id="calendly-container-modal"
              className="rounded-xl overflow-hidden border border-gray-100"
              style={{ minWidth: "320px", height: "500px" }}
            />
          )}

          {/* === AUDIT + FORM MODE === */}
          {mode === "audit" && (
            <>
              {success ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✅</div>
                  <p className="text-gray-900 font-bold text-lg mb-2">Дякуємо!</p>
                  <p className="text-gray-500">Ярослав зв&apos;яжеться протягом 24 годин.</p>
                </div>
              ) : (
                <>
                  {/* STEP 1: AI Audit */}
                  {step === 1 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 bg-[#1a56db] text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                        <span className="text-sm font-medium text-gray-700">AI-аудит вашого бізнесу</span>
                        <span className="text-xs text-gray-400 ml-auto">30 секунд. Безкоштовно.</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Сайт компанії (необов&apos;язково)</label>
                          <input type="url" value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            autoComplete="url"
                            className="input-field" placeholder="https://yourcompany.com" />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Кількість людей *</label>
                          <input type="number" min={1} max={10000} value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value) || 1)}
                            required
                            className="input-field" placeholder="22" />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Галузь *</label>
                          <select value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="input-field">
                            <option value="">Оберіть галузь</option>
                            {INDUSTRIES.map((ind) => (
                              <option key={ind} value={ind}>{ind}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={runAudit}
                          disabled={!industry || auditing}
                          className="w-full py-4 bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                          {auditing ? "Аналізуємо..." : "Розрахувати потенціал AI →"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Results + Contact Form */}
                  {step === 2 && (
                    <div>
                      {/* Audit Results */}
                      {auditResult && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-sm font-semibold text-green-800 mb-2">
                            Для вашої компанії ми рекомендуємо:
                          </p>
                          <ul className="space-y-1 mb-3">
                            {auditResult.recommendations.map((r, i) => (
                              <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                {r}
                              </li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-4 text-xs text-green-600 pt-2 border-t border-green-200">
                            <span>Економія: ~{auditResult.totalHoursSaved} год/тижд</span>
                            <span>Вартість: {auditResult.pricePerPerson.toLocaleString("uk-UA")} грн/люд</span>
                            <span>Окупність: ~{auditResult.paybackDays} днів</span>
                          </div>
                        </div>
                      )}

                      {/* Contact form */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 bg-[#1a56db] text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                        <span className="text-sm font-medium text-gray-700">Залиште контакт</span>
                        <span className="text-xs text-gray-400 ml-auto">Обговоримо деталі за 15 хвилин.</span>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Ім&apos;я *</label>
                          <input type="text" required value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            className="input-field" placeholder="Ваше ім'я" />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Email *</label>
                          <input type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="input-field" placeholder="email@company.com" />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Телефон</label>
                          <input type="tel" value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoComplete="tel"
                            className="input-field" placeholder="+380..." />
                        </div>
                        <div>
                          <label className="text-gray-600 text-sm block mb-1">Коментар (необов&apos;язково)</label>
                          <textarea rows={2} value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input-field resize-none"
                            placeholder="Наприклад: цікавить навчання для відділу маркетингу" />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={submitting}
                          className="w-full py-4 bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50">
                          {submitting ? "Відправляємо..." : "Надіслати заявку"}
                        </button>
                      </form>

                      <button
                        onClick={() => { setStep(1); setAuditResult(null); sessionStorage.removeItem("aiupskill_audit_modal"); }}
                        className="text-xs text-gray-400 hover:text-gray-600 mt-3 block mx-auto"
                      >
                        ← Повторити аудит
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Footer: direct contacts */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">Або напишіть напряму:</span>
            <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer"
              className="text-[#1a56db] hover:underline">Telegram →</a>
            <a href={EMAIL_LINK} className="text-[#1a56db] hover:underline">Email →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
