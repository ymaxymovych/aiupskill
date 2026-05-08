import type { Metadata } from "next";
import { Onest } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MobileStickyCta from "@/components/shared/MobileStickyCta";

// Shared analytics across the AI Advisory Board family of sites.
// Same GA4 property + Meta Pixel as course.aiadvisoryboard.me / aiadvisoryboard.me
// so audiences and event funnels accumulate in one place.
const GA_ID = "G-NMFEHD8K7J";
const FB_PIXEL_ID = "1452095476362224";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Впровадження AI в бізнес — навчи команду за 5 днів | AI Upskill",
  description:
    "Кожен співробітник побудує AI-автоматизацію для своєї посади. 5 модулів, 10 годин, живе навчання. Безкоштовна консультація.",
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

        {/* Meta Pixel — shared with the rest of the AI Advisory Board family. */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* GA4 — same property as other AI Advisory Board sites. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
