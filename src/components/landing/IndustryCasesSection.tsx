"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import Link from "next/link";

const INDUSTRIES = [
  { slug: "e-commerce", name: "E-commerce", emoji: "🛒", automations: 25, saving: "20 000-80 000 грн" },
  { slug: "marketynh-ahentstvo", name: "Маркетинг-агентство", emoji: "📢", automations: 22, saving: "15 000-70 000 грн" },
  { slug: "it-kompaniya", name: "IT-компанія", emoji: "💻", automations: 20, saving: "25 000-100 000 грн" },
  { slug: "vyrobnytstvo", name: "Виробництво", emoji: "🏭", automations: 18, saving: "15 000-60 000 грн" },
  { slug: "posluhy", name: "Сфера послуг", emoji: "🔧", automations: 20, saving: "12 000-50 000 грн" },
  { slug: "nerukhomist", name: "Нерухомість", emoji: "🏠", automations: 22, saving: "20 000-80 000 грн" },
  { slug: "lohistyka", name: "Логістика", emoji: "🚛", automations: 16, saving: "15 000-60 000 грн" },
  { slug: "osvita", name: "Освіта / EdTech", emoji: "📚", automations: 15, saving: "12 000-40 000 грн" },
  { slug: "medytsyna", name: "Медицина / Фарма", emoji: "🏥", automations: 16, saving: "15 000-70 000 грн" },
  { slug: "yurysprudentsiya", name: "Юриспруденція", emoji: "⚖️", automations: 14, saving: "20 000-80 000 грн" },
];

export default function IndustryCasesSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface">
      <div className="container-main" ref={ref}>
        <h2
          className={cn(
            "text-h2 text-text text-center mb-3 animate-in",
            isVisible && "visible"
          )}
        >
          Кейси AI-автоматизацій по галузях
        </h2>
        <p
          className={cn(
            "text-body text-text-secondary text-center mb-10 animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          Згенеровані AI на основі реальних проблем.
          Ваша команда навчиться робити таке саме.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <Link
              key={ind.slug}
              href={`/cases/${ind.slug}`}
              className={cn(
                "card !p-4 hover:border-primary/40 group animate-in",
                isVisible && "visible"
              )}
              style={{ transitionDelay: `${200 + i * 80}ms` }}
            >
              <span className="text-3xl block mb-2">{ind.emoji}</span>
              <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors mb-1">
                {ind.name}
              </h3>
              <p className="text-xs text-text-secondary">
                {ind.automations} автоматизацій
              </p>
              <p className="text-xs text-success font-medium mt-1">
                {ind.saving}/міс
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/cases"
            className="btn-secondary inline-block"
          >
            Всі галузі та ролі →
          </Link>
        </div>
      </div>
    </section>
  );
}
