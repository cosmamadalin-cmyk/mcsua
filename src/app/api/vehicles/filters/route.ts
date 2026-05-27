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
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Filters API error:", response.status);
      return NextResponse.json(
        { error: `error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Log top-level keys to help debug structure
    console.log("Filters API top-level keys:", Object.keys(data));
    if (data?.data) console.log("data.data keys:", Object.keys(data.data));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json({ error: "Nu s-au putut incarca filtrele" }, { status: 500 });
  }
}
