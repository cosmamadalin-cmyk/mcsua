import { NextRequest, NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";
const BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  // s = search (VIN, lot number, title)
  const s = searchParams.get("search") || searchParams.get("s");
  if (s) params.set("s", s);

  // per_page maxim 20 conform docs
  const perPage = Math.min(Number(searchParams.get("per_page") || 12), 20);
  params.set("per_page", String(perPage));

  // lot_sub_status: Open | Live | Ended
  params.set("lot_sub_status", searchParams.get("lot_sub_status") || "Open");

  // auction_type: 0=All, 1=Copart, 2=IAAI
  const auctionTypeRaw = searchParams.get("auction_type") || searchParams.get("platform") || "";
  if (auctionTypeRaw === "copart" || auctionTypeRaw === "1") params.set("auction_type", "1");
  else if (auctionTypeRaw === "iaai" || auctionTypeRaw === "2") params.set("auction_type", "2");

  // Filtre standard
  if (searchParams.get("make")) params.set("make", searchParams.get("make")!);
  if (searchParams.get("model")) params.set("model", searchParams.get("model")!);
  if (searchParams.get("year_from")) params.set("year_from", searchParams.get("year_from")!);
  if (searchParams.get("year_to")) params.set("year_to", searchParams.get("year_to")!);
  if (searchParams.get("price_min")) params.set("price_min", searchParams.get("price_min")!);
  if (searchParams.get("price_max")) params.set("price_max", searchParams.get("price_max")!);
  if (searchParams.get("type")) params.set("type", searchParams.get("type")!);

  // Cursor pagination
  if (searchParams.get("cursor")) params.set("cursor", searchParams.get("cursor")!);

  // Filtre avansate
  if (searchParams.get("has_key")) params.set("has_key", searchParams.get("has_key")!);
  if (searchParams.get("run_cond")) params.set("run_cond", searchParams.get("run_cond")!);
  if (searchParams.get("loc_state")) params.set("loc_state", searchParams.get("loc_state")!);
  if (searchParams.get("today_only")) params.set("today_only", searchParams.get("today_only")!);
  if (searchParams.get("fuel_type")) params.set("fuel_type", searchParams.get("fuel_type")!);
  if (searchParams.get("transmission")) params.set("transmission", searchParams.get("transmission")!);
  if (searchParams.get("title_type")) params.set("title_type", searchParams.get("title_type")!);

  try {
    const response = await fetch(`${BASE_URL}/vehicles?${params.toString()}`, {
      headers: {
        "X-API-Key": APIBARA_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 180 },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Apibara ${response.status}:`, body.slice(0, 200));
      return NextResponse.json(
        { error: `Apibara error: ${response.status}`, details: body.slice(0, 200) },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Vehicles API error:", error);
    return NextResponse.json(
      { error: "Nu s-a putut conecta la API" },
      { status: 500 }
    );
  }
}
