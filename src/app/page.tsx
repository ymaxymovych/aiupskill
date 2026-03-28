import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import AuditWizard from "@/components/landing/AuditWizard";
import ProblemBlock from "@/components/landing/ProblemBlock";
import SolutionBlock from "@/components/landing/SolutionBlock";
import QuoteSeparator from "@/components/landing/QuoteSeparator";
import RoadmapSection from "@/components/landing/RoadmapSection";
import NotChatGPT from "@/components/landing/NotChatGPT";
import ProductivityCalculator from "@/components/landing/ProductivityCalculator";
import CourseProgram from "@/components/landing/CourseProgram";
import ResearchStats from "@/components/landing/ResearchStats";
import AuthorSection from "@/components/landing/AuthorSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import FooterCta from "@/components/landing/FooterCta";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SocialProofBar />
        <AuditWizard />
        <ProblemBlock />
        <SolutionBlock />
        <QuoteSeparator />
        <RoadmapSection />
        <NotChatGPT />
        <ProductivityCalculator />
        <CourseProgram />
        <ResearchStats />
        <AuthorSection />
        <PricingSection />
        <FaqSection />
        <FooterCta />
      </main>
      <Footer />
    </>
  );
}
