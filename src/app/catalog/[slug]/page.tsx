"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Car,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Phone,
  Info,
  RefreshCw,
  Key,
  Layers,
  Settings,
  Zap,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface VehicleDetail {
  slug: string;
  platform: "copart" | "iaai";
  lotNumber: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  color?: string;
  odometer: number;
  odometerUnit: string;
  titleType: string;
  damage: string;
  secondaryDamage?: string;
  estimatedBid: number;
  buyNow?: number;
  auctionDate?: string;
  location: string;
  state: string;
  images: string[];
  hasKey: boolean;
  fuelType: string;
  transmission: string;
  engine?: string;
  cylinders?: string;
  driveType?: string;
  bodyType?: string;
  runCondition: string;
  seller?: string;
  airbags?: string;
  auctionUrl: string;
}

// ── API mapper ─────────────────────────────────────────────────────────────────
// Bazat pe raspunsul REAL apibara (confirmat browser):
// nested: media.thumbs, pricing.current_bid_usd, condition.run_condition={label},
// vehicle_specs.engine={raw}, location={display,state}, odometer={mi,km}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDetailVehicle(v: any): VehicleDetail {
  const platformId = Number(v.platform_id ?? 0);
  const platformStr = String(v.platform || "").toLowerCase();
  const platform: "copart" | "iaai" =
    platformId === 2 || platformStr.includes("iaai") ? "iaai" : "copart";

  const lotNumber = String(v.lot_number || v.lot || "");
  const vin = String(v.vin || "");
  const slug = String(vin || v.slug_vin || v.slug || lotNumber);

  // Imagini: media.thumbs = array de URL string-uri
  const media = v.media || {};
  let images: string[] = [];
  if (Array.isArray(media.thumbs)) {
    images = (media.thumbs as unknown[]).filter((s): s is string => typeof s === "string");
  } else if (Array.isArray(media.items)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images = (media.items as any[]).map((i) => String(i.full || i.large || i.thumb || "")).filter(Boolean);
  }

  // Pret: pricing.current_bid_usd
  const pricing = v.pricing || {};
  const bid = Number(pricing.current_bid_usd ?? pricing.current_bid2_usd ?? pricing.buy_now_usd ?? 0);
  const buyNow = pricing.buy_now_usd ? Number(pricing.buy_now_usd) : undefined;

  // Conditie: run_condition este OBIECT {value, label}
  const condition = v.condition || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rcObj = condition.run_condition as any;
  const runCondition = rcObj && typeof rcObj === "object"
    ? String(rcObj.label || rcObj.value || "Unknown")
    : String(rcObj || "Unknown");

  // Specs: engine este OBIECT {raw, size_l}
  const specs = v.vehicle_specs || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engObj = specs.engine as any;
  const engine = engObj && typeof engObj === "object"
    ? String(engObj.raw || (engObj.size_l ? `${engObj.size_l}L` : "") || "")
    : (engObj ? String(engObj) : undefined);

  // Locatie: location={display, state}
  const locRaw = v.location;
  const locationDisplay = !locRaw ? "" : typeof locRaw === "string" ? locRaw : String(locRaw.display || "");
  const state = !locRaw || typeof locRaw === "string" ? "" : String(locRaw.state || "");

  // Odometru: odometer={mi, km}
  const odoObj = v.odometer || {};
  const odometer = typeof odoObj === "number" ? odoObj : Number(odoObj.mi ?? odoObj.km ?? 0);
  const odometerUnit = odoObj.km !== undefined && odoObj.mi === undefined ? "km" : "mi";

  // Sale document, daune, seller
  const saleDoc = v.sale_document || {};
  const titleType = String(saleDoc.name || "Salvage Title");
  const damage = String(condition.primary_damage || condition.loss || "");
  const secondaryDamage = condition.secondary_damage ? String(condition.secondary_damage) : undefined;
  const hasKey = condition.has_key === true || condition.has_key === "With";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sellerObj = v.seller as any;
  const seller = sellerObj && typeof sellerObj === "object"
    ? String(sellerObj.name || "")
    : (sellerObj ? String(sellerObj) : undefined);

  // Auction date
  const auction = v.auction || {};
  const auctionDateRaw = auction.full_date || auction.date || v.auction_date || "";
  const auctionDate = auctionDateRaw ? String(auctionDateRaw) : undefined;

  return {
    slug,
    platform,
    lotNumber,
    vin,
    year: Number(v.year) || 0,
    make: String(v.make || ""),
    model: String(v.model || ""),
    trim: v.trim ? String(v.trim) : undefined,
    color: specs.exterior_color ? String(specs.exterior_color) : undefined,
    odometer,
    odometerUnit,
    titleType,
    damage,
    secondaryDamage,
    estimatedBid: bid,
    buyNow,
    auctionDate,
    location: locationDisplay,
    state,
    images,
    hasKey,
    fuelType: String(specs.fuel_type || "Gasoline"),
    transmission: String(specs.transmission || "Automatic"),
    engine: engine || undefined,
    cylinders: specs.cylinders ? String(specs.cylinders) : undefined,
    driveType: specs.drive_type ? String(specs.drive_type) : undefined,
    bodyType: specs.body_style ? String(specs.body_style) : undefined,
    seller: seller || undefined,
    airbags: specs.airbags ? String(specs.airbags) : undefined,
    runCondition,
    auctionUrl: platform === "iaai"
      ? `https://www.iaai.com/vehicledetail/${lotNumber}~US`
      : `https://www.copart.com/lot/${lotNumber}`,
  };
}


// ── Traduceri română ──────────────────────────────────────────────────────────
function tFuel(v: string): string {
  const m: Record<string, string> = {
    "Gas": "Benzină", "Gasoline": "Benzină", "gas": "Benzină",
    "Diesel": "Diesel", "Electric": "Electric",
    "Hybrid": "Hibrid", "Flexible": "Flex",
  };
  return m[v] || v;
}
function tTransmission(v: string): string {
  const m: Record<string, string> = {
    "Automatic": "Automată", "automatic": "Automată",
    "Manual": "Manuală", "manual": "Manuală",
  };
  return m[v] || v;
}
function tDrive(v: string): string {
  const vl = v.toUpperCase();
  if (vl.includes("FRONT")) return "Tracțiune față";
  if (vl.includes("REAR")) return "Tracțiune spate";
  if (vl.includes("ALL") || vl.includes("AWD") || vl.includes("4WD") || vl.includes("4X4")) return "4×4";
  return v;
}
function tCondition(v: string): string {
  const vl = v.toLowerCase();
  if (vl.includes("runs")) return "Pornește și merge";
  if (vl.includes("stationary") || vl.includes("static")) return "Staționar";
  return v;
}

// ── Auction fee calculator ────────────────────────────────────────────────────
function auctionFee(bid: number, platform: "copart" | "iaai"): number {
  const minFee = 600;
  const pct = platform === "iaai" ? 0.10 : 0.125;
  return bid < 6000 ? minFee : Math.round(bid * pct);
}

// ── Transport info per state ───────────────────────────────────────────────────
function getTransportInfo(state: string): { port: string; cost: number } {
  const s = (state || "").toUpperCase().trim();
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
    IN: { port: "New York",  cost: 1755 },
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
function getRoTransportCost(bodyType?: string): number {
  const b = (bodyType || "").toLowerCase();
  if (b.includes("pickup") || b.includes("truck")) return 1100;
  if (b.includes("suv") || b.includes("crossover") || b.includes("van") || b.includes("minivan")) return 900;
  return 850;
}

// ── Cost calculator sidebar ────────────────────────────────────────────────────
function CostCalculator({
  vehicle,
}: {
  vehicle: VehicleDetail;
}) {
  const isSalvage = vehicle.titleType?.toLowerCase().includes("salvage");
  const transportInfo = getTransportInfo(vehicle.state || "");
  const roTransportCost = getRoTransportCost(vehicle.bodyType);

  const isHybridOrElectric = ["electric", "hybrid", "plug-in"].some(
    (k) => (vehicle.fuelType || "").toLowerCase().includes(k)
  );

  const [bidPrice, setBidPrice] = useState(vehicle.estimatedBid || 0);
  const [eurUsdRate, setEurUsdRate] = useState(0.92);
  const [includeSalvageTitle, setIncludeSalvageTitle] = useState(isSalvage);
  const [includePortTax, setIncludePortTax] = useState(isHybridOrElectric);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [includeRoTransport, setIncludeRoTransport] = useState(true);

  // ── COSTURI SUA ──
  const buyerFee = auctionFee(bidPrice, vehicle.platform);
  const portTax = includePortTax ? 400 : 0;
  const usaTransport = transportInfo.cost;
  const salvageTitleCost = includeSalvageTitle ? 550 : 0;
  const totalUSA = bidPrice + buyerFee + portTax + usaTransport + salvageTitleCost;

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

  const fmt = (n: number, currency = "€") =>
    `${currency}${Math.round(n).toLocaleString("ro-RO")}`;
  const fmtUSD = (n: number) => fmt(n, "$");

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
      {/* Header cu Total General */}
      <div className="bg-gradient-to-r from-primary to-slate-700 px-5 py-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-300 text-xs uppercase tracking-widest font-medium">1 – 12 Total General</span>
        </div>
        <div className="text-3xl font-extrabold text-white">{fmt(totalGeneral)}</div>
        <p className="text-slate-400 text-xs mt-1">Consultație gratuită inclusă</p>
      </div>

      <div className="px-5 pt-3 pb-2">
        {/* Bid price input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
            Oferta ta
          </label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setBidPrice(Math.max(0, bidPrice - 100))}
              className="px-3 py-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors text-lg font-medium"
            >−</button>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-6 pr-2 py-2.5 text-center text-sm font-bold text-primary focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setBidPrice(bidPrice + 100)}
              className="px-3 py-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors text-lg font-medium"
            >+</button>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div className="px-5 pb-4">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 h-11 font-bold text-sm shadow-lg shadow-accent/20">
          <Link href="/contact" className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            Obține Detalii
          </Link>
        </Button>
        <Link
          href="/cum-functioneaza"
          className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:border-accent hover:text-accent transition-all mt-2"
        >
          <Info className="h-4 w-4" />
          Cum funcționează importul?
        </Link>
      </div>

      {/* ── COSTURI SUA ── */}
      <div className="px-5 pb-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Costuri SUA
        </h3>
        <div className="space-y-2">
          <CostRow
            num={1}
            label="Preț lot"
            value={fmtUSD(bidPrice)}
            highlight
            tooltip="Bid-ul curent afișat nu reprezintă prețul final de achiziție. Prețul final poate fi mai mare în funcție de licitație."
          />
          <CostRow
            num={2}
            label="Taxe licitație"
            sublabel={vehicle.platform === "iaai" ? "IAAI · 10% (min. $600)" : "Copart · 12.5% (min. $600)"}
            value={fmtUSD(buyerFee)}
            tooltip="Sub $6.000 taxă minimă $600. Peste $6.000: IAAI 10% / Copart 12.5%. MC SUA nu adaugă taxe de broker."
          />
          <CostRow
            num={3}
            label="Transport SUA → Rotterdam"
            sublabel={`${transportInfo.port} · 4-6 săptămâni`}
            value={transportInfo.cost > 0 ? fmtUSD(usaTransport) : "De confirmat"}
          />
          <CheckRow
            num={4}
            label="Taxă port USA – Hibrid/Electric"
            sublabel="$400 · aplicabil vehiculelor hibrid sau electrice"
            value={fmtUSD(400)}
            checked={includePortTax}
            onChange={setIncludePortTax}
          />
          <CheckRow
            num={5}
            label="Schimbare certificat de titlu"
            sublabel="Salvage → Clean · $550 în regim de urgență (3 zile lucrătoare)"
            value={fmtUSD(550)}
            checked={includeSalvageTitle}
            onChange={setIncludeSalvageTitle}
          />
        </div>
        <div className="flex justify-between items-center mt-3 py-2.5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">1 – 5  TOTAL SUA</span>
          <span className="text-sm font-extrabold text-primary">{fmtUSD(totalUSA)}</span>
        </div>
      </div>

      {/* ── COSTURI UE ── */}
      <div className="px-5 pt-1 pb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
          Costuri UE
        </h3>
        <div className="space-y-2">
          {/* Item 6: Valoare declaratie vamala */}
          <div className="mb-1">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              6. Valoare declarație vamală (USD)
            </span>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-primary">
              $ {Math.round(totalUSA).toLocaleString("ro-RO")}
            </div>
          </div>
          <CheckRow
            num={7}
            label="Asigurare transport maritim"
            sublabel="(1% din valoarea bunului)"
            value={fmt(insurance)}
            checked={includeInsurance}
            onChange={setIncludeInsurance}
          />
          <CostRow num={8} label="Taxă vamală" sublabel="(10%)" value={fmt(customsDuty)} />
          <CostRow
            num={9}
            label="TVA"
            sublabel="(21%)"
            value={fmt(tva)}
            tooltip="Dacă achiziția se face pe firmă plătitoare de TVA, taxa nu se mai plătește la import."
          />
          <CostRow num={10} label="Comision intermediere MC SUA" value={fmt(commissionMCSUA)} />
          <CostRow
            num={11}
            label="Manipulare în port"
            value={fmt(portHandling)}
            tooltip="Valoare orientativă. Costul final poate varia în funcție de port și dimensiunile vehiculului."
          />
          <CheckRow
            num={12}
            label="Rotterdam → România"
            sublabel={
              vehicle.bodyType?.toLowerCase().includes("pickup") || vehicle.bodyType?.toLowerCase().includes("truck")
                ? "Pickup · €1.100"
                : vehicle.bodyType?.toLowerCase().includes("suv") || vehicle.bodyType?.toLowerCase().includes("crossover") || vehicle.bodyType?.toLowerCase().includes("van")
                ? "SUV · €900"
                : "Sedan · €850"
            }
            value={fmt(roTransportCost)}
            checked={includeRoTransport}
            onChange={setIncludeRoTransport}
          />
        </div>
        <div className="flex justify-between items-center mt-3 py-2.5 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">6 – 12  TOTAL IMPORT</span>
          <span className="text-sm font-extrabold text-primary">{fmt(totalEU)}</span>
        </div>
      </div>

      {/* Advanced options */}
      <div className="px-5 pb-4 border-t border-slate-100 pt-3">
        <details className="group">
          <summary className="text-xs text-slate-400 cursor-pointer hover:text-accent flex items-center gap-1 transition-colors">
            <Settings className="h-3 w-3" />
            Ajustează parametrii
          </summary>
          <div className="mt-3 space-y-3">
            <AdvancedInput
              label="Curs EUR/USD"
              value={eurUsdRate}
              onChange={setEurUsdRate}
              step={0.01}
              min={0.5}
              max={2}
            />
          </div>
        </details>
        <p className="text-center text-xs text-slate-400 mt-3">
          Estimare orientativă • prețuri reale la consultanță
        </p>
      </div>
    </div>
  );
}

function CostRow({
  num,
  label,
  sublabel,
  value,
  highlight,
  tooltip,
}: {
  num: number;
  label: string;
  sublabel?: string;
  value: string;
  highlight?: boolean;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-start gap-2 flex-1">
        <span className="text-[10px] text-slate-400 font-medium w-4 flex-shrink-0 mt-0.5">{num}.</span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs ${highlight ? "font-bold text-primary" : "text-slate-600"}`}>{label}</span>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-slate-400 hover:text-accent transition-colors"
                >
                  <Info className="h-3 w-3" />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg z-50">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          {sublabel && <span className="block text-[10px] text-slate-400 mt-0.5">{sublabel}</span>}
        </div>
      </div>
      <span className={`text-xs font-semibold whitespace-nowrap ${highlight ? "text-primary" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

function CheckRow({
  num,
  label,
  sublabel,
  value,
  checked,
  onChange,
}: {
  num: number;
  label: string;
  sublabel?: string;
  value: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <label className="flex items-start gap-2 cursor-pointer group flex-1">
        <span className="text-[10px] text-slate-400 font-medium w-4 flex-shrink-0 mt-0.5">{num}.</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-3.5 h-3.5 mt-0.5 accent-accent rounded flex-shrink-0"
        />
        <div>
          <span className="text-xs text-slate-600 group-hover:text-accent transition-colors">{label}</span>
          {sublabel && <span className="block text-[10px] text-slate-400">{sublabel}</span>}
        </div>
      </label>
      <span className={`text-xs font-semibold whitespace-nowrap ${checked ? "text-slate-700" : "text-slate-300 line-through"}`}>
        {value}
      </span>
    </div>
  );
}

function AdvancedInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  prefix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full ${prefix ? "pl-6" : "pl-3"} pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent`}
        />
      </div>
    </div>
  );
}

// ── Spec row ───────────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-400 font-medium w-36 flex-shrink-0">{label}</span>
      <span className="text-xs text-slate-700 font-semibold">{String(value)}</span>
    </div>
  );
}

// ── Image gallery ──────────────────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(images.length - 1, i + 1));

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-slate-100 rounded-2xl flex items-center justify-center">
        <Car className="h-16 w-16 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-[16/10] rounded-2xl overflow-hidden relative bg-slate-100 group">
        {!imgError ? (
          <img
            src={images[activeIdx]}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-16 w-16 text-slate-300" />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={activeIdx === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={activeIdx === images.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeIdx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.slice(0, 12).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setActiveIdx(i); setImgError(false); }}
              className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                activeIdx === i ? "border-accent shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main detail page ───────────────────────────────────────────────────────────
export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    fetch(`/api/vehicles/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Eroare ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Some APIs wrap in a "vehicle" or "data" key
        const raw = data.vehicle ?? data.data ?? data;
        setVehicle(mapDetailVehicle(raw));
      })
      .catch((err) => {
        setError(err.message || "Nu s-a putut încărca vehiculul.");
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  const title = useMemo(() => {
    if (!vehicle) return "Detalii vehicul";
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? " " + vehicle.trim : ""}`;
  }, [vehicle]);

  const isCleanTitle = vehicle?.titleType?.toLowerCase().includes("clean");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6 text-slate-400 text-sm">
            <button type="button" onClick={() => router.back()} className="flex items-center gap-1 hover:text-accent">
              <ArrowLeft className="h-4 w-4" /> Înapoi la catalog
            </button>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/2" />
            <div className="aspect-[16/10] bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
              </div>
              <div className="h-96 bg-slate-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !vehicle) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <Info className="h-12 w-12 mx-auto mb-4 text-red-400 opacity-70" />
          <h1 className="text-2xl font-bold text-slate-700 mb-2">Vehicul negăsit</h1>
          <p className="text-slate-400 mb-6">{error || "Lotul nu mai este disponibil sau a fost adjudecat."}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Înapoi
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/catalog">Catalog complet</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-accent transition-colors">Acasă</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-accent transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-[200px]">{title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent transition-colors mt-1"
          >
            <ArrowLeft className="h-4 w-4" /> Înapoi
          </button>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${
                  vehicle.platform === "copart" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
                }`}
              >
                {vehicle.platform === "copart" ? "Copart" : "IAAI"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isCleanTitle ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {isCleanTitle ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {vehicle.titleType}
              </span>
              {vehicle.runCondition === "Runs and Drives" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600">
                  <Zap className="h-3 w-3" /> Pornește și rulează
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">{title}</h1>
            <p className="text-sm text-slate-400 mt-1">
              LOT #{vehicle.lotNumber} · VIN: {vehicle.vin}
            </p>
          </div>

          <a
            href={vehicle.auctionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-accent hover:text-accent transition-all font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Vezi pe {vehicle.platform === "copart" ? "Copart" : "IAAI"}
          </a>
        </div>

        {/* ── Gallery ── */}
        <div className="mb-8">
          <ImageGallery images={vehicle.images} title={title} />
        </div>

        {/* Disclaimer delay */}
        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-3 mb-6">
          <span>🕐</span>
          <span>
            Datele pot avea un delay față de platformă. Verifică în timp real pe{" "}
            <a href="https://www.copart.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">copart.com ↗</a>
            {" "}sau{" "}
            <a href="https://www.iaai.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent transition-colors">iaai.com ↗</a>.
          </span>
        </p>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: specs ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price hero */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Bid curent</p>
                  <p className="text-4xl font-extrabold text-accent">
                    ${vehicle.estimatedBid.toLocaleString("ro-RO")}
                  </p>
                  {vehicle.buyNow && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      Buy Now: ${vehicle.buyNow.toLocaleString("ro-RO")}
                    </p>
                  )}
                </div>
                {vehicle.auctionDate && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" /> Data licitației
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {new Date(vehicle.auctionDate).toLocaleDateString("ro-RO", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <QuickFact icon={<Gauge className="h-5 w-5" />} label="Rulaj" value={`${vehicle.odometer.toLocaleString("ro-RO")} ${vehicle.odometerUnit}`} />
              <QuickFact icon={<MapPin className="h-5 w-5" />} label="Locație" value={`${vehicle.location}${vehicle.state ? `, ${vehicle.state}` : ""}`} />
              <QuickFact icon={<Fuel className="h-5 w-5" />} label="Combustibil" value={tFuel(vehicle.fuelType)} />
              <QuickFact icon={<Key className="h-5 w-5" />} label="Chei" value={vehicle.hasKey ? "Da" : "Nu"} ok={vehicle.hasKey} />
            </div>

            {/* Vehicle details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Car className="h-4 w-4 text-accent" />
                Date vehicul
              </h2>
              <div className="divide-y divide-slate-100">
                <SpecRow label="VIN" value={vehicle.vin} />
                <SpecRow label="Platformă" value={vehicle.platform === "copart" ? "Copart" : "IAAI"} />
                <SpecRow label="Lot #" value={vehicle.lotNumber} />
                <SpecRow label="An fabricație" value={vehicle.year} />
                <SpecRow label="Marcă" value={vehicle.make} />
                <SpecRow label="Model" value={vehicle.model} />
                {vehicle.trim && <SpecRow label="Versiune" value={vehicle.trim} />}
                <SpecRow label="Culoare" value={vehicle.color} />
                <SpecRow label="Caroserie" value={vehicle.bodyType} />
                <SpecRow label="Motor" value={vehicle.engine} />
                <SpecRow label="Cilindri" value={vehicle.cylinders} />
                <SpecRow label="Cutie de viteze" value={tTransmission(vehicle.transmission)} />
                <SpecRow label="Tracțiune" value={vehicle.driveType ? tDrive(vehicle.driveType) : undefined} />
                <SpecRow label="Combustibil" value={tFuel(vehicle.fuelType)} />
                <SpecRow label="Rulaj" value={`${vehicle.odometer.toLocaleString("ro-RO")} ${vehicle.odometerUnit}`} />
                <SpecRow label="Stare funcționare" value={tCondition(vehicle.runCondition)} />
                <SpecRow label="Tip titlu" value={vehicle.titleType} />
                <SpecRow label="Daună primară" value={vehicle.damage} />
                {vehicle.secondaryDamage && <SpecRow label="Daună secundară" value={vehicle.secondaryDamage} />}
                <SpecRow label="Chei" value={vehicle.hasKey ? "Da" : "Nu"} />
                <SpecRow label="Airbag-uri" value={vehicle.airbags} />
                <SpecRow label="Vânzător" value={vehicle.seller} />
                <SpecRow label="Locație yard" value={`${vehicle.location}${vehicle.state ? `, ${vehicle.state}` : ""}`} />
                {vehicle.auctionDate && (
                  <SpecRow
                    label="Data licitației"
                    value={new Date(vehicle.auctionDate).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  />
                )}
              </div>
            </div>

            {/* Info notice */}
            <div className="bg-blue-50 rounded-2xl p-5 flex gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">De ce să alegi MC SUA?</p>
                <p className="text-blue-600 text-xs leading-relaxed">
                  Noi gestionăm întregul proces — de la licitație până la înmatriculare în România.
                  Plătești un comision fix de €1.000 și nu ai surprize. Livrare în 6-10 săptămâni.
                </p>
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 h-12 font-bold shadow-lg shadow-accent/20">
                <Link href="/contact" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Vreau consultanță gratuită
                </Link>
              </Button>
            </div>
          </div>

          {/* ── Right: calculator sidebar ── */}
          <div className="lg:col-span-1">
            <CostCalculator vehicle={vehicle} />
          </div>
        </div>
      </div>
    </main>
  );
}

function QuickFact({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
      <div className={`mx-auto mb-2 w-fit ${ok === false ? "text-red-400" : ok === true ? "text-green-500" : "text-accent"}`}>
        {icon}
      </div>
      <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-xs font-bold text-primary mt-0.5">{value}</p>
    </div>
  );
}
