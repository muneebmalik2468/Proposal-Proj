let cache: { pkrPerUsd: number | null; fetchedAt: number | null } = {
  pkrPerUsd: null,
  fetchedAt: null,
};

export async function GET() {
  const twelveHoursMs = 12 * 60 * 60 * 1000;
  const now = Date.now();

  if (cache.pkrPerUsd && cache.fetchedAt && now - cache.fetchedAt < twelveHoursMs) {
    return Response.json({ pkrPerUsd: cache.pkrPerUsd });
  }

  try {
    const r = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
    });
    const d = (await r.json()) as { rates?: Record<string, number> };
    const pkr = d?.rates?.PKR;

    if (typeof pkr === "number" && Number.isFinite(pkr)) {
      cache = { pkrPerUsd: Math.round(pkr), fetchedAt: now };
      return Response.json({ pkrPerUsd: cache.pkrPerUsd });
    }
  } catch {
    // fall through to fallback response below
  }

  return Response.json({ pkrPerUsd: cache.pkrPerUsd ?? 280 }); // fallback USD->PKR rate
}

