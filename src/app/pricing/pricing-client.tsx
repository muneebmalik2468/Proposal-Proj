"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PLANS = [
  {
    id: "basic",
    eyebrow: "Basic",
    name: "Basic",
    usdPrice: 2,
    tagline: "For freelancers just testing the waters. Upwork proposals only with basic limits.",
    badge: null,
    features: [
      { text: "Upwork proposals", tag: "15 credits/mo", included: true },
      { text: "Problem Mirror style", included: true },
      { text: "Proof Closer + Diagnostic styles", included: true },
      { text: "LinkedIn InMail tool", included: true },
      { text: "LinkedIn connection notes", included: true },
      { text: "Cold email generator", included: true },
      { text: "Copy to clipboard", included: true },
      { text: "Mobile friendly", included: true },
      { text: "No ads", included: true },
    ],
    notIncluded: [
      "Conversion tracker",
      "Analytics dashboard",
      "Priority speed",
    ],
    buttonText: "Get Started",
    buttonStyle: "outline",
  },
  {
    id: "pro",
    eyebrow: "Pro",
    name: "Pro",
    usdPrice: 5,
    tagline: "Everything a serious Pakistani freelancer needs. All tools, high credits, track your wins.",
    badge: "★ Most Popular",
    features: [
      { text: "Upwork proposal writer", tag: "200 credits/mo", included: true },
      { text: "LinkedIn InMail tool", included: true },
      { text: "LinkedIn connection notes", included: true },
      { text: "Cold email generator", included: true },
      { text: "All 3 prompt styles per tool", included: true },
      { text: "Conversion tracker", included: true },
      { text: "History (last 30 generations)", included: true },
      { text: "No ads ever", included: true },
    ],
    notIncluded: [
      "Full analytics dashboard",
      "Unlimited credits",
      "Priority speed",
    ],
    buttonText: "Upgrade to Pro — Best Value",
    buttonStyle: "blue",
  },
  {
    id: "promax",
    eyebrow: "Pro Max",
    name: "Pro Max",
    usdPrice: 10,
    tagline: "For top earners who want full data, unlimited usage, and the complete picture.",
    badge: null,
    features: [
      { text: "Unlimited credits", tag: "∞", included: true, special: true },
      { text: "Full analytics dashboard", included: true, special: true },
      { text: "Win rate & conversion insights", included: true, special: true },
      { text: "Style performance analytics", included: true, special: true },
      { text: "Priority generation speed", included: true, special: true },
      { text: "Unlimited history", included: true, special: true },
      { text: "Early access to new tools", included: true, special: true },
      { text: "Direct WhatsApp support", included: true, special: true },
    ],
    notIncluded: [],
    buttonText: "Get Pro Max",
    buttonStyle: "white",
    isDark: true,
  },
];

const FAQS = [
  {
    q: "What is ClientPitcher?",
    a: "ClientPitcher is an AI tool that helps Pakistani freelancers write winning Upwork proposals, LinkedIn messages, and cold emails in seconds.",
  },
  {
    q: "Is ClientPitcher free?",
    a: "Yes. You get 5 free generations per month. Pro plan costs 1,395 PKR/month for unlimited use.",
  },
  {
    q: "How are credits counted?",
    a: "One credit = one generation. Clicking Generate uses 1 credit. Regenerating also uses 1 credit. Copying never uses a credit. Credits reset automatically on the 1st of every month.",
  },
  {
    q: "Why does Basic only have 15 credits?",
    a: "A typical active freelancer sends 40-60 proposals per month. 15 credits lets you properly test the tool in your first week — but it's not enough to rely on it. That's intentional. Pro's 200 credits is more than enough for any serious freelancer.",
  },
  {
    q: "How do I pay for ClientPitcher?",
    a: "We accept JazzCash, Sadapay, and bank transfer. All pricing is in PKR. No credit card or PayPal needed.",
  },
  {
    q: "Can I switch plans or cancel anytime?",
    a: "Yes to both. Upgrade or downgrade by WhatsApping us. Cancel anytime — just let us know before your next billing date. No contracts, no complicated cancellation forms.",
  },
  {
    q: "Is this cheaper than other platforms?",
    a: "Yes. Other platforms charge $10–15/month for Upwork proposals only. Client Pitcher Pro at $5/month includes 4 tools — Upwork proposals, LinkedIn InMail, LinkedIn connection notes, and cold email. More tools at half the price.",
  },
  {
    q: "What if I run out of credits before month end?",
    a: "Pro users have 200 credits — the average active freelancer uses 40-60 per month, so most Pro users never hit the limit. If you do, you can upgrade to Pro Max for unlimited credits, or wait for the monthly reset.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your inputs and generated outputs are never shared or used to train AI models. Inputs are passed to OpenAI for generation only and not stored on their servers beyond the API call. We store your generation history only to show it to you in your dashboard.",
  },
  {
    q: "How is the PKR price calculated?",
    a: "We fetch the live USD/PKR exchange rate from a currency API every 24 hours. Your plan price in PKR = $[USD price] × current rate. So if the rate is 280, Pro costs 1,400 PKR. If the rate changes to 285, Pro costs 1,425 PKR. This protects us both from rupee fluctuations.",
  },
];

export default function PricingPageClient({
  pkrPerUsd,
  proPriceUsd,
  isProtected = false,
}: {
  pkrPerUsd: number;
  proPriceUsd: number;
  isProtected?: boolean;
}) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("user@example.com");

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
        // console.log("Fetched user email:", user?.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };
    fetchUserEmail();
  }, []);

  const getPkrPrice = (usdPrice: number) => {
    return Math.round(usdPrice * pkrPerUsd * (isAnnual ? 10 : 1));
  };

  const openPayment = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <Link href="/" className="font-heading text-lg font-bold text-slate-900">
            ClientPitcher
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {isProtected ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:px-3"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 underline decoration-slate-900 sm:px-3"
                >
                  Pricing
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Start Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Live tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-green-600 animate-pulse"></span>
            Live PKR pricing — updates every 24 hours
          </div>

          <h1 className="font-heading text-4xl font-extrabold text-slate-900 sm:text-5xl mb-4">
            Simple pricing.
            <br />
            <span className="text-blue-600">No surprises.</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            Pay in Pakistani Rupees. JazzCash, Sadapay or bank transfer. No credit card ever required.
          </p>

          {/* Exchange rate pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
            <span className="text-slate-600">Today's rate:</span>
            <strong className="text-slate-900">
              1 USD = <span className="font-mono">{pkrPerUsd.toLocaleString()}</span> PKR
            </strong>
            <span className="text-xs font-semibold text-green-600">● Live</span>
          </div>

          {/* Billing toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-slate-700">Monthly</label>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
              <label className="text-sm font-semibold text-slate-700">Annual</label>
              {isAnnual && (
                <span className="ml-2 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
                  2 months free
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 transition-all ${
                plan.isDark
                  ? "border border-slate-900 bg-slate-900 text-white"
                  : plan.badge
                  ? "border-2 border-blue-600 bg-white shadow-lg"
                  : "border border-slate-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  {plan.badge}
                </div>
              )}

              <div className={`text-xs font-bold uppercase tracking-widest ${
                plan.isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                {plan.eyebrow}
              </div>

              <h3 className={`mt-2 font-heading text-2xl font-bold ${
                plan.isDark ? "text-white" : "text-slate-900"
              }`}>
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className={`font-heading text-4xl font-bold ${
                  plan.badge ? "text-blue-600" : plan.isDark ? "text-white" : "text-slate-900"
                }`}>
                  {getPkrPrice(plan.usdPrice).toLocaleString()}
                </span>
                <span className={`text-sm ${
                  plan.isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  / {isAnnual ? "year" : "month"}
                </span>
              </div>

              <p className={`text-xs font-mono mt-2 ${
                plan.isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                ≈ ${(plan.usdPrice * (isAnnual ? 10 : 1)).toFixed(0)} USD {isAnnual ? "annually" : "monthly"}
              </p>

              <p className={`mt-3 text-sm leading-relaxed ${
                plan.isDark ? "text-slate-300" : "text-slate-600"
              }`}>
                {plan.tagline}
              </p>

              <hr className={`my-5 ${
                plan.isDark ? "border-slate-700" : "border-slate-200"
              }`} />

              <div className={`text-xs font-bold uppercase tracking-widest ${
                plan.isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Includes
              </div>

              <ul className="mt-3 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-sm ${
                    plan.isDark ? "text-slate-200" : "text-slate-700"
                  }`}>
                    <span className={`mt-0.5 font-bold ${
                      plan.badge && feature.included
                        ? "text-blue-600"
                        : plan.isDark && feature.included
                        ? "text-green-400"
                        : "text-green-600"
                    }`}>
                      ✓
                    </span>
                    <span>
                      {feature.text}
                      {feature.tag && (
                        <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          feature.tag.includes("∞")
                            ? plan.isDark
                              ? "bg-slate-800 text-white"
                              : "bg-slate-900 text-white"
                            : feature.tag.includes("200")
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          {feature.tag}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.notIncluded.length > 0 && (
                <>
                  <hr className={`my-4 ${
                    plan.isDark ? "border-slate-700" : "border-slate-200"
                  }`} />

                  <div className={`text-xs font-bold uppercase tracking-widest ${
                    plan.isDark ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Not included
                  </div>

                  <ul className="mt-3 space-y-2">
                    {plan.notIncluded.map((feature, idx) => (
                      <li key={idx} className={`flex items-start gap-2 text-sm ${
                        plan.isDark ? "text-slate-400" : "text-slate-500"
                      }`}>
                        <span className={`mt-0.5 font-bold ${
                          plan.isDark ? "text-slate-600" : "text-slate-300"
                        }`}>
                          ✗
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <button
                onClick={() => openPayment(plan.id)}
                className={`mt-6 w-full rounded-xl py-3 font-heading font-bold transition-all ${
                  plan.buttonStyle === "blue"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    : plan.buttonStyle === "white"
                    ? "bg-white text-slate-900 hover:opacity-90"
                    : plan.isDark
                    ? "border border-slate-700 bg-transparent text-white hover:bg-slate-800"
                    : "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.buttonText}
              </button>

              <p className={`mt-3 text-center text-xs ${
                plan.isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                Pay via JazzCash or Sadapay
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VS Competitor Section */}
      <section className="bg-slate-900 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-white">
            3× cheaper than the competition
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Other Platforms charge $10–15/month for Upwork proposals only. ClientPitcher Pro gives you 4 tools at
            just $5/month.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 items-center">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-5">
              <div className="text-xs font-semibold uppercase text-slate-400 mb-2">Other Platforms</div>
              <div className="font-heading text-2xl font-bold text-slate-400 mb-3">$12/mo</div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>✗ Upwork proposals only</li>
                <li>✗ No LinkedIn tools</li>
                <li>✗ No cold email</li>
              </ul>
            </div>

            <div className="font-heading text-xl font-bold text-slate-500">VS</div>

            <div className="rounded-lg border-2 border-blue-500 bg-blue-500/10 p-5">
              <div className="text-xs font-semibold uppercase text-white mb-2">ClientPitcher</div>
              <div className="font-heading text-2xl font-bold text-white mb-3">$5/mo</div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li>✓ Upwork proposals</li>
                <li>✓ LinkedIn InMail & notes</li>
                <li>✓ Cold email generator</li>
              </ul>
            </div>
          </div>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Switch to ClientPitcher Pro → Save $7/month
          </Link>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="bg-slate-100 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-center text-slate-900 mb-2">How to pay</h2>
          <p className="text-center text-sm text-slate-600 mb-10">
            No credit card needed. No foreign payment processor. Pay in rupees using the method you already use every
            day.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {[
              { name: "JazzCash", number: "0327 8878946", color: "green" },
              { name: "Sadapay", number: "03021496945", color: "blue" },
              { name: "Bank (Meezan)", number: "02140108946578", color: "purple" },
              // { name: "Raast", number: "03025551234", color: "amber" },
            ].map((method) => (
              <div
                key={method.name}
                className={`rounded-lg border-2 p-4 ${
                  method.color === "green"
                    ? "border-green-200 bg-white"
                    : method.color === "blue"
                    ? "border-blue-200 bg-white"
                    : method.color === "purple"
                    ? "border-purple-200 bg-white"
                    : "border-amber-200 bg-white"
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className={`font-bold text-sm ${
                    method.color === "green"
                      ? "text-green-800"
                      : method.color === "blue"
                      ? "text-blue-800"
                      : method.color === "purple"
                      ? "text-purple-800"
                      : "text-amber-800"
                  }`}>
                    {method.name}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    method.color === "green"
                      ? "bg-green-100 text-green-700"
                      : method.color === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : method.color === "purple"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    Available
                  </span>
                </div>
                <div className="font-mono text-lg font-bold text-slate-900 mb-1">{method.number}</div>
                <p className="text-xs text-slate-500">Receiver: <span className="font-medium text-slate-700">ClientPitcher (Abrar)</span></p>
                <p className="text-xs text-slate-500">Send screenshot on WhatsApp after payment</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              {[
                { num: "1", title: "Send Payment", desc: "Via JazzCash, Sadapay, or bank transfer" },
                { num: "2", title: "Share Screenshot", desc: "WhatsApp us proof of payment" },
                { num: "3", title: "We Activate", desc: "Your account within 2 hours" },
              ].map((step) => (
                <div key={step.num}>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-heading font-bold text-white">
                    {step.num}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            // onClick={() => window.open("https://wa.me/923021496945", "_blank")}
            onClick={() => {
              const message = `Hi, I have completed the payment.\nEmail: ${userEmail}\nPlease find the screenshot attached.`;
              const url = `https://wa.me/923706500702?text=${encodeURIComponent(message)}`;
              window.open(url, "_blank");
            }}
            className="w-full rounded-lg bg-green-600 px-4 py-4 font-bold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Payment Screenshot on WhatsApp
          </button>
          <p className="mt-3 text-center text-xs text-slate-600">
            We are online 9am–11pm PKT · Usually activated within 2 hours
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-center text-slate-900 mb-2">
          Full feature comparison
        </h2>
        <p className="text-center text-sm text-slate-600 mb-8">Everything you get on each plan</p>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-700">Feature</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-700">Basic</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase bg-blue-50 text-blue-700">
                  Pro
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-700">Pro Max</th>
              </tr>
            </thead>
            <tbody>
              {/* Tools Section */}
              <tr className="border-b border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-4 py-2 text-xs font-bold uppercase text-slate-600">
                  Tools
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Upwork proposal writer</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold bg-blue-50">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">LinkedIn InMail</td>
                {/* <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td> */}
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold bg-blue-50">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">LinkedIn connection notes</td>
                {/* <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td> */}
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold bg-blue-50">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Cold email generator</td>
                {/* <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td> */}
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold bg-blue-50">✓</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr>

              {/* Usage Limits Section */}
              <tr className="border-b border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-4 py-2 text-xs font-bold uppercase text-slate-600">
                  Usage Limits
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Monthly credits</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-slate-900">15</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-blue-600 bg-blue-50">200</td>
                <td className="px-4 py-3 text-center text-sm font-bold text-green-600">Unlimited ∞</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Prompt styles per tool</td>
                <td className="px-4 py-3 text-center text-sm text-slate-600">All 3</td>
                <td className="px-4 py-3 text-center text-sm text-slate-900 bg-blue-50">All 3</td>
                <td className="px-4 py-3 text-center text-sm text-slate-900">All 3</td>
              </tr>

              {/* Features Section */}
              <tr className="border-b border-slate-200 bg-slate-50">
                <td colSpan={4} className="px-4 py-2 text-xs font-bold uppercase text-slate-600">
                  Features
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Conversion tracker</td>
                <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold bg-blue-50">✓ <span className="text-xs text-gray-500">(Coming Soon)</span></td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓ <span className="text-xs text-gray-500">(Coming Soon)</span></td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Generation history</td>
                <td className="px-4 py-3 text-center text-sm text-slate-600">Last 10</td>
                <td className="px-4 py-3 text-center text-sm text-slate-900 bg-blue-50">Last 30</td>
                <td className="px-4 py-3 text-center text-sm text-slate-900">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-200 bg-blue-50">
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">Analytics dashboard</td>
                <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td>
                <td className="px-4 py-3 text-center text-slate-400 font-bold">✗</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓ <span className="text-xs text-gray-500">(Coming Soon)</span></td>
              </tr>
              {/* <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">Priority generation speed</td>
                <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td>
                <td className="px-4 py-3 text-center text-slate-400 font-bold bg-blue-50">✗</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr> */}
              <tr className="border-b border-slate-200">
                <td className="px-4 py-3 text-sm text-slate-900">WhatsApp support</td>
                <td className="px-4 py-3 text-center text-slate-300 font-bold">✗</td>
                <td className="px-4 py-3 text-center text-slate-400 font-bold bg-blue-50">✗</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h2 className="font-heading text-2xl font-bold text-center text-slate-900 mb-2">Common questions</h2>
        <p className="text-center text-sm text-slate-600 mb-8">Everything you need to know before upgrading</p>

        <div className="space-y-0 divide-y divide-slate-200">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="flex w-full items-start justify-between gap-3 rounded-lg p-0 text-left hover:text-blue-600 transition-colors"
              >
                <span className="font-semibold text-slate-900">{faq.q}</span>
                <span className={`mt-1 flex-shrink-0 transition-transform ${
                  openFaqIndex === idx ? "rotate-45" : ""
                }`}>
                  +
                </span>
              </button>
              {openFaqIndex === idx && (
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs text-slate-600 mb-4">
            © 2026 ClientPitcher · Made in Pakistan 🇵🇰 · Built for freelancers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <a href="/privacy" className="hover:text-slate-900">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-slate-900">
              Terms of Service
            </a>
            <a href="mailto:supportclientpitcher@gmail.com" className="hover:text-slate-900">
              Contact Us
            </a>
            <a href="/" className="hover:text-slate-900">
              Back to Home
            </a>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-600"
            >
              ×
            </button>

            <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
              Upgrade to{" "}
              {PLANS.find((p) => p.id === selectedPlan)?.name}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Send payment to any method below, then WhatsApp us the screenshot. Your account will be activated
              within 2 hours.
            </p>

            {(() => {
              const plan = PLANS.find((p) => p.id === selectedPlan);
              const pkr = getPkrPrice(plan?.usdPrice || 5);
              return (
                <>
                  <div className="mb-6 rounded-lg bg-slate-900 p-4 text-center text-white">
                    <div className="font-heading text-3xl font-bold">{pkr.toLocaleString()} PKR</div>
                    <div className="text-xs text-slate-300 mt-1">
                      = ${(plan?.usdPrice || 5) * (isAnnual ? 10 : 1)} USD · Rate updates
                      daily
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                    {[
                      { name: "JazzCash", num: "0327 8878946" },
                      { name: "Sadapay", num: "03021496945" },
                      { name: "Bank (Meezan)", num: "02140108946578" },
                      // { name: "Raast", num: "090078601" },
                    ].map((method) => (
                      <div
                        key={method.name}
                        className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-semibold text-slate-600 mb-1">{method.name}</div>
                        <div className="font-mono font-bold text-slate-900">{method.num}</div>
                        <div className="text-xs text-slate-500">Receiver: <span className="font-medium text-slate-700">ClientPitcher (Abrar)</span></div>
                        <div className="text-xs text-slate-500 mt-1">
                          {pkr.toLocaleString()} PKR
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    // onClick={() => window.open("https://wa.me/923021496945", "_blank")}
                    onClick={() => {
                      const message = `Hi, I have completed the payment.\nEmail: ${userEmail}\nPlease find the screenshot attached.`;
                      const url = `https://wa.me/923706500702?text=${encodeURIComponent(message)}`;
                      window.open(url, "_blank");
                    }}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-3"
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Send Screenshot on WhatsApp
                  </button>

                  <p className="text-center text-xs text-slate-600">
                    Online 9am–11pm PKT · Usually activated within 2 hours
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
