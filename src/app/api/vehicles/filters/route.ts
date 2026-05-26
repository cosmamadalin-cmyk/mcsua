import { NextResponse } from "next/server";

const APIBARA_KEY = process.env.APIBARA_API_KEY ?? "";
const BASE_URL = "https://apibara.tech/api/v1/vehicle-auction";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/vehicles/filters`, {
      headers: {
        "X-API-Key": APIBARA_KEY,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // cache 1 ora — lista de marci nu se schimba des
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Apibara filters error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json(
      { error: "Nu s-au putut incarca filtrele" },
      { status: 500 }
    );
  }
}
