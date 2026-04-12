import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const firecrawlSans = localFont({
  src: [
    { path: "../../public/fonts/firecrawl-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/firecrawl-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/firecrawl-sans-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/firecrawl-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-firecrawl-sans",
  display: "swap",
});

const firecrawlMono = localFont({
  src: "../../public/fonts/firecrawl-mono-variable.woff2",
  variable: "--font-firecrawl-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fathom | Research-Led Exam Builder",
  description:
    "Fathom researches the web, extracts live source material, and assembles concise exam blueprints for adaptive practice.",
  keywords: [
    "AI test prep",
    "mock test generator",
    "exam preparation",
    "adaptive learning",
    "AI tutor",
    "study workflow",
  ],
  authors: [{ name: "Fathom" }],
  openGraph: {
    title: "Fathom | AI Mock Tests From Real Exam Signals",
    description:
      "Generate high-fidelity mock tests from web research, review circled questions, and get text, voice, or video explanations.",
    siteName: "Fathom",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fathom | AI Mock Tests From Real Exam Signals",
    description:
      "Generate high-fidelity mock tests from web research, review circled questions, and get text, voice, or video explanations.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Fathom",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "Fathom turns live research and source extraction into adaptive exam blueprints and review workflows.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${firecrawlSans.variable} ${firecrawlMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
