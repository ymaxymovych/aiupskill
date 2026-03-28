import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import MobileStickyCta from "@/components/shared/MobileStickyCta";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Впровадження AI в бізнес — навчи команду за 5 днів | AI Upskill",
  description:
    "Кожен співробітник побудує AI-автоматизацію для своєї посади. 4 модулі, 10 годин, живе навчання. Безкоштовна консультація.",
  metadataBase: new URL("https://aiupskill.live"),
  openGraph: {
    title: "AI Upskill — Впровадь AI у свою компанію за 5 днів",
    description:
      "Кожен співробітник побудує працюючу AI-автоматизацію. 5x продуктивність.",
    url: "https://aiupskill.live",
    siteName: "AI Upskill",
    type: "website",
    locale: "uk_UA",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Upskill — Впровадь AI у свою компанію за 5 днів",
    description:
      "Кожен співробітник побудує працюючу AI-автоматизацію. 5x продуктивність.",
  },
  alternates: {
    canonical: "https://aiupskill.live",
    languages: {
      uk: "https://aiupskill.live",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "AI Upskill",
  url: "https://aiupskill.live",
  description: "Впровадження AI в бізнес. Корпоративне навчання AI-автоматизації.",
  founder: {
    "@type": "Person",
    name: "Ярослав Максимович",
  },
  offers: [
    { "@type": "Offer", name: "Trial", price: "0", priceCurrency: "UAH" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={onest.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="font-sans pb-14 md:pb-0">
        {children}
        <MobileStickyCta />
      </body>
    </html>
  );
}
