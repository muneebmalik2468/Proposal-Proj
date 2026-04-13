import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Sora } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Toaster } from "react-hot-toast";
import { JsonLd } from "@/components/JsonLd";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: "400",
  subsets: ["latin"],
});

<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClientPitcher",
  "url": "https://clientpitcher.com",
  "description": "AI-powered outreach tool for Pakistani freelancers",
  "foundingDate": "2025",
  "areaServed": {
    "@type": "Country",
    "name": "Pakistan"
  }
}} />


export const metadata: Metadata = {
  metadataBase: new URL('https://clientpitcher.com'),
  title: {
    default: 'ClientPitcher — AI Proposal & Outreach Tool for Pakistani Freelancers',
    template: '%s | ClientPitcher',
  },
  description: 'Generate winning Upwork proposals, LinkedIn messages, and cold emails with AI. Built for Pakistani freelancers. Pay in PKR via JazzCash or Easypaisa.',
  keywords: ['upwork proposal generator', 'ai outreach tool', 'pakistani freelancers', 'linkedin message generator', 'cold email generator', 'freelancer tools pakistan'],
  authors: [{ name: 'ClientPitcher' }],
  creator: 'ClientPitcher',
  openGraph: {
    type: 'website',
    siteName: 'ClientPitcher',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@clientpitcher',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'dviNiAIMQhhDW68HKPGDDsIItf57Mfsb6cL4muxBcDQ',
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
      className={`${sora.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
