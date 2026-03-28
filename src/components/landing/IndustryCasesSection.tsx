"use client";

import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import Link from "next/link";

const INDUSTRIES = [
  { slug: "e-commerce", name: "E-commerce", emoji: "🛒", automations: 25, saving: "$500-2,000" },
  { slug: "marketynh-ahentstvo", name: "Маркетинг-агентство", emoji: "📢", automations: 22, saving: "$400-1,800" },
  { slug: "it-kompaniya", name: "IT-компанія", emoji: "💻", automations: 20, saving: "$600-2,500" },
  { slug: "vyrobnytstvo", name: "Виробництво", emoji: "🏭", automations: 18, saving: "$400-1,500" },
  { slug: "posluhy", name: "Сфера послуг", emoji: "🔧", automations: 20, saving: "$300-1,200" },
  { slug: "nerukhomist", name: "Нерухомість", emoji: "🏠", automations: 22, saving: "$500-2,000" },
  { slug: "lohistyka", name: "Логістика", emoji: "🚛", automations: 16, saving: "$400-1,500" },
  { slug: "osvita", name: "Освіта / EdTech", emoji: "📚", automations: 15, saving: "$300-1,000" },
  { slug: "medytsyna", name: "Медицина / Фарма", emoji: "🏥", automations: 16, saving: "$400-1,800" },
  { slug: "yurysprudentsiya", name: "Юриспруденція", emoji: "⚖️", automations: 14, saving: "$500-2,000" },
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
          Конкретні ланцюжки з цифрами для кожної ролі у вашій галузі
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
