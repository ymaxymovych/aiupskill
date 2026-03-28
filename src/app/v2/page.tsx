import V2Header from "@/components/v2/V2Header";
import V2Hero from "@/components/v2/V2Hero";
import V2Roadmap from "@/components/v2/V2Roadmap";
import V2McKinsey from "@/components/v2/V2McKinsey";
import V2FirstWin from "@/components/v2/V2FirstWin";
import V2Problem from "@/components/v2/V2Problem";
import V2Bridge from "@/components/v2/V2Bridge";
import V2Keyboard from "@/components/v2/V2Keyboard";
import V2NotChatGPT from "@/components/v2/V2NotChatGPT";
import V2Motivation from "@/components/v2/V2Motivation";
import V2Pressure from "@/components/v2/V2Pressure";
import V2CourseProgram from "@/components/v2/V2CourseProgram";
import V2Research from "@/components/v2/V2Research";
import V2Author from "@/components/v2/V2Author";
import V2Pricing from "@/components/v2/V2Pricing";
import V2Faq from "@/components/v2/V2Faq";
import V2FooterCta from "@/components/v2/V2FooterCta";
import V2Footer from "@/components/v2/V2Footer";

export default function V2Page() {
  return (
    <>
      <V2Header />
      <main>
        <V2Hero />
        <V2Roadmap />
        <V2McKinsey />
        <V2FirstWin />
        <V2Problem />
        <V2Bridge />
        <V2Keyboard />
        <V2NotChatGPT />
        <V2Motivation />
        <V2Pressure />
        <V2CourseProgram />
        <V2Research />
        <V2Author />
        <V2Pricing />
        <V2Faq />
        <V2FooterCta />
      </main>
      <V2Footer />
    </>
  );
}
