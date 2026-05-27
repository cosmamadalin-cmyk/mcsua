import { NextRequest, NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";
const BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  // Search: VIN, lot number, title keyword
  const s = searchParams.get("search") || searchParams.get("s");
  if (s) params.set("s", s);

  // Pagination
  const perPage = Math.min(Number(searchParams.get("per_page") || 12), 20);
  params.set("per_page", String(perPage));
  if (searchParams.get("cursor")) params.set("cursor", searchParams.get("cursor")!);

  // Lot status & sub-status
  if (searchParams.get("lot_status")) params.set("lot_status", searchParams.get("lot_status")!);
  params.set("lot_sub_status", searchParams.get("lot_sub_status") || "Open");

  // Platform: 0=All, 1=Copart, 2=IAAI
  const auctionTypeRaw = searchParams.get("auction_type") || "";
  if (auctionTypeRaw === "1") params.set("auction_type", "1");
  else if (auctionTypeRaw === "2") params.set("auction_type", "2");

  // Vehicle identity
  if (searchParams.get("make")) params.set("make", searchParams.get("make")!);
  if (searchParams.get("model")) params.set("model", searchParams.get("model")!);
  if (searchParams.get("type")) params.set("type", searchParams.get("type")!);

  // Year
  if (searchParams.get("year_from")) params.set("year_from", searchParams.get("year_from")!);
  if (searchParams.get("year_to")) params.set("year_to", searchParams.get("year_to")!);

  // Price
  if (searchParams.get("price_min")) params.set("price_min", searchParams.get("price_min")!);
  if (searchParams.get("price_max")) params.set("price_max", searchParams.get("price_max")!);

  // Odometer
  if (searchParams.get("odometer_from")) params.set("odometer_from", searchParams.get("odometer_from")!);
  if (searchParams.get("odometer_to")) params.set("odometer_to", searchParams.get("odometer_to")!);

  // Engine
  if (searchParams.get("engine_size_from")) params.set("engine_size_from", searchParams.get("engine_size_from")!);
  if (searchParams.get("engine_size_to")) params.set("engine_size_to", searchParams.get("engine_size_to")!);
  if (searchParams.get("engine_hp_from")) params.set("engine_hp_from", searchParams.get("engine_hp_from")!);
  if (searchParams.get("engine_hp_to")) params.set("engine_hp_to", searchParams.get("engine_hp_to")!);

  // Simple scalar filters
  if (searchParams.get("has_key")) params.set("has_key", searchParams.get("has_key")!);
  if (searchParams.get("run_cond")) params.set("run_cond", searchParams.get("run_cond")!);
  if (searchParams.get("loc_state")) params.set("loc_state", searchParams.get("loc_state")!);
  if (searchParams.get("today_only")) params.set("today_only", searchParams.get("today_only")!);
  if (searchParams.get("sale_document_type")) params.set("sale_document_type", searchParams.get("sale_document_type")!);
  if (searchParams.get("seller_type")) params.set("seller_type", searchParams.get("seller_type")!);

  // Array filters: fuel_type[], transmission[], drive_type[], color[], damage[], cylinders[]
  const arrayKeys = ["fuel_type", "transmission", "drive_type", "color", "damage", "cylinders"];
  for (const key of arrayKeys) {
    const arr = searchParams.getAll(`${key}[]`);
    for (const v of arr) params.append(`${key}[]`, v);
    // also accept single value without []
    const single = searchParams.get(key);
    if (single && arr.length === 0) params.append(`${key}[]`, single);
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
      console.error(`API ${response.status}:`, body.slice(0, 200));
      return NextResponse.json(
        { error: `error: ${response.status}`, details: body.slice(0, 200) },
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
