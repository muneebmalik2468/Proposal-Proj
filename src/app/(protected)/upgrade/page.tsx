import { headers } from "next/headers";
import PricingPageClient from "@/app/pricing/pricing-client";
import { PRO_PRICE_USD } from "@/lib/pricing";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: 'Pricing — Affordable Plans in PKR',
  description: 'Start free with 5 generations per month. Upgrade to Pro for unlimited proposals, emails, and messages. Pay in PKR via JazzCash, Easypaisa, or bank transfer.',
  keywords: ['clientpitcher pricing', 'ai freelancer tool price', 'upwork proposal generator price pakistan'],
  alternates: { canonical: 'https://clientpitcher.com/upgrade' },
};

<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ClientPitcher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ClientPitcher is an AI tool that helps Pakistani freelancers write winning Upwork proposals, LinkedIn messages, and cold emails in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Is ClientPitcher free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You get 5 free generations per month. Pro plan costs 1,395 PKR/month for unlimited use."
      }
    },
    {
      "@type": "Question",
      "name": "How do I pay for ClientPitcher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept JazzCash, Sadapay, and bank transfer. All pricing is in PKR. No credit card or PayPal needed."
      }
    },
    {
      "@type": "Question",
      "name": "Which platforms does ClientPitcher support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ClientPitcher generates content for Upwork proposals, LinkedIn InMail messages, LinkedIn connection notes, and cold emails."
      }
    }
  ]
}} />



async function getPkrPerUsd() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const url = `${proto}://${host}/api/exchange-rate`;

  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res) return 280;
  const json = (await res.json()) as { pkrPerUsd?: number };
  return typeof json.pkrPerUsd === "number" ? json.pkrPerUsd : 280;
}

export default async function UpgradePage() {
  const pkrPerUsd = await getPkrPerUsd();

  return (
    <PricingPageClient 
      pkrPerUsd={pkrPerUsd}
      proPriceUsd={PRO_PRICE_USD}
      isProtected={true}
    />
  );
}

