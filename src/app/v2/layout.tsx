import type { Metadata } from "next";
import "./globals-v2.css";

export const metadata: Metadata = {
  title: "Впровадження AI в бізнес — навчи команду за 5 днів | AI Upskill",
  description:
    "Кожен співробітник побудує AI-автоматизацію для своєї посади. 5 модулів, 10 годин, живе навчання.",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2-dark bg-[#0a0a0a] text-[#f5f5f5] min-h-screen antialiased">
      {children}
    </div>
  );
}
