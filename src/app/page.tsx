export default function Home() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="font-bold text-slate-900">ClientPitcher</div>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="/pricing"
              className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:px-3"
            >
              Pricing
            </a>
            {/* <a
              href="/login"
              className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:px-3"
            >
              Login
            </a> */}
            <a
              href="/signup"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start Free
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              One paste. One click. One copy.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              An AI outreach toolkit for Pakistani freelancers: Upwork proposals,
              LinkedIn messages, and cold emails — built for speed
              and compliance.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-slate-800 sm:w-auto"
              >
                Start Free
              </a>
              <a
                href="/pricing"
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-900 hover:bg-slate-50 sm:w-auto"
              >
                See pricing
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm font-semibold text-slate-600">How it works</div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Paste:</span> Job
                post or prospect details.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Generate:</span>{" "}
                Output appears in the same view.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Copy:</span> One
                click copies the full text.
              </li>
            </ol>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#b6ffab] bg-[#e6ffe2] p-4">
                <div className="text-sm font-bold text-slate-900">Upwork</div>
                <div className="mt-1 text-xs text-slate-600">
                  150–220 words, plain text.
                </div>
              </div>
              <div className="rounded-2xl border border-[#BFDBFE] bg-[#EBF5FF] p-4">
                <div className="text-sm font-bold text-slate-900">LinkedIn</div>
                <div className="mt-1 text-xs text-slate-600">
                  InMail + Connection Note.
                </div>
              </div>
              <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 sm:col-span-2">
                <div className="text-sm font-bold text-slate-900">Cold Email</div>
                <div className="mt-1 text-xs text-slate-600">
                  3 subjects + body + PS + checklist.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Before vs After
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Move from slow manual writing to consistent, high-quality outreach.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Before</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Writing outreach from scratch, overthinking every line, and losing
                opportunities because follow-ups get delayed.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">After</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fast, compliant drafts in seconds. Copy, personalize, and send with
                confidence across Upwork, LinkedIn, and cold email.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Features
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built for practical outreach workflows and quick execution.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">3 Core Tools</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upwork Proposal, LinkedIn InMail, and Cold Email in
                one place.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Smart Defaults</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Optional fields are pre-selected and remembered to minimize repeated
                input.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Usage + Upgrade Flow</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Free users get 5 generations/month. Upgrade path is clear and simple.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16" id="pricing">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Pricing
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start free, then upgrade when you need unlimited generation.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Free</div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">0 PKR</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                5 generations per month. Access all core tools.
              </p>
              <a
                href="/signup"
                className="mt-5 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[15px] font-semibold text-slate-900 hover:bg-slate-50"
              >
                Start Free
              </a>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900">Pro</div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">
                ~PKR equivalent of $1.50
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Unlimited proposals, DMs, and emails with the same simple workflow.
              </p>
              <a
                href="/signup"
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-slate-800"
              >
                Start Free
              </a>
            </div>
          </div>
          <div className="mt-6">
            <a
              href="/pricing"
              className="text-sm font-semibold text-slate-700 underline hover:text-slate-900"
            >
              View full pricing details
            </a>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Ready to speed up your outreach?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Start with the free plan and generate your first proposal, InMail, or cold
            email in minutes.
          </p>
          <a
            href="/signup"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Start Free
          </a>
        </section>

        <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-600">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} ClientPitcher</div>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-slate-900">
                Privacy
              </a>
              <a href="/terms" className="hover:text-slate-900">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
