"use client";

import { useState } from "react";
import { useIntersection } from "@/hooks/useIntersection";
import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Скільки часу потрібно на тиждень?",
    a: "~10 годин на тиждень протягом 2 тижнів. Це можна розбити на 2 години щодня. Кожен проходить у своєму темпі.",
  },
  {
    q: "Мої співробітники не технічні. Чи впораються?",
    a: "Курс розрахований на нетехнічних людей. Маркетологів, HR, бухгалтерів, менеджерів. Ніякого коду — ми використовуємо no-code інструменти та AI-агентів. Якщо людина вміє працювати з Excel — вона впорається.",
  },
  {
    q: "Чим це відрізняється від підписки на ChatGPT?",
    a: 'ChatGPT — це інструмент. Ми навчаємо будувати AI-агентів — автоматизації що працюють 24/7 без участі людини. Це наступний рівень після ChatGPT.',
  },
  {
    q: "Чому треба вчити ВСІХ, а не тільки IT-відділ?",
    a: "Бо IT-відділ не знає рутину маркетолога, бухгалтера, HR. Кожен співробітник найкраще знає свою роботу і тому він найкраще знає що автоматизувати. FedEx це зрозумів — і навчає всіх 400 000 людей.",
  },
  {
    q: "Що якщо хтось не пройде?",
    a: "Менеджер-дашборд показує прогрес кожного. Ви бачите хто тягне, а хто ні. Навіть якщо 80% не впораються — ті 20% що залишаться будуть генерувати достатньо автоматизацій щоб окупити вкладення.",
  },
  {
    q: "Чи є підтримка після курсу?",
    a: "4 тижні підтримки включено у вартість: Telegram-чат випускників, щотижневий Q&A з Ярославом, допомога з другою автоматизацією.",
  },
  {
    q: "Скільки це коштує для 50 людей?",
    a: "Department тариф — $1 900 за до 30 людей. Corporation — від $3 500 за 50+ людей. Замовте консультацію — підберемо оптимальний план.",
  },
  {
    q: "А звідки цифра 5x?",
    a: "Дослідження Anthropic на 100 000 реальних задачах. Також підтверджується: PwC (66% приріст, 308 компаній), Stanford (2.5x, 18 задач), IBM ($4.5B приріст, 270 000 працівників).",
  },
  {
    q: "Чи можна спробувати перед покупкою?",
    a: "Так. Trial — безкоштовний. Ви отримуєте AI-аудит своєї рутини і проходите перший модуль без оплати і без картки.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-4 text-left hover:bg-surface-alt/50 transition-colors group"
      >
        <span className="font-medium text-text pr-4">{q}</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-text-secondary shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-4 pb-5 text-text-secondary leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { ref, isVisible } = useIntersection();

  return (
    <section className="section-padding bg-surface-alt" id="faq">
      <div className="container-main" ref={ref}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <h2
          className={cn(
            "text-h2 text-text text-center mb-10 animate-in",
            isVisible && "visible"
          )}
        >
          Часті питання
        </h2>
        <div
          className={cn(
            "max-w-3xl mx-auto bg-white rounded-xl border border-border overflow-hidden animate-in",
            isVisible && "visible"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
