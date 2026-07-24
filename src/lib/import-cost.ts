// Shared import-cost calculator.
// Used by BOTH the vehicle detail page (CostCalculator) and the chatbot
// (calculate_cost tool) so the numbers are ALWAYS identical.

export type Platform = "copart" | "iaai";

export interface ImportCostVehicle {
  estimatedBid?: number;
  platform: Platform;
  location?: string;
  state?: string;
  fuelType?: string;
  bodyType?: string;
  titleType?: string;
}

export interface ImportCostOptions {
  /** Override the bid price (defaults to vehicle.estimatedBid). */
  bidPrice?: number;
  /** EUR per USD (defaults to 0.92). */
  eurUsdRate?: number;
  /** Defaults to: title contains "salvage". */
  includeSalvageTitle?: boolean;
  /** Defaults to: fuel is hybrid / electric / plug-in. */
  includePortTax?: boolean;
  /** Defaults to false. */
  includeInsurance?: boolean;
  /** Defaults to true. */
  includeRoTransport?: boolean;
  /** Optional representative transport when no state is known. */
  usaTransportOverride?: number;
}

export interface ImportCostResult {
  bidPrice: number;
  eurUsdRate: number;
  platform: Platform;
  // Transport
  transportPort: string;
  usaTransport: number;
  usaTransportAvailable: boolean;
  roTransportCost: number;
  // USA lines
  buyerFee: number;
  portTax: number;
  salvageTitleCost: number;
  exportDocs: number;
  totalUSA: number;
  // CIF
  cifEUR: number;
  // EU lines
  insurance: number;
  customsDuty: number;
  tva: number;
  commissionMCSUA: number;
  portHandling: number;
  roTransport: number;
  totalEU: number;
  // Total
  totalGeneral: number;
  // Resolved toggles
  includeSalvageTitle: boolean;
  includePortTax: boolean;
  includeInsurance: boolean;
  includeRoTransport: boolean;
}

// ── Auction fee calculator ─────────────────────────────────────────────────────
export function auctionFee(bid: number, platform: Platform): number {
  const minFee = 600;
  const pct = platform === "iaai" ? 0.10 : 0.12;
  return bid < 6000 ? minFee : Math.round(bid * pct);
}

// ── Transport info per state ───────────────────────────────────────────────────
export function getTransportInfo(state: string): { port: string; cost: number } {
  // Extrage codul statului din diferite formate:
  // "Atlanta East (GA)" -> GA · "Detroit MI" -> MI · "GA" -> GA
  let s = "";
  const withParens = state.match(/\(([A-Z]{2})\)/);
  if (withParens) {
    s = withParens[1];
  } else {
    const withSpace = state.match(/\s([A-Z]{2})$/);
    if (withSpace) {
      s = withSpace[1];
    } else {
      const trimmed = (state || "").toUpperCase().trim();
      s = trimmed.length === 2 ? trimmed : "";
    }
  }
  const map: Record<string, { port: string; cost: number }> = {
    AL: { port: "Savannah",  cost: 1610 },
    AZ: { port: "Houston",   cost: 2400 },
    AR: { port: "Houston",   cost: 1730 },
    CA: { port: "Houston",   cost: 2400 },
    NC: { port: "Savannah",  cost: 1645 },
    SC: { port: "Savannah",  cost: 1560 },
    CO: { port: "Houston",   cost: 2400 },
    CT: { port: "New York",  cost: 1540 },
    ND: { port: "New York",  cost: 1910 },
    SD: { port: "New York",  cost: 1900 },
    DE: { port: "New York",  cost: 1570 },
    FL: { port: "Florida",   cost: 1580 },
    GA: { port: "Savannah",  cost: 1565 },
    ID: { port: "Houston",   cost: 2570 },
    IL: { port: "New York",  cost: 1765 },
    IN: { port: "New York",  cost: 1675 },
    IA: { port: "Savannah",  cost: 1825 },
    KS: { port: "Houston",   cost: 1765 },
    KY: { port: "Savannah",  cost: 1610 },
    LA: { port: "Houston",   cost: 1650 },
    ME: { port: "New York",  cost: 1675 },
    MD: { port: "New York",  cost: 1575 },
    MA: { port: "New York",  cost: 1590 },
    MI: { port: "New York",  cost: 1630 },
    MN: { port: "New York",  cost: 1840 },
    MS: { port: "Houston",   cost: 1580 },
    MO: { port: "Houston",   cost: 1695 },
    MT: { port: "Houston",   cost: 2565 },
    NE: { port: "Houston",   cost: 1875 },
    NV: { port: "Houston",   cost: 2400 },
    NH: { port: "New York",  cost: 1675 },
    NJ: { port: "New York",  cost: 1570 },
    NM: { port: "Houston",   cost: 1765 },
    NY: { port: "New York",  cost: 1500 },
    OH: { port: "New York",  cost: 1690 },
    OK: { port: "Houston",   cost: 1630 },
    OR: { port: "Houston",   cost: 2640 },
    PA: { port: "New York",  cost: 1650 },
    RI: { port: "New York",  cost: 1590 },
    TX: { port: "Houston",   cost: 1500 },
    TN: { port: "Savannah",  cost: 1650 },
    UT: { port: "Houston",   cost: 2470 },
    VT: { port: "New York",  cost: 1620 },
    VA: { port: "New York",  cost: 1545 },
    WV: { port: "New York",  cost: 1595 },
    DC: { port: "New York",  cost: 1565 },
    WI: { port: "New York",  cost: 1680 },
    WY: { port: "Houston",   cost: 2175 },
  };
  return map[s] ?? { port: "De confirmat", cost: 0 };
}

// ── Romania transport cost by body type ────────────────────────────────────────
export function getRoTransportCost(bodyType?: string): number {
  const b = (bodyType || "").toLowerCase();
  if (b.includes("pickup") || b.includes("truck")) return 1100;
  if (b.includes("suv") || b.includes("crossover") || b.includes("van") || b.includes("minivan")) return 900;
  return 850;
}

// ── Full breakdown ──────────────────────────────────────────────────────────────
export function computeImportCost(
  vehicle: ImportCostVehicle,
  options: ImportCostOptions = {},
): ImportCostResult {
  const platform = vehicle.platform;
  const bidPrice = options.bidPrice ?? vehicle.estimatedBid ?? 0;
  const eurUsdRate = options.eurUsdRate ?? 0.92;

  const isSalvage = (vehicle.titleType || "").toLowerCase().includes("salvage");
  const isHybridOrElectric = ["electric", "hybrid", "plug-in"].some(
    (k) => (vehicle.fuelType || "").toLowerCase().includes(k),
  );

  const includeSalvageTitle = options.includeSalvageTitle ?? isSalvage;
  const includePortTax = options.includePortTax ?? isHybridOrElectric;
  const includeInsurance = options.includeInsurance ?? false;
  const includeRoTransport = options.includeRoTransport ?? true;

  const transportInfo = getTransportInfo(vehicle.location || vehicle.state || "");
  const usaTransport = options.usaTransportOverride ?? transportInfo.cost;
  const usaTransportAvailable = usaTransport > 0;
  const transportPort = transportInfo.port;
  const roTransportCost = getRoTransportCost(vehicle.bodyType);

  // ── COSTURI SUA ──
  const buyerFee = auctionFee(bidPrice, platform);
  const portTax = includePortTax ? 400 : 0;
  const salvageTitleCost = includeSalvageTitle ? 550 : 0;
  const exportDocs = 300;
  const totalUSA = bidPrice + buyerFee + portTax + usaTransport + salvageTitleCost + exportDocs;

  // Valoare declarație vamală = Total SUA (USD), convertit în EUR
  const cifEUR = totalUSA * eurUsdRate;

  // ── COSTURI UE ──
  const insurance = includeInsurance ? cifEUR * 0.01 : 0;
  const customsDuty = cifEUR * 0.10;
  const tva = (cifEUR + customsDuty) * 0.21;
  const commissionMCSUA = 1000;
  const portHandling = 500;
  const roTransport = includeRoTransport ? roTransportCost : 0;
  const totalEU = insurance + customsDuty + tva + commissionMCSUA + portHandling + roTransport;

  // TOTAL GENERAL = Total SUA în EUR + Total UE
  const totalGeneral = cifEUR + totalEU;

  return {
    bidPrice,
    eurUsdRate,
    platform,
    transportPort,
    usaTransport,
    usaTransportAvailable,
    roTransportCost,
    buyerFee,
    portTax,
    salvageTitleCost,
    exportDocs,
    totalUSA,
    cifEUR,
    insurance,
    customsDuty,
    tva,
    commissionMCSUA,
    portHandling,
    roTransport,
    totalEU,
    totalGeneral,
    includeSalvageTitle,
    includePortTax,
    includeInsurance,
    includeRoTransport,
  };
}
