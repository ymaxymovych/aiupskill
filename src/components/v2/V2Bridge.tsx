"use client";

import { FadeIn, GradientText } from "./motion";

export default function V2Bridge() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <GradientText>AI Upskill працює інакше:</GradientText>
          </h2>
          <div className="space-y-2 text-lg text-white/50">
            <p>не один процес — <span className="text-white font-medium">а кожна посада.</span></p>
            <p>Не відео — <span className="text-white font-medium">а руками.</span></p>
            <p>Не консультант — <span className="text-white font-medium">а ваші власні люди.</span></p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
