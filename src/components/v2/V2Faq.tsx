"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, GlassCard } from "./motion";

const FAQ_ITEMS = [
  { q: "Скільки часу потрібно на тиждень?", a: "10 годин за 5 днів. Можна розбити на 2 години щодня." },
  { q: "Мої співробітники не технічні. Чи впораються?", a: "Курс розрахований на нетехнічних людей. Маркетологів, HR, бухгалтерів, менеджерів. Ніякого коду — ми використовуємо no-code інструменти та AI-агентів." },
  { q: "Чим це відрізняється від підписки на ChatGPT?", a: "ChatGPT — це інструмент. Ми навчаємо будувати AI-агентів — автоматизації що працюють 24/7 без участі людини." },
  { q: "Чому треба вчити ВСІХ, а не тільки IT-відділ?", a: "Бо IT-відділ не знає рутину маркетолога, бухгалтера, HR. Кожен співробітник найкраще знає свою роботу." },
  { q: "Скільки це коштує для 50 людей?", a: "50 людей × 1 999 грн = 99 950 грн. Доступ на 12 місяців. Перший модуль — безкоштовно." },
  { q: "Чи є підтримка після курсу?", a: "4 тижні підтримки включено: Telegram-чат випускників, щотижневий Q&A, допомога з другою автоматизацією." },
  { q: "Чи можна спробувати перед покупкою?", a: "Так. Trial — безкоштовний. AI-аудит рутини і перший модуль без оплати і без картки." },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="font-medium text-white/80 pr-4">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/30 text-xl shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-white/45 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function V2Faq() {
  return (
    <section className="py-20 md:py-28" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Часті питання
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <GlassCard className="overflow-hidden" glow="none">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
