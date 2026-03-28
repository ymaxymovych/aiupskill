import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import FirstWinSection from "@/components/landing/FirstWinSection";
import McKinseyQuote from "@/components/landing/McKinseyQuote";
import ProblemBlock from "@/components/landing/ProblemBlock";
import KeyboardJobsSection from "@/components/landing/KeyboardJobsSection";
import NotChatGPT from "@/components/landing/NotChatGPT";
import PotentialResourceSection from "@/components/landing/PotentialResourceSection";
import CompetitivePressureSection from "@/components/landing/CompetitivePressureSection";
import AuditWizard from "@/components/landing/AuditWizard";
import ProductivityCalculator from "@/components/landing/ProductivityCalculator";
import CourseProgram from "@/components/landing/CourseProgram";
import ResearchStats from "@/components/landing/ResearchStats";
import AuthorSection from "@/components/landing/AuthorSection";
import PricingSection from "@/components/landing/PricingSection";
import IndustryCasesSection from "@/components/landing/IndustryCasesSection";
import FaqSection from "@/components/landing/FaqSection";
import FooterCta from "@/components/landing/FooterCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 1. HERO */}
        <HeroSection />
        {/* 2. ❶❷❸ ТРИ КРОКИ — одразу під hero */}
        <RoadmapSection />
        {/* 3. Перша перемога за 30 хвилин + McKinsey */}
        <FirstWinSection />
        <McKinseyQuote />
        {/* 4. Чому 80% провалюють + 4 хрестики */}
        <ProblemBlock />
        {/* 5. Будь-яка посада з клавіатурою */}
        <KeyboardJobsSection />
        {/* 6. ChatGPT vs AI-агент */}
        <NotChatGPT />
        {/* 7. Потенціал + Ресурс */}
        <PotentialResourceSection />
        {/* 8. Конкурентний тиск */}
        <CompetitivePressureSection />
        {/* 9. AI-аудит (форма на лендінгу — НЕ видаляти!) */}
        <AuditWizard />
        {/* 10. Калькулятор продуктивності (в гривнях) */}
        <ProductivityCalculator />
        {/* 11. 5 модулів курсу */}
        <CourseProgram />
        {/* 12. Дослідження (Anthropic, PwC, Stanford, +38%) */}
        <ResearchStats />
        {/* 13. Про Ярослава (реальне фото!) */}
        <AuthorSection />
        {/* 14. Ціни (бігунок в гривнях) */}
        <PricingSection />
        {/* 15. Кейси по галузях */}
        <IndustryCasesSection />
        {/* 16. FAQ */}
        <FaqSection />
        {/* 17. CTA + контакти */}
        <FooterCta />
      </main>
      <Footer />
    </>
  );
}
