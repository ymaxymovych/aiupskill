"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowBlob, GradientText } from "./motion";
import { ConsultationModal } from "@/components/shared/ConsultationModal";
import { ACCELERATOR_URL } from "@/lib/constants";

export default function V2Hero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Background glow blobs */}
      <GlowBlob color="blue" size="600px" className="top-[-200px] right-[-200px] opacity-40" />
      <GlowBlob color="violet" size="500px" className="bottom-[-100px] left-[-200px] opacity-30" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-[55%_45%] gap-12 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm text-white/40 font-medium mb-6 tracking-wide"
            >
              AI-агенти збільшують продуктивність до 5 раз — Anthropic, 100 000 задач
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6"
            >
              Кожен ваш співробітник
              <br />
              побудує AI-автоматизацію
              <br />
              для своєї посади.
              <br />
              <GradientText className="text-4xl md:text-5xl lg:text-6xl font-bold">
                За 5 днів.
              </GradientText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-white/50 font-medium mb-10 max-w-lg"
            >
              Від маркетолога до бухгалтера. Своїми руками. Без коду.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button onClick={() => setModalOpen(true)} className="v2-btn-primary">
                Замовити консультацію
              </button>
              <a
                href={`${ACCELERATOR_URL}/register?plan=trial`}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-btn-secondary text-center"
              >
                Спробувати безкоштовно
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 mt-6 text-sm text-white/30"
            >
              <span>15 хвилин — розберемо задачі вашої команди</span>
              <span className="hidden sm:inline">Перший модуль — без оплати</span>
            </motion.div>
          </div>

          {/* Right: Video placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 flex items-center justify-center mb-4 border border-white/10">
                <svg className="w-7 h-7 text-white/70 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="font-medium text-white/60 text-sm">Відео 3 хв</p>
              <p className="text-xs text-white/30">Скоро буде доступне</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
