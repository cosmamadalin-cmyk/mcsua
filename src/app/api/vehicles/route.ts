import { NextRequest, NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const yearFrom = searchParams.get("year_from");
    const yearTo = searchParams.get("year_to");
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    const auctionType = searchParams.get("auction_type");

    if (!APIBARA_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build query params for Apibara API
    const params = new URLSearchParams();
    if (make) params.append("make", make);
    if (model) params.append("model", model);
    if (yearFrom) params.append("year_from", yearFrom);
    if (yearTo) params.append("year_to", yearTo);
    if (priceMin) params.append("price_min", priceMin);
    if (priceMax) params.append("price_max", priceMax);
    if (auctionType) params.append("auction_type", auctionType);

    const response = await fetch(
      `https://apibara.tech/api/v1/vehicles?${params.toString()}`,
      {
        headers: {
          "X-API-Key": APIBARA_KEY,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch vehicles" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
