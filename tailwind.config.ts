import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a56db",
          hover: "#1e40af",
          light: "#dbeafe",
        },
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#d97706",
        },
        surface: {
          DEFAULT: "#fafafa",
          alt: "#f3f4f6",
          dark: "#111827",
        },
        text: {
          DEFAULT: "#1f2937",
          secondary: "#6b7280",
          "on-dark": "#f9fafb",
        },
        success: "#10b981",
        error: "#ef4444",
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: ["var(--font-onest)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "clamp(3rem, 8vw, 6rem)",
      },
      fontSize: {
        h1: ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["clamp(1rem, 1.2vw, 1.125rem)", { lineHeight: "1.6" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 4px 6px rgba(0,0,0,0.07)",
        lg: "0 10px 25px rgba(0,0,0,0.1)",
        xl: "0 20px 50px rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "count-up": "countUp 2s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
