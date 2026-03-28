import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import FirstWinSection from "@/components/landing/FirstWinSection";
import McKinseyQuote from "@/components/landing/McKinseyQuote";
import ProblemBlock from "@/components/landing/ProblemBlock";
import BridgeSection from "@/components/landing/BridgeSection";
import KeyboardJobsSection from "@/components/landing/KeyboardJobsSection";
import NotChatGPT from "@/components/landing/NotChatGPT";
import PotentialResourceSection from "@/components/landing/PotentialResourceSection";
import CompetitivePressureSection from "@/components/landing/CompetitivePressureSection";
import AuditWizard from "@/components/landing/AuditWizard";
import ProductivityCalculator from "@/components/landing/ProductivityCalculator";
import CourseProgram from "@/components/landing/CourseProgram";
import ResearchStats from "@/components/landing/ResearchStats";
import SocialProofReal from "@/components/landing/SocialProofReal";
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
        {/* 2. ❶❷❸ ТРИ КРОКИ */}
        <RoadmapSection />
        {/* 3. Перша перемога + McKinsey */}
        <FirstWinSection />
        <McKinseyQuote />
        {/* 4. Чому 80% провалюють + 4 хрестики */}
        <ProblemBlock />
        {/* 5. Міст: "AI Upskill працює інакше" */}
        <BridgeSection />
        {/* 6. Будь-яка посада з клавіатурою */}
        <KeyboardJobsSection />
        {/* 7. ChatGPT vs AI-агент */}
        <NotChatGPT />
        {/* 8. Потенціал + Ресурс */}
        <PotentialResourceSection />
        {/* 9. Конкурентний тиск */}
        <CompetitivePressureSection />
        {/* 10. AI-аудит */}
        <AuditWizard />
        {/* 11. Калькулятор продуктивності */}
        <ProductivityCalculator />
        {/* 12. 5 модулів */}
        <CourseProgram />
        {/* 13. Дослідження (+38%, Gartner) */}
        <ResearchStats />
        {/* 14. Реальний соціальний доказ */}
        <SocialProofReal />
        {/* 15. Про Ярослава (від 1-ї особи, Forbes PDF) */}
        <AuthorSection />
        {/* 16. Ціни (бігунок в грн) */}
        <PricingSection />
        {/* 17. Кейси по галузях */}
        <IndustryCasesSection />
        {/* 18. FAQ */}
        <FaqSection />
        {/* 19. CTA + контакти */}
        <FooterCta />
      </main>
      <Footer />
    </>
  );
}
