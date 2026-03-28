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
        {/* 2. 3 КРОКИ — одразу під hero, головне "м'ясо" */}
        <RoadmapSection />
        {/* 2b. Перша перемога за 30 хвилин */}
        <FirstWinSection />
        {/* 2c. McKinsey цитата: 80% не бачать результату */}
        <McKinseyQuote />
        {/* 3. Чому 80% провалюють — розгорнуто */}
        <ProblemBlock />
        {/* 4. Будь-яка посада з клавіатурою */}
        <KeyboardJobsSection />
        {/* 5. ChatGPT vs AI-агент */}
        <NotChatGPT />
        {/* 6. Потенціал + Ресурс */}
        <PotentialResourceSection />
        {/* 7. Конкурентний тиск */}
        <CompetitivePressureSection />
        {/* 8. Калькулятор продуктивності */}
        <ProductivityCalculator />
        {/* 9. Модулі курсу */}
        <CourseProgram />
        {/* 10. Дослідження */}
        <ResearchStats />
        {/* 11. Про Ярослава */}
        <AuthorSection />
        {/* 12. Ціни — бігунок */}
        <PricingSection />
        {/* 13. Кейси по галузях */}
        <IndustryCasesSection />
        {/* 14. FAQ */}
        <FaqSection />
        {/* 15. CTA + Контакти */}
        <FooterCta />
      </main>
      <Footer />
    </>
  );
}
