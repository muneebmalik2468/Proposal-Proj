import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PAYMENTS } from "@/lib/payments.config";
import { pkrMonthlyPriceFromRate, PRO_PRICE_USD } from "@/lib/pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

export default async function UpgradePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const pkrPerUsd = await getPkrPerUsd();
  const amountPkr = pkrMonthlyPriceFromRate(pkrPerUsd);

  const waText = `Hi! I just paid for ClientPitcher Pro.\nMy email is: ${email}`;
  const waHref = `https://wa.me/${PAYMENTS.whatsappNumberE164}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Upgrade to Pro
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Pay in PKR — no card needed. Activates within 2 hours.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="text-sm font-semibold text-slate-600">Pro</div>
          <div className="mt-2 text-4xl font-extrabold text-slate-900">
            {amountPkr} PKR
            <span className="ml-2 text-base font-semibold text-slate-600">
              / month
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Equal to ${PRO_PRICE_USD.toFixed(2)} USD · Rate updates daily
          </div>
          <div className="mt-3 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Unlimited proposals, DMs & emails · No ads · Cancel anytime
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="border border-[#14A800]/40 p-5">
          <div className="text-sm font-bold text-slate-900">JazzCash</div>
          <div className="mt-2 font-mono text-sm text-slate-800">
            {PAYMENTS.jazzCashNumber}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Send exactly <span className="font-semibold">{amountPkr} PKR</span>{" "}
            to this number
          </div>
        </Card>

        <Card className="border border-[#0A66C2]/40 p-5">
          <div className="text-sm font-bold text-slate-900">Easypaisa</div>
          <div className="mt-2 font-mono text-sm text-slate-800">
            {PAYMENTS.easyPaisaNumber}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Send exactly <span className="font-semibold">{amountPkr} PKR</span>{" "}
            to this number
          </div>
        </Card>

        <Card className="border border-purple-300 p-5">
          <div className="text-sm font-bold text-slate-900">Bank Transfer</div>
          <div className="mt-2 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Bank Name:</span>{" "}
              {PAYMENTS.bank.bankName}
            </div>
            <div>
              <span className="font-semibold">Account Title:</span>{" "}
              {PAYMENTS.bank.accountTitle}
            </div>
            <div>
              <span className="font-semibold">Account Number:</span>{" "}
              {PAYMENTS.bank.accountNumber}
            </div>
            <div>
              <span className="font-semibold">IBAN:</span> {PAYMENTS.bank.iban}
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Use your email as reference
          </div>
        </Card>

        <Card className="border border-amber-300 p-5">
          <div className="text-sm font-bold text-slate-900">Raast</div>
          <div className="mt-2 font-mono text-sm text-slate-800">
            {PAYMENTS.raastId}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Send via your bank app using Raast / Easy Loop
          </div>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600">
          After sending, WhatsApp your screenshot to{" "}
          <span className="font-semibold">
            +{PAYMENTS.whatsappNumberE164}
          </span>
        </p>
        <div className="mt-3 flex justify-center">
          <a href={waHref} target="_blank" rel="noopener noreferrer">
            <Button zone="navy">Send Payment Screenshot</Button>
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5">
        <div className="text-sm font-bold text-slate-900">Timeline</div>
        <div className="mt-2 text-sm text-slate-600">
          Your account will be upgraded within 2 hours.
          <br />
          Usually faster. We are online 9am–11pm Pakistan time.
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <details className="rounded-xl border border-slate-100 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">
            What if I paid but my account is not upgraded?
          </summary>
          <div className="mt-2 text-sm text-slate-600">
            WhatsApp us the screenshot. We will fix it immediately.
          </div>
        </details>
        <details className="rounded-xl border border-slate-100 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">
            Can I cancel anytime?
          </summary>
          <div className="mt-2 text-sm text-slate-600">
            Yes. WhatsApp us and we will stop the next renewal.
          </div>
        </details>
        <details className="rounded-xl border border-slate-100 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-900">
            Is monthly or yearly available?
          </summary>
          <div className="mt-2 text-sm text-slate-600">
            Monthly for now. Yearly plan coming soon with 2 months free.
          </div>
        </details>
      </div>
    </div>
  );
}

