import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fathom | AI Mock Tests From Real Exam Signals",
  description:
    "Generate high-fidelity mock tests from web research, review circled questions, and get text, voice, or video explanations.",
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
    "Fathom turns past exam signals into adaptive mock tests and multi-modal AI explanations.",
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
