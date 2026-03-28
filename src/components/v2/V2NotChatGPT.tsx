"use client";

import { FadeIn, GlassCard, GradientText } from "./motion";

const ROWS = [
  { feature: "Працює 24/7 без людини", chatgpt: false, agent: true },
  { feature: "Підключається до CRM, Email, API", chatgpt: false, agent: true },
  { feature: "Виконує повний ланцюжок дій", chatgpt: false, agent: true },
  { feature: "Відповідає на окреме питання", chatgpt: true, agent: true },
  { feature: "Потребує промпт щоразу", chatgpt: true, agent: false },
  { feature: "Масштабується на всю команду", chatgpt: false, agent: true },
];

export default function V2NotChatGPT() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Це <GradientText>НЕ навчання ChatGPT</GradientText>
          </h2>
          <p className="text-white/45 text-center mb-12">
            ChatGPT — інструмент. AI-агент — автоматизація, що працює без вас.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <GlassCard className="overflow-hidden" glow="none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-sm text-white/40 font-medium">Можливість</th>
                  <th className="p-4 text-center text-sm text-white/40 font-medium">ChatGPT</th>
                  <th className="p-4 text-center text-sm font-medium">
                    <GradientText>AI-агент</GradientText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.04] last:border-0">
                    <td className="p-4 text-sm text-white/60">{row.feature}</td>
                    <td className="p-4 text-center">
                      {row.chatgpt ? (
                        <span className="text-white/40">✓</span>
                      ) : (
                        <span className="text-red-400/60">✕</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.agent ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
