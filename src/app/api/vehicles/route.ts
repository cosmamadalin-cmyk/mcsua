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

  // auction_type: 0=All, 1=Copart, 2=IAAI (integer)
  const auctionTypeRaw = searchParams.get("auction_type") || "";
  if (auctionTypeRaw === "1") params.set("auction_type", "1");
  else if (auctionTypeRaw === "2") params.set("auction_type", "2");

  // Filtre standard
  if (searchParams.get("make")) params.set("make", searchParams.get("make")!);
  if (searchParams.get("model")) params.set("model", searchParams.get("model")!);
  if (searchParams.get("year_from")) params.set("year_from", searchParams.get("year_from")!);
  if (searchParams.get("year_to")) params.set("year_to", searchParams.get("year_to")!);
  if (searchParams.get("price_min")) params.set("price_min", searchParams.get("price_min")!);
  if (searchParams.get("price_max")) params.set("price_max", searchParams.get("price_max")!);
  if (searchParams.get("odometer_from")) params.set("odometer_from", searchParams.get("odometer_from")!);
  if (searchParams.get("odometer_to")) params.set("odometer_to", searchParams.get("odometer_to")!);
  if (searchParams.get("type")) params.set("type", searchParams.get("type")!);

  // Cursor pagination
  if (searchParams.get("cursor")) params.set("cursor", searchParams.get("cursor")!);

  // Filtre avansate (scalare)
  if (searchParams.get("has_key")) params.set("has_key", searchParams.get("has_key")!);
  if (searchParams.get("run_cond")) params.set("run_cond", searchParams.get("run_cond")!);
  if (searchParams.get("loc_state")) params.set("loc_state", searchParams.get("loc_state")!);
  if (searchParams.get("today_only")) params.set("today_only", searchParams.get("today_only")!);
  // sale_document_type: "clean" | "salvage" | "rebuilt" etc.
  if (searchParams.get("sale_document_type")) params.set("sale_document_type", searchParams.get("sale_document_type")!);

  // Filtre array — Apibara cere sintaxa fuel_type[]=Gasoline
  // Frontend trimite fuel_type[]=Gasoline (unul sau mai multe valori)
  const arrayParams = ["fuel_type", "transmission", "drive_type", "color", "damage", "cylinders"];
  for (const key of arrayParams) {
    const values = searchParams.getAll(`${key}[]`);
    for (const v of values) {
      params.append(`${key}[]`, v);
    }
    // suportă și format simplu fără []
    const single = searchParams.get(key);
    if (single && values.length === 0) params.append(`${key}[]`, single);
  }

  try {
    const response = await fetch(`${BASE_URL}/vehicles?${params.toString()}`, {
      headers: {
        "X-API-Key": APIBARA_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
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
