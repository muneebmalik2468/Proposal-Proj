"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const TOOLS = [
  {
    icon: "📋",
    name: "Upwork Proposal Writer",
    desc: "Paste the job post. Get a specific, human-sounding proposal in 10 seconds. Three styles: Problem Mirror, Proof Closer, Diagnostic Hook.",
    stat: "200 credits/mo on Pro",
    color: "green",
  },
  {
    icon: "💼",
    name: "LinkedIn InMail Writer",
    desc: "Personalised InMail with subject line. Under 160 words. Feels like research, not a template. Gets replies from people who ignore everyone else.",
    stat: "Included in Pro",
    color: "blue",
  },
  {
    icon: "🤝",
    name: "LinkedIn Connection Note",
    desc: "300-character limit. One idea. One ask. Live character counter so you never go over. Gets accepted instead of ignored.",
    stat: "Included in Pro",
    color: "blue",
  },
  {
    icon: "✉️",
    name: "Cold Email Generator",
    desc: "3 subject line options + full email body. Anti-spam rules built in. Deliverability checklist included. Plain text output that reaches the inbox.",
    stat: "Included in Pro",
    color: "red",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "I was sending 30 proposals a week and getting 1 reply. After using ClientPitcher for 2 weeks my reply rate jumped to 7 out of 30. That's a WordPress project worth $400 I would have missed.",
    name: "Bilal Khan",
    role: "WordPress Developer · Lahore",
    initials: "BK",
    bgColor: "bg-green-600",
  },
  {
    stars: 5,
    text: "The LinkedIn InMail tool got me a client from Germany. I sent 10 InMails using the Value Sniper style. 4 replied. 1 turned into a $600 project. The tool paid for itself 120 times over in one month.",
    name: "Sara Raza",
    role: "Graphic Designer · Karachi",
    initials: "SR",
    bgColor: "bg-blue-600",
  },
  {
    stars: 5,
    text: "I was paying 4,000 PKR for another platform and getting Upwork proposals only. ClientPitcher gives me proposals, LinkedIn, and cold email for 1,400 PKR. Switched immediately and never looked back.",
    name: "Usman Ahmed",
    role: "SEO Specialist · Islamabad",
    initials: "UA",
    bgColor: "bg-red-600",
  },
];

export default function HomePageClient() {
  const [proposals, setProposals] = useState(30);
  const [jobVal, setJobVal] = useState(300);
  const [winRate, setWinRate] = useState(5);
  const [improve, setImprove] = useState(15);

  // Calculate ROI
  const currentWins = proposals * (winRate / 100);
  const newWinRate = Math.min(winRate + improve, 100);

  const newWins = proposals * (newWinRate / 100);
  const extraJobs = newWins - currentWins;

  const extraIncome = Math.round(extraJobs * jobVal);

  const cost = 5;
  const netGain = extraIncome - cost;

  // More realistic ROI calculation
  const realisticCost = cost + 50;

  const roiRaw = (netGain / realisticCost) * 100;

  const roi = Math.min(Math.round(roiRaw), 1000);
  const displayROI = roiRaw > 1000 ? "1000%+" : `${roi}%`;
  // const currentWins = proposals * (winRate / 100);
  // const newWinRate = winRate + improve;
  // const newWins = proposals * (newWinRate / 100);
  // const extraJobs = newWins - currentWins;
  // const extraIncome = Math.round(extraJobs * jobVal);
  // const cost = 5;
  // const roi = Math.round((extraIncome / cost) * 100);
  // const netGain = extraIncome - cost;

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            {/* Mobile logo */}
            <Image
              src="/mobilehomelogo.png"
              alt="ClientPitcher"
              width={80}
              height={40}
              className="md:hidden"
              priority
            />
            {/* Desktop logo */}
            <Image
              src="/desktophomelogo.png"
              alt="ClientPitcher"
              width={180}
              height={140}
              className="hidden md:block"
              priority
            />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#pricing"
              className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:px-3"
            >
              Pricing
            </a>
            <a
              href="/login"
              className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:px-3"
            >
              Log In
            </a>
            <Link
              href="/signup"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-4 py-16 sm:px-6 sm:py-24">
        {/* Background glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 shadow-sm text-center">
            <span className="inline-block h-2 w-2 rounded-full bg-green-600 animate-pulse" />
            
            <span>
              1,400 PKR/month
            </span>

            <span className="hidden sm:inline">·</span>

            <span className="w-full sm:w-auto">
              3× cheaper than other platforms
            </span>
          </div>

          {/* Hero heading */}
          <h1 className="font-heading text-4xl font-bold text-slate-900 sm:text-5xl leading-tight mb-4">
            Turn Every Job Post Into <br />
            a <span className="text-blue-600">Winning Proposal</span>
            <br /> in <span className="text-green-600">10 Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg text-slate-600 mb-3 leading-relaxed">
            Pakistani freelancers earning $300–$2,000/month, use ClientPitcher to write better
            proposals, LinkedIn messages, and cold emails — without spending hours on each
            one.
          </p>

          <p className="text-sm text-slate-500 mb-8">
            Costs less than a double patty burger per month. No dollar card required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-heading font-bold text-white hover:bg-green-700 shadow-md transition-all"
            >
              Start Free — 5 Proposals on Us
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 font-heading font-bold text-slate-900 hover:bg-slate-50 transition-all"
            >
              See How It Works ↓
            </a>
          </div>

          {/* Social proof */}
          <div className="text-sm text-slate-600">
            <span className="text-lg font-bold">
                <span className="text-yellow-400">★★★★★</span>{" "}
                <span className="text-slate-900">4.9/5</span>
            </span>
            <span> · Trusted by Pakistani freelancers · Pay in PKR</span>
          </div>
        </div>
      </section>

      {/* Money Ticker */}
      <section className="bg-slate-900 px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-7xl">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                
                {/* Item */}
                <div className="flex flex-col items-center gap-1">
                    <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    $300–$2,000
                    </div>
                    <p className="text-sm text-slate-300">
                    Avg monthly earnings for Upwork freelancers
                    </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    $5/mo
                    </div>
                    <p className="text-sm text-slate-300">
                    What Pro costs you
                    </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div className="font-heading text-2xl sm:text-3xl font-bold text-green-400">
                    3,900%
                    </div>
                    <p className="text-sm text-slate-300">
                    Min ROI if you win 1 job
                    </p>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    10 sec
                    </div>
                    <p className="text-sm text-slate-300">
                    Avg generation time
                    </p>
                </div>

                </div>

            </div>
        </section>
      {/* <section className="bg-slate-900 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 overflow-x-auto">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="font-heading text-2xl font-bold text-white">$300–$2,000</div>
              <p className="text-sm text-slate-300">Avg monthly earnings for Upwork freelancers</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="font-heading text-2xl font-bold text-white">$5/mo</div>
              <p className="text-sm text-slate-300">What Pro costs you</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="font-heading text-2xl font-bold text-green-400">3,900%</div>
              <p className="text-sm text-slate-300">Min ROI if you win 1 job</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-700" />
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="font-heading text-2xl font-bold text-white">10 sec</div>
              <p className="text-sm text-slate-300">Avg generation time</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* ROI Calculator Section */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700 mb-4">
              ROI Calculator
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">
              See exactly how much ClientPitcher pays for itself
            </h2>
            <p className="text-slate-600">
              Move the sliders. See your real numbers. This is why 1,400 PKR/month is the
              best investment a Pakistani freelancer can make.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 mb-6">
            <div className="font-heading text-lg font-bold text-slate-900 mb-6">
              Calculate your return on investment
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              {/* Proposals Slider */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-3">
                  Proposals per month
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={proposals}
                  onChange={(e) => setProposals(parseInt(e.target.value))}
                  step="5"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="font-heading text-2xl font-bold text-blue-600 mt-2">
                  {proposals} proposals/month
                </div>
              </div>

              {/* Job Value Slider */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-3">
                  Your average job value
                </label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  value={jobVal}
                  onChange={(e) => setJobVal(parseInt(e.target.value))}
                  step="50"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="font-heading text-2xl font-bold text-blue-600 mt-2">
                  ${jobVal} per job
                </div>
              </div>

              {/* Win Rate Slider */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-3">
                  Current win rate
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={winRate}
                  onChange={(e) => setWinRate(parseInt(e.target.value))}
                  step="1"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="font-heading text-2xl font-bold text-blue-600 mt-2">
                  {winRate}% win rate
                </div>
              </div>

              {/* Improvement Slider */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-3">
                  Expected improvement
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={improve}
                  onChange={(e) => setImprove(parseInt(e.target.value))}
                  step="5"
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="font-heading text-2xl font-bold text-blue-600 mt-2">
                  +{improve}% improvement
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-lg bg-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-sm text-slate-300 mb-2">Extra income per month</p>
                <div className="font-heading text-3xl font-bold text-white mb-2">
                  +${extraIncome.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400">
                  Monthly cost: ~1,400 PKR (~$5) · Net gain: ${netGain.toLocaleString()}/month
                </p>
              </div>
              <div className="text-right">
                <div className="font-heading text-4xl font-bold text-green-400 leading-none">
                  {displayROI.toLocaleString()}
                </div>
                <p className="text-sm text-slate-300 mt-2">Return on investment</p>
              </div>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div>
            <h3 className="font-heading text-xl font-bold text-slate-900 mb-6">
              This is the difference between getting ignored and getting hired
            </h3>

            <div className="grid gap-4 md:gap-6 md:grid-cols-3 md:items-center">
              {/* Before Card */}
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
                <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 mb-4">
                  ❌ What Clients Get 100× Daily
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "Dear Hiring Manager, I am writing to express my interest in this project. I am a passionate and highly skilled developer with 5 years of experience. I am the perfect fit for your requirements and would love to work with you. Please consider my application. Looking forward to hearing from you."
                </p>
                <p className="text-xs text-red-600 font-bold mt-4">
                  → Deleted in 2 seconds. Never replied to.
                </p>
              </div>

              {/* VS */}
              <div className="text-center font-heading text-lg font-bold text-slate-400">VS</div>

              {/* After Card */}
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 mb-4">
                  ✓ What ClientPitcher Writes
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "That payment bug you described — I fixed this exact race condition in WooCommerce twice last month. Both times it came down to the webhook firing before the order status updated. I'd start by logging the webhook payload to isolate whether it's timing or data. My last fix like this took 2 hours including testing. Want me to send the specific code snippet I use before you decide?"
                </p>
                <p className="text-xs text-green-700 font-bold mt-4">
                  → Client replied within 40 minutes. Job awarded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700 mb-4">
              4 Tools. 1 Subscription.
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">
              Everything you need to land more clients
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Other Platforms gives you 1 tool for $10–15/month. ClientPitcher gives you 4
              tools for $5/month.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map((tool, idx) => {
              const colorMap = {
                green: "border-green-200 hover:border-green-400",
                blue: "border-blue-200 hover:border-blue-400",
                red: "border-red-200 hover:border-red-400",
              };
              const bgMap = {
                green: "bg-green-50",
                blue: "bg-blue-50",
                red: "bg-red-50",
              };
              const textMap = {
                green: "text-green-700",
                blue: "text-blue-700",
                red: "text-red-700",
              };

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border ${colorMap[tool.color as keyof typeof colorMap]} bg-white p-6 transition-all hover:shadow-md`}
                >
                  <div className={`text-3xl mb-4`}>{tool.icon}</div>
                  <h3 className="font-heading text-base font-bold text-slate-900 mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{tool.desc}</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${bgMap[tool.color as keyof typeof bgMap]} ${textMap[tool.color as keyof typeof textMap]}`}
                  >
                    {tool.stat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-16 sm:px-6 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700 mb-4">
              How It Works
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">
              Three steps. Ten seconds. Done.
            </h2>
            <p className="text-slate-600">No learning curve. No settings to configure. Just paste, click, copy.</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="relative">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-900 text-white font-heading font-bold mb-6">
                1
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-3">
                Paste The Job Post
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Copy the full Upwork job description and paste it in. The AI reads every
                detail — your proposal will reference the client's exact words.
              </p>
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Takes 5 seconds
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-900 text-white font-heading font-bold mb-6">
                2
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-3">
                Click Generate
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                One click. The AI applies your chosen style and tone. You see a skeleton
                loader for a few seconds then your full proposal appears.
              </p>
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Takes 10 seconds
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-900 text-white font-heading font-bold mb-6">
                3
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-3">
                Copy and Send
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                One click copies the full text. Paste directly into Upwork. If it's not
                perfect, hit Regenerate — no refilling any fields.
              </p>
              <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Takes 2 seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VS Competitor Section */}
      <section className="bg-slate-900 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-3">
            Why Pakistani freelancers are switching from Other Platforms
          </h2>
          <p className="text-center text-slate-300 mb-12">
            Same goal. Half the price. 4× the tools. The choice is obvious.
          </p>

          <div className="grid gap-6 md:grid-cols-3 md:items-center mb-8">
            {/* LevelUpUpwork */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
              <div className="text-xs font-bold uppercase text-slate-400 mb-2">Other Platforms</div>
              <div className="font-heading text-3xl font-bold text-slate-300 mb-4">
                $10–15<span className="text-base font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-green-400">✓</span> Upwork proposals
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">✗</span> LinkedIn InMail
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">✗</span> Connection notes
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">✗</span> Cold email tool
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">✗</span> Conversion tracker
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">✗</span> PKR pricing
                </li>
              </ul>
              <p className="text-xs text-slate-500">Paid 4,200 PKR/mo for 1 tool</p>
            </div>

            {/* VS Badge */}
            <div className="text-center font-heading text-lg font-bold text-slate-500">VS</div>

            {/* ClientPitcher */}
            <div className="rounded-lg border-2 border-blue-500 bg-blue-500/10 p-6">
              <div className="text-xs font-bold uppercase text-slate-200 mb-2">ClientPitcher Pro</div>
              <div className="font-heading text-3xl font-bold text-white mb-4">
                $5<span className="text-base font-normal">/mo</span>
              </div>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> Upwork proposals (200 credits)
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> LinkedIn InMail tool
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> Connection notes tool
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> Cold email generator
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> Conversion tracker
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-100">
                  <span className="text-green-400">✓</span> PKR pricing via JazzCash
                </li>
              </ul>
              <p className="text-xs text-slate-400">Pay 1,400 PKR/mo for 4 tools</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-heading font-bold text-white hover:bg-blue-700 transition-all"
            >
              Switch to ClientPitcher — Save 2,800 PKR/Month →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700 mb-4">
              Real Results
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">
              Pakistani freelancers who stopped losing jobs
            </h2>
            <p className="text-slate-600">Real feedback from real users. No paid reviews.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testi, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-lg font-bold text-amber-400 mb-3">
                  {"★".repeat(testi.stars)}
                </div>
                <p className="text-sm text-slate-600 italic mb-6 leading-relaxed">{testi.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center h-9 w-9 rounded-full text-white text-xs font-bold flex-shrink-0 ${testi.bgColor}`}
                  >
                    {testi.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{testi.name}</div>
                    <div className="text-xs text-slate-600">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase text-blue-700 mb-4">
              Simple Pricing
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-3">
              Start free. Upgrade when you're ready.
            </h2>
            <p className="text-slate-600">
              All plans in PKR. JazzCash, Easypaisa, or bank transfer. No credit card ever.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto mb-8">
            {/* Basic */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="text-xs font-bold uppercase text-slate-500 mb-2">Basic</div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Basic</h3>
              <div className="font-heading text-3xl font-bold text-slate-900 mb-1">$2</div>
              <p className="text-xs text-slate-500 font-mono mb-4">≈ 560 PKR / month</p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> Upwork proposals
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  {/* <span className="text-slate-300 font-bold">✗</span> No LinkedIn tools */}
                  <span className="text-green-600 font-bold">✓</span> LinkedIn tools
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  {/* <span className="text-slate-300 font-bold">✗</span> No cold email */}
                  <span className="text-green-600 font-bold">✓</span> Cold email
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> 15 credits/month
                </div>
              </div>
              <Link
                href="/signup"
                className="w-full block text-center rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Get Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-xl border-2 border-blue-600 bg-white p-6 relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                ★ Most Popular
              </div>
              <div className="text-xs font-bold uppercase text-blue-700 mb-2">Pro</div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="font-heading text-3xl font-bold text-blue-600 mb-1">$5</div>
              <p className="text-xs text-slate-500 font-mono mb-4">≈ 1,400 PKR / month</p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> All 4 tools
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> 200 credits/month
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> Conversion tracker
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-green-600 font-bold">✓</span> History (last 30)
                </div>
              </div>
              <Link
                href="/signup"
                className="w-full block text-center rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Pro Max */}
            <div className="rounded-xl border border-slate-900 bg-slate-900 text-white p-6 hover:shadow-lg transition-shadow">
              <div className="text-xs font-bold uppercase text-slate-400 mb-2">Pro Max</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">Pro Max</h3>
              <div className="font-heading text-3xl font-bold text-white mb-1">$10</div>
              <p className="text-xs text-slate-400 font-mono mb-4">≈ 2,800 PKR / month</p>
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-green-400 font-bold">✓</span> Unlimited credits ∞
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-green-400 font-bold">✓</span> Analytics dashboard
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-green-400 font-bold">✓</span> Priority speed
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-green-400 font-bold">✓</span> WhatsApp support
                </div>
              </div>
              <Link
                href="/signup"
                className="w-full block text-center rounded-lg bg-white text-slate-900 px-4 py-2 font-semibold hover:opacity-90 transition-opacity"
              >
                Get Pro Max
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              View full pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-900 px-4 py-16 sm:px-6 sm:py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Every day without ClientPitcher is money left on the table
          </h2>
          <p className="text-slate-300 mb-8">
            A Pakistani freelancer earning $300/month who improves their win rate by just 1
            job makes back the annual cost of Pro Max in their first week.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-4 font-heading font-bold text-white hover:bg-green-700 shadow-lg transition-all"
          >
            Start Free — 5 Proposals on Us
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            No credit card · Pay in PKR · Activate in 2 hours after payment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs text-slate-600 mb-4">
            © 2026 ClientPitcher · Made in Pakistan 🇵🇰 · Built for freelancers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900">
              Terms of Service
            </Link>
            <a href="mailto:supportclientpitcher@gmail.com" className="hover:text-slate-900">
              Contact Us
            </a>
            <Link href="/" className="hover:text-slate-900">
              Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
