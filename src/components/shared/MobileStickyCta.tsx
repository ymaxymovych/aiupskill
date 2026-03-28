"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ConsultationModal } from "@/components/shared/ConsultationModal";

export default function MobileStickyCta() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();

  const isRolePage = /^\/cases\/[^/]+\/[^/]+$/.test(pathname || "");

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const handleShare = async () => {
    const text = `Знайшов курс з AI-автоматизацій для нашої команди: ${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "AI Upskill", text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {}
  };

  return (
    <>
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] px-4 py-2.5 flex gap-3">
          <a
            href="#pricing"
            className="flex-1 text-center py-2.5 bg-[#1a56db] text-white text-sm font-semibold rounded-lg"
          >
            Спробувати безкоштовно
          </a>
          {isRolePage ? (
            <button
              onClick={handleShare}
              className="flex-1 text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg"
            >
              Надіслати керівнику
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 text-center py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg"
            >
              Консультація
            </button>
          )}
        </div>
      </div>
    </>
  );
}
