"use client";

import { useState, useEffect } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { TELEGRAM_URL } from "@/lib/constants";

interface FormData {
  name: string;
  contact: string;
  preferredTime: string;
  companyUrl: string;
}

export default function FooterCta() {
  const { ref, isVisible } = useIntersection();
  const [form, setForm] = useState<FormData>({
    name: "",
    contact: "",
    preferredTime: "",
    companyUrl: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Pre-fill from audit wizard localStorage
  useEffect(() => {
    try {
      const audit = localStorage.getItem("aiupskill_audit");
      if (audit) {
        const data = JSON.parse(audit);
        if (data.website_url) {
          setForm((f) => ({ ...f, companyUrl: data.website_url }));
        }
      }
    } catch {}
  }, []);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (form.name.trim().length < 2) errs.name = "Введіть ваше ім'я";
    if (!form.contact.trim()) {
      errs.contact = "Введіть телефон або email";
    } else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact);
      const isPhone = /^\+?[\d\s()-]{7,}$/.test(form.contact);
      if (!isEmail && !isPhone) errs.contact = "Введіть коректний телефон або email";
    }
    if (form.companyUrl && !/^https?:\/\//.test(form.companyUrl) && form.companyUrl.length > 0) {
      // Auto-fix: add https://
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    // Get audit data from localStorage if available
    let auditResult = null;
    let employeeCount = null;
    try {
      const audit = localStorage.getItem("aiupskill_audit");
      if (audit) {
        const data = JSON.parse(audit);
        auditResult = data.result || null;
        employeeCount = data.employee_count || null;
      }
    } catch {}

    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          preferred_time: form.preferredTime.trim() || null,
          company_url: form.companyUrl.trim() || null,
          employee_count: employeeCount,
          audit_result: auditResult,
          source: "footer_cta",
        }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <section className="section-padding bg-primary/5" id="consultation">
        <div className="container-main text-center max-w-xl mx-auto">
          <div className="text-4xl mb-4">&#10003;</div>
          <h2 className="text-h2 text-text mb-4">
            Дякуємо, {form.name}!
          </h2>
          <p className="text-body text-text-secondary mb-6">
            Ярослав зв&apos;яжеться з вами протягом 24 годин.
          </p>
          <p className="text-text-secondary mb-6">
            А поки — спробуйте перший модуль безкоштовно:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://accelerator.aiadvisoryboard.me/register?plan=trial"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Спробувати Trial &rarr;
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Telegram Ярослава &rarr;
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-primary/5" id="consultation" ref={ref}>
      <div className="container-main max-w-2xl mx-auto">
        <h2
          className={cn(
            "text-h2 text-text text-center mb-3 animate-in",
            isVisible && "visible"
          )}
        >
          Почніть з безкоштовної консультації
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-8 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          15 хвилин. Ярослав особисто розбере задачі вашої команди і покаже що AI
          може змінити.
        </p>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "space-y-4 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Олександр"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                autoComplete="name"
                className={cn(
                  "input-field",
                  errors.name && "!border-error"
                )}
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="+380... або email"
                value={form.contact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
                autoComplete="email"
                className={cn(
                  "input-field",
                  errors.contact && "!border-error"
                )}
              />
              {errors.contact && (
                <p className="text-error text-sm mt-1">{errors.contact}</p>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Коли зручно зателефонувати? (опціонально)"
            value={form.preferredTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, preferredTime: e.target.value }))
            }
            className="input-field"
          />

          <input
            type="text"
            placeholder="https://company.ua (опціонально)"
            value={form.companyUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, companyUrl: e.target.value }))
            }
            autoComplete="url"
            className="input-field"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full !py-4 text-lg disabled:opacity-50"
          >
            {status === "sending"
              ? "Відправляємо..."
              : "Замовити консультацію →"}
          </button>

          {status === "error" && (
            <p className="text-error text-center text-sm">
              Щось пішло не так. Спробуйте ще раз або напишіть у{" "}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Telegram
              </a>
              .
            </p>
          )}

          <p className="text-center text-xs text-text-secondary mt-2">
            Або напишіть:{" "}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              t.me/YaroslavMaxymovych
            </a>
          </p>
          <p className="text-center text-xs text-text-secondary">
            &#128274; Ваші дані захищені. Ми не передаємо їх третім.
          </p>
        </form>
      </div>
    </section>
  );
}
