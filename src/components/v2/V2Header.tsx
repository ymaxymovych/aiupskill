"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConsultationModal } from "@/components/shared/ConsultationModal";

const NAV = [
  { label: "Програма", href: "#program" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Ціни", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function V2Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/v2" className="text-lg font-bold tracking-tight">
            AI <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Upskill</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {n.label}
              </a>
            ))}
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm font-medium px-5 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] transition-all"
            >
              Консультація
            </button>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/70 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] px-6 pb-4"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-white/60 hover:text-white transition-colors"
              >
                {n.label}
              </a>
            ))}
            <button
              onClick={() => { setModalOpen(true); setMenuOpen(false); }}
              className="w-full mt-2 v2-btn-primary text-sm"
            >
              Консультація
            </button>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
