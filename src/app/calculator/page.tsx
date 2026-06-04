"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Phone,
  Info,
  Settings,
  ChevronDown,
} from "lucide-react";

// ── Transport cost map per state ───────────────────────────────────────────────
const STATE_TRANSPORT_PAGE: Record<string, { port: string; cost: number }> = {
  AL: { port: "Savannah", cost: 1610 },
  AZ: { port: "Houston", cost: 2400 },
  AR: { port: "Houston", cost: 1730 },
  CA: { port: "Long Beach", cost: 2400 },
  CO: { port: "Houston", cost: 2400 },
  CT: { port: "New York", cost: 1540 },
  DE: { port: "New York", cost: 1570 },
  FL: { port: "Florida", cost: 1580 },
  GA: { port: "Savannah", cost: 1565 },
  ID: { port: "Houston", cost: 2570 },
  IL: { port: "New York", cost: 1765 },
  IN: { port: "New York", cost: 1675 },
  IA: { port: "Savannah", cost: 1825 },
  KS: { port: "Houston", cost: 1765 },
  KY: { port: "Savannah", cost: 1610 },
  LA: { port: "Houston", cost: 1650 },
  ME: { port: "New York", cost: 1675 },
  MD: { port: "New York", cost: 1575 },
  MA: { port: "New York", cost: 1590 },
  MI: { port: "New York", cost: 1630 },
  MN: { port: "New York", cost: 1840 },
  MS: { port: "Houston", cost: 1580 },
  MO: { port: "Houston", cost: 1695 },
  MT: { port: "Houston", cost: 2565 },
  NE: { port: "Houston", cost: 1875 },
  NV: { port: "Houston", cost: 2400 },
  NH: { port: "New York", cost: 1675 },
  NJ: { port: "New York", cost: 1570 },
  NM: { port: "Houston", cost: 1765 },
  NY: { port: "New York", cost: 1500 },
  NC: { port: "Savannah", cost: 1560 },
  ND: { port: "New York", cost: 1910 },
  OH: { port: "New York", cost: 1690 },
  OK: { port: "Houston", cost: 1630 },
  OR: { port: "Houston", cost: 2640 },
  PA: { port: "New York", cost: 1650 },
  RI: { port: "New York", cost: 1590 },
  SC: { port: "Savannah", cost: 1645 },
  SD: { port: "New York", cost: 1900 },
  TN: { port: "Savannah", cost: 1650 },
  TX: { port: "Houston", cost: 1500 },
  UT: { port: "Houston", cost: 2470 },
  VT: { port: "New York", cost: 1620 },
  VA: { port: "New York", cost: 1545 },
  WA: { port: "New York", cost: 1565 },
  WV: { port: "New York", cost: 1595 },
  WI: { port: "New York", cost: 1680 },
  WY: { port: "Houston", cost: 2175 },
  DC: { port: "New York", cost: 1565 },
};

// State names in Romanian
const US_STATES: { code: string; name: string }[] = [
  { code: "", name: "Selectează statul" },
  { code: "AL", name: "Alabama" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "NC", name: "Carolina de Nord" },
  { code: "SC", name: "Carolina de Sud" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "ND", name: "Dakota de Nord" },
  { code: "SD", name: "Dakota de Sud" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WV", name: "Virginia de Vest" },
  { code: "DC", name: "Washington DC" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// ── Auction fee calculator ────────────────────────────────────────────────────
function auctionFee(bid: number, platform: "copart" | "iaai"): number {
  const minFee = 600;
  const pct = platform === "iaai" ? 0.10 : 0.12;
  return bid < 6000 ? minFee : Math.round(bid * pct);
}

// ── Cost Row Component ────────────────────────────────────────────────────────
function CostRow({
  num,
  label,
  sublabel,
  value,
  highlight,
  tooltip,
  infoLink,
  infoText,
}: {
  num: number;
  label: string;
  sublabel?: string;
  value: string;
  highlight?: boolean;
  tooltip?: string;
  infoLink?: string;
  infoText?: string;
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
          {infoLink && infoText && (
            <Link href={infoLink} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-accent transition-colors mt-1">
              <Info className="h-3 w-3" />
              <span className="underline">{infoText}</span>
            </Link>
          )}
        </div>
      </div>
      <span className={`text-xs font-semibold whitespace-nowrap ${highlight ? "text-primary" : "text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

// ── Check Row Component ───────────────────────────────────────────────────────
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

// ── Advanced Input Component ──────────────────────────────────────────────────
function AdvancedInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent"
      />
    </div>
  );
}

export default function CalculatorPage() {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [platform, setPlatform] = useState<"copart" | "iaai">("copart");
  const [bidPrice, setBidPrice] = useState(5000);
  const [selectedState, setSelectedState] = useState("");
  const [eurUsdRate, setEurUsdRate] = useState(0.92);

  // ── Checkbox state ──────────────────────────────────────────────────────────
  const [includePortTax, setIncludePortTax] = useState(false);
  const [includeSalvageTitle, setIncludeSalvageTitle] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [includeRoTransport, setIncludeRoTransport] = useState(true);
  const [vehicleType, setVehicleType] = useState<"sedan" | "suv" | "pickup">("sedan");

  // ── Transport info from selected state ──────────────────────────────────────
  const transportInfo = selectedState ? STATE_TRANSPORT_PAGE[selectedState] : null;

  // ── COSTURI SUA ──
  const buyerFee = auctionFee(bidPrice, platform);
  const portTax = includePortTax ? 400 : 0;
  const usaTransport = transportInfo?.cost || 0;
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

  // Romania transport cost by vehicle type
  const roTransportCost = vehicleType === "pickup" ? 1100 : vehicleType === "suv" ? 900 : 850;
  const roTransport = includeRoTransport ? roTransportCost : 0;

  const totalEU = insurance + customsDuty + tva + commissionMCSUA + portHandling + roTransport;

  // TOTAL GENERAL = Total SUA în EUR + Total UE
  const totalGeneral = cifEUR + totalEU;

  const fmt = (n: number, currency = "€") =>
    `${currency}${Math.round(n).toLocaleString("ro-RO")}`;
  const fmtUSD = (n: number) => fmt(n, "$");

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary via-primary to-slate-800 text-white py-16 sm:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <Calculator className="h-4 w-4 text-blue-300" />
            <span>Estimare gratuită</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Calculator Cost Import Auto
            <span className="block text-blue-300 mt-1">din SUA în România</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Estimează costul total al importului — de la prețul licitației Copart / IAAI
            până la livrarea mașinii la ușa ta, inclusiv taxe vamale și TVA.
          </p>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {/* ══════ LEFT: Form ══════ */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-6">
              <h2 className="font-bold text-lg text-primary mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-accent" />
                Parametri calcul
              </h2>

              {/* 1. Platform toggle */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                  Platformă
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["copart", "iaai"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                        platform === p
                          ? p === "copart"
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                            : "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/25"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {p === "copart" ? "Copart" : "IAAI"}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {platform === "copart" ? "Copart: 12% (min. $600)" : "IAAI: 10% (min. $600)"}
                </p>
              </div>

              {/* 2. Bid price input */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                  Oferta ta (USD)
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setBidPrice(Math.max(0, bidPrice - 100))}
                    className="px-4 py-3 text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors text-lg font-medium"
                  >−</button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      value={bidPrice}
                      onChange={(e) => setBidPrice(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-3 text-center text-base font-bold text-primary focus:outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setBidPrice(bidPrice + 100)}
                    className="px-4 py-3 text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors text-lg font-medium"
                  >+</button>
                </div>
              </div>

              {/* 3. State dropdown */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                  Statul vehiculului
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white cursor-pointer"
                  >
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                        {state.code && STATE_TRANSPORT_PAGE[state.code]
                          ? ` — $${STATE_TRANSPORT_PAGE[state.code].cost.toLocaleString("ro-RO")}`
                          : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                {transportInfo && (
                  <p className="text-[10px] text-slate-400 mt-2">
                    Port: {transportInfo.port} · Cost transport: ${transportInfo.cost.toLocaleString("ro-RO")}
                  </p>
                )}
              </div>

              {/* 4. Vehicle type for Romania transport */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                  Tip vehicul (pentru transport Rotterdam → România)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { type: "sedan", label: "Sedan", cost: 850 },
                    { type: "suv", label: "SUV", cost: 900 },
                    { type: "pickup", label: "Pickup", cost: 1100 },
                  ] as const).map((v) => (
                    <button
                      key={v.type}
                      type="button"
                      onClick={() => setVehicleType(v.type)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        vehicleType === v.type
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {v.label}
                      <span className="block text-[10px] font-normal mt-0.5">€{v.cost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Advanced options */}
              <details className="group">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-accent flex items-center gap-1 transition-colors font-medium">
                  <Settings className="h-3 w-3" />
                  Ajustează parametrii avansați
                </summary>
                <div className="mt-4 space-y-4 pt-4 border-t border-slate-100">
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
            </div>

            {/* Info card */}
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
          </div>

          {/* ══════ RIGHT: Breakdown ══════ */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
              {/* Header cu Total General */}
              <div className="bg-gradient-to-r from-primary to-slate-700 px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-xs uppercase tracking-widest font-medium">1 – 13 Total General</span>
                </div>
                <div className="text-3xl font-extrabold text-white">{fmt(totalGeneral)}</div>
                <p className="text-slate-400 text-xs mt-1">Consultație gratuită inclusă</p>
              </div>

              {/* CTA button */}
              <div className="px-5 pt-4 pb-4">
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
                    sublabel={platform === "iaai" ? "IAAI · 10% (min. $600)" : "Copart · 12% (min. $600)"}
                    value={fmtUSD(buyerFee)}
                    tooltip="Sub $6.000 taxă minimă $600. Peste $6.000: IAAI 10% / Copart 12%. MC SUA nu adaugă taxe de broker."
                  />
                  <CostRow
                    num={3}
                    label="Transport SUA → Rotterdam"
                    sublabel={transportInfo ? `${transportInfo.port} · 4-6 săptămâni` : "Selectează statul pentru cost"}
                    value={transportInfo ? fmtUSD(usaTransport) : "De confirmat"}
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
                  <CostRow
                    num={6}
                    label="Documentație export"
                    sublabel="Titlu de export, procuri, acte vamale SUA"
                    value={fmtUSD(exportDocs)}
                  />
                </div>
                <div className="flex justify-between items-center mt-3 py-2.5 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">1 – 6  TOTAL SUA</span>
                  <span className="text-sm font-extrabold text-primary">{fmtUSD(totalUSA)}</span>
                </div>
              </div>

              {/* ── COSTURI UE ── */}
              <div className="px-5 pt-1 pb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Costuri UE
                </h3>
                <div className="space-y-2">
                  {/* Item 7: Valoare declaratie vamala */}
                  <div className="mb-1">
                    <span className="text-[10px] text-slate-400 font-medium block mb-1">
                      7. Valoare declarație vamală (USD)
                    </span>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold text-primary">
                      $ {Math.round(totalUSA).toLocaleString("ro-RO")}
                    </div>
                  </div>
                  <CheckRow
                    num={8}
                    label="Asigurare transport maritim"
                    sublabel="(1% din valoarea bunului)"
                    value={fmt(cifEUR * 0.01)}
                    checked={includeInsurance}
                    onChange={setIncludeInsurance}
                  />
                  <CostRow
                    num={9}
                    label="Taxă vamală"
                    sublabel="(10%)"
                    value={fmt(customsDuty)}
                    infoLink="/contact"
                    infoText="Confirmă cu noi"
                  />
                  <CostRow
                    num={10}
                    label="TVA"
                    sublabel="(21%)"
                    value={fmt(tva)}
                    tooltip="Dacă achiziția se face pe firmă plătitoare de TVA, taxa nu se mai plătește la import."
                  />
                  <CostRow num={11} label="Comision intermediere MC SUA" value={fmt(commissionMCSUA)} />
                  <CostRow
                    num={12}
                    label="Manipulare în port Rotterdam"
                    value={fmt(portHandling)}
                    tooltip="Valoare orientativă. Costul final poate varia în funcție de port și dimensiunile vehiculului."
                  />
                  <CheckRow
                    num={13}
                    label="Rotterdam → România"
                    sublabel={`Sedan €850 · SUV €900 · Pickup €1.100`}
                    value={fmt(roTransportCost)}
                    checked={includeRoTransport}
                    onChange={setIncludeRoTransport}
                  />
                </div>
                <div className="flex justify-between items-center mt-3 py-2.5 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">7 – 13  TOTAL IMPORT</span>
                  <span className="text-sm font-extrabold text-primary">{fmt(totalEU)}</span>
                </div>
              </div>

              {/* Footer note */}
              <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                <p className="text-center text-xs text-slate-400">
                  Estimare orientativă • prețuri reale la consultanță
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA final ─────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-br from-primary to-slate-800 rounded-3xl p-10 text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Gata să aduci mașina visurilor tale din America?
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Echipa MC SUA îți oferă o estimare completă și personalizată, plus consultanță despre
              ce mașini merită și ce să eviți pe platformele de licitații americane.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 font-semibold">
                <Link href="/contact">Contactează-ne acum</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-14 px-8 font-semibold">
                <Link href="/cum-functioneaza">Cum funcționează?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
