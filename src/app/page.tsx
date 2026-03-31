export default function Home() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="font-semibold text-slate-900">APPNAME</div>
          <nav className="flex items-center gap-2">
            <a
              href="/pricing"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Pricing
            </a>
            <a
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign up
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
              One paste. One click. One copy.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              An AI outreach toolkit for Pakistani freelancers: Upwork proposals,
              LinkedIn messages, connection notes, and cold emails — built for speed
              and compliance.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Get started free
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-900 hover:bg-slate-50"
              >
                See pricing
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <div className="text-sm font-semibold text-slate-600">How it works</div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li>
                <span className="font-semibold text-slate-900">Paste:</span> job
                post or prospect details.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Generate:</span>{" "}
                output appears in the same view.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Copy:</span> one
                click copies the full text.
              </li>
            </ol>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#BBFFB0] bg-[#F0FDF4] p-4">
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

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Before</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Writing outreach from scratch, overthinking, and losing momentum.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">After</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fast, consistent, compliant drafts you can customize in minutes.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-bold text-slate-900">Pricing</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Free: 5 generations/month. Pro: ~PKR equivalent of $1.50/month.
            </p>
          </div>
        </section>

        <footer className="mt-16 border-t border-slate-100 pt-8 text-sm text-slate-600">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} APPNAME</div>
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
