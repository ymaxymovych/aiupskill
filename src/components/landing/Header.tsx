"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { ConsultationModal } from "@/components/shared/ConsultationModal";

export default function Header() {
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
      <header
        data-sticky
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm ${
          scrolled ? "py-3 shadow-md" : "py-5"
        }`}
      >
        <div className="container-main flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold text-primary"
          >
            AI Upskill
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-text-secondary hover:text-text transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary text-sm !py-2.5 !px-6"
            >
              Замовити консультацію
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-4 space-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-text-secondary hover:text-text font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <hr className="border-border" />
            <button
              onClick={() => {
                setMenuOpen(false);
                setModalOpen(true);
              }}
              className="btn-primary block text-center text-sm w-full"
            >
              Замовити консультацію
            </button>
          </div>
        )}
      </header>
    </>
  );
}
