import { pkrMonthlyPriceFromRate, PRO_PRICE_USD } from "@/lib/pricing";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { headers } from "next/headers";

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

export default async function PricingPage() {
  const pkrPerUsd = await getPkrPerUsd();
  const pkrMonthly = pkrMonthlyPriceFromRate(pkrPerUsd);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Pricing
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Pay in PKR — no card needed. Activates within 2 hours.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900">Free</h2>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">0 PKR</div>
          <p className="mt-2 text-sm text-slate-600">5 generations / month</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-900">Pro</h2>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {pkrMonthly} PKR{" "}
            <span className="text-base font-semibold text-slate-600">
              / month
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Equal to ${PRO_PRICE_USD.toFixed(2)} USD · Rate updates daily
          </p>
          <div className="mt-5">
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Upgrade to Pro
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

