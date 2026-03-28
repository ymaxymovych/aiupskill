"use client";

import { motion, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";

// Fade in from bottom with blur
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide in from left or right
export function SlideIn({
  children,
  from = "left",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const x = from === "left" ? -60 : 60;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glassmorphism card with hover glow
export function GlassCard({
  children,
  className = "",
  glow = "blue",
}: {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "violet" | "green" | "red" | "none";
}) {
  const glowColors: Record<string, string> = {
    blue: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    violet: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    green: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    red: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    none: "",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl transition-shadow duration-300 ${glowColors[glow]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Animated counter
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("uk-UA")
  );

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Gradient text
export function GradientText({
  children,
  className = "",
  from = "from-blue-400",
  to = "to-violet-400",
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

// Glow blob (decorative background)
export function GlowBlob({
  color = "blue",
  size = "400px",
  className = "",
}: {
  color?: "blue" | "violet" | "amber";
  size?: string;
  className?: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/15",
    violet: "bg-violet-500/10",
    amber: "bg-amber-500/10",
  };

  return (
    <div
      className={`absolute rounded-full blur-[120px] pointer-events-none ${colors[color]} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// Section wrapper with consistent padding
export function V2Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`py-20 md:py-28 relative overflow-hidden ${className}`} id={id}>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        {children}
      </div>
    </section>
  );
}
