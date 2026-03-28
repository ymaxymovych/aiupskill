"use client";
import { useState, useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/yaroslav-maxymovych";
const TELEGRAM_LINK = "https://t.me/YaroslavMaxymovych";
const EMAIL_LINK = "mailto:ceo@aiupskill.live";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ConsultationModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<"calendly" | "form">("calendly");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    teamSize: "1-5",
    task: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
      try {
        const saved = localStorage.getItem("aiupskill_audit");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.website_url && !form.website) {
            setForm((prev) => ({ ...prev, website: parsed.website_url }));
          }
        }
      } catch { /* empty */ }
    }
  }, [open]);

  useEffect(() => {
    if (!open || tab !== "calendly") return;
    const container = document.getElementById("calendly-container");
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
  }, [open, tab]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact: form.email,
          preferred_time: "",
          company_url: form.website,
          source: "consultation_modal",
        }),
      });
      if (res.ok) {
        setSuccess(true);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
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

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Замовити безкоштовну консультацію
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            15 хвилин. Розберемо задачі вашої команди і підберемо план.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("calendly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "calendly"
                  ? "bg-[#1a56db] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              Обрати час для дзвінка
            </button>
            <button
              onClick={() => setTab("form")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "form"
                  ? "bg-[#1a56db] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            >
              Або залишити заявку
            </button>
          </div>

          {tab === "calendly" && (
            <div
              id="calendly-container"
              className="rounded-xl overflow-hidden border border-gray-100"
              style={{ minWidth: "320px", height: "500px" }}
            />
          )}

          {tab === "form" && (
            <>
              {success ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✅</div>
                  <p className="text-gray-900 font-bold text-lg mb-2">Дякуємо!</p>
                  <p className="text-gray-500">
                    Ярослав зв&apos;яжеться протягом 24 годин.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Ім&apos;я *</label>
                    <input type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input" placeholder="Ваше ім'я" />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Email *</label>
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input" placeholder="email@company.com" />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Телефон</label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input" placeholder="+380..." />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Сайт компанії</label>
                    <input type="url" value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      className="input" placeholder="https://yourcompany.com" />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Кількість людей</label>
                    <select value={form.teamSize}
                      onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                      className="input">
                      <option value="1-5">1-5</option>
                      <option value="6-20">6-20</option>
                      <option value="21-50">21-50</option>
                      <option value="50+">50+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm block mb-1">Що хочете автоматизувати?</label>
                    <textarea rows={2} value={form.task}
                      onChange={(e) => setForm({ ...form, task: e.target.value })}
                      className="input resize-none" placeholder="Опишіть коротко..." />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting}
                    className="w-full py-4 bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50">
                    {submitting ? "Відправляємо..." : "Надіслати заявку"}
                  </button>
                </form>
              )}
            </>
          )}

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
