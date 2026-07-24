import { NextRequest, NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";
const BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

function priceOf(v: any): number {
  const p = v?.pricing || {};
  return Number(p.sale_price_usd ?? p.current_bid_usd ?? p.buy_now_usd ?? 0);
}

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make") || "";
  const model = req.nextUrl.searchParams.get("model") || "";
  if (!make) return NextResponse.json({ available: false });

  try {
    const p = new URLSearchParams();
    p.set("make", make);
    if (model) p.set("model", model);
    p.set("lot_sub_status", "Ended");
    p.set("per_page", "20");

    const res = await fetch(`${BASE_URL}/vehicles?${p.toString()}`, {
      headers: { "X-API-Key": APIBARA_KEY, "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ available: false }, { status: res.status });

    const json = await res.json();
    const list: any[] = json.data || [];
    const prices = list.map(priceOf).filter((n: number) => n >= 500);

    if (prices.length === 0) return NextResponse.json({ available: false });

    return NextResponse.json({
      available: true,
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length),
      count: prices.length,
    });
  } catch {
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
