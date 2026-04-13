import { JsonLd } from "@/components/JsonLd";
import HomePageClient from "./home-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'ClientPitcher — AI Proposal & Outreach Tool for Pakistani Freelancers',
  description: 'Write winning Upwork proposals, LinkedIn InMails, connection notes, and cold emails in seconds. AI-powered outreach built for Pakistan. Free to start, pay in PKR.',
  keywords: ['upwork proposal generator', 'ai proposal writer', 'freelancer outreach tool pakistan', 'linkedin inmail generator', 'cold email writer ai', 'upwork cover letter generator'],
  openGraph: {
    title: 'ClientPitcher — AI Outreach for Pakistani Freelancers',
    description: 'Write winning proposals and outreach messages in seconds with AI. Free to start.',
    url: 'https://clientpitcher.com',
  },
  alternates: { canonical: 'https://clientpitcher.com' },
};

<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ClientPitcher",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://clientpitcher.com",
  "description": "AI proposal and outreach generator for Pakistani freelancers",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PKR",
    "description": "Free tier with 5 generations per month"
  }
}} />


export default function Home() {
  return <HomePageClient />;
}
