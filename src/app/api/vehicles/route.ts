import { NextRequest, NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";
const BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  // Mapare parametri frontend → apibara (cu numele corecte din documentație)
  // s = search (VIN, lot number, title)
  const s = searchParams.get("search") || searchParams.get("s");
  if (s) params.set("s", s);

  // per_page maxim 20 conform docs
  const perPage = Math.min(Number(searchParams.get("per_page") || 12), 20);
  params.set("per_page", String(perPage));

  // lot_sub_status: Open | Live | Ended (default Open = licitații active)
  params.set("lot_sub_status", searchParams.get("lot_sub_status") || "Open");

  // auction_type: 0=All, 1=Copart, 2=IAAI (INTEGER, nu string)
  const auctionTypeRaw = searchParams.get("auction_type") || searchParams.get("platform") || "";
  if (auctionTypeRaw === "copart" || auctionTypeRaw === "1") params.set("auction_type", "1");
  else if (auctionTypeRaw === "iaai" || auctionTypeRaw === "2") params.set("auction_type", "2");
  // else nu setăm = All

  // Filtre standard
  if (searchParams.get("make")) params.