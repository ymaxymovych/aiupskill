import Link from "next/link";
import { INDUSTRIES } from "@/lib/seo/industries-roles";
import { cn } from "@/lib/cn";

interface Props {
  currentSlug?: string;
}

export default function IndustrySidebar({ currentSlug }: Props) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24">
        <h3 className="text-sm font-semibold text-text mb-3">Галузі</h3>
        <nav className="space-y-1">
          {INDUSTRIES.map((ind) => (
            <Link
              key={ind.slug}
              href={`/cases/${ind.slug}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                currentSlug === ind.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-text-secondary hover:bg-surface hover:text-text"
              )}
            >
              <span>{ind.emoji}</span>
              <span className="truncate">{ind.name.split(" / ")[0]}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
