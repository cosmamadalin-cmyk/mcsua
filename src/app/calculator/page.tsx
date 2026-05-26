"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calculator,
  DollarSign,
  Ship,
  FileText,
  Car,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingDown,
} from "lucide-react";

// ── Copart buyer fees (broker / international rates) ──────────────────────────
const COPART_TIERS: Array<{ max: number; fee: number; pct?: number }> = [
  { max: 99.99, fee: 25 },
  { max: 199.99, fee: 40 },
  { max: 299.99, fee: 50 },
  { max: 349.99, fee: 60 },
  { max: 499.99, fee: 65 },
  { max: 599.99, fee: 85 },
  { max: 699.99, fee: 100 },
  { max: 799.99, fee: 110 },
  { max: 899.99, fee: 125 },
  { max: 999.99, fee: 135 },
  { max: 1199.99, fee: 155 },
  { max: 1299.99, fee: 165 },
  { max: 1499.99, fee: 185 },
  { max: 1999.99, fee: 225 },
  { max: 2999.99, fee: 275 },
  { max: 3999.99, fee: 325 },
  { max: 4999.99, fee: 400 },
  { max: 5999.99, fee: 475 },
  { max: 6999.99, fee: 550 },
  { max: 7999.99, fee: 625 },
  { max: 9999.99, fee: 700 },
  { max: 11999.99, fee: 800 },
  { max: Infinity, fee: 0, pct: 0.07 },
];

// ── IAAI buyer fees ────────────────────────────────────────────────────────────
const IAAI_TIERS: Array<{ max: number; fee: number; pct?: number }> = [
  { max: 99.99, fee: 25 },
  { max: 199.99, fee: 50 },
  { max: 299.99, fee: 75 },
  { max: 399.99, fee: 100 },
  { max: 499.99, fee: 125 },
  { max: 599.99, fee: 150 },
  { max: 699.99, fee: 175 },
  { max: 799.99, fee: 200 },
  { max: 899.99, fee: 225 },
  { max: 999.99, fee: 250 },
  { max: 1499.99, fee: 300 },
  { max: 1999.99, fee: 350 },
  { max: 2999.99, fee: 400 },
  { max: 4999.99, fee: 500 },
  { max: 7999.99, fee: 600 },
  { max: 9999.99, fee: 700 },
  { max: Infinity, fee: 0, pct: 0.065 },
];

function getBuyerFee(price: number, platform: "copart" | "iaai"): number {
  if (!price || price <= 0) return 0;
  const tiers = platform === "copart" ? COPART_TIERS : IAAI_TIERS;
  for (const tier of tiers) {
    if (price <= tier.max) {
      return tier.pct ? Math.round(price * tier.pct) : tier.fee;
    }
  }
  return 0;
}

function fmt(n: number, currency = "EUR"): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtUSD(n: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ── Numeric input helper ───────────────────────────────────────────────────────
function NumInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm font-medium text-slate-500 select-none">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 ${prefix ? "pl-8" : ""} ${suffix ? "pr-14" : ""} border-slate-200 focus:border-accent focus:ring-accent/20`}
        />
        {suffix && (
          <span className="absolute right-3 text-sm font-medium text-slate-500 select-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// ── Row in breakdown table ─────────────────────────────────────────────────────
function Row({
  label,
  value,
  sub,
  accent,
  total,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  total?: boolean;
}) {
  if (total) {
    return (
      <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-accent/30">
        <span className="text-lg font-bold text-primary">{label}</span>
        <span className="text-2xl font-extrabold text-accent">{value}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-start justify-between py-2.5 border-b border-slate-100 ${accent ? "bg-slate-50/60 -mx-2 px-2 rounded" : ""}`}>
      <div>
        <span className={`text-sm ${accent ? "font-semibold text-slate-800" : "text-slate-600"}`}>
          {label}
        </span>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <span className={`text-sm font-semibold ml-4 whitespace-nowrap ${accent ? "text-accent" : "text-slate-800"}`}>
        {value}
      </span>
    </div>
  );
}

export default function CalculatorPage() {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  const [platform, setPlatform] = useState<"copart" | "iaai">("copart");
  const [auctionPrice, setAuctionPrice] = useState("5000");
  const [eurUsd, setEurUsd] = useState("0.92");
  const [usTransport, setUsTransport] = useState("350");
  const [oceanFreight, setOceanFreight] = useState("1200");
  const [portHandling, setPortHandling] = useState("400");
  const [roTransport, setRoTransport] = useState("600");
  const [rarFee, setRarFee] = useState("350");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ── Calculation ─────────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    const price = parseFloat(auctionPrice) || 0;
    const rate = parseFloat(eurUsd) || 0.92;
    const usT = parseFloat(usTransport) || 0;
    const ocean = parseFloat(oceanFreight) || 0;
    const portH = parseFloat(portHandling) || 0;
    const roT = parseFloat(roTransport) || 0;
    const rar = parseFloat(rarFee) || 0;

    // USD costs
    const buyerFee = getBuyerFee(price, platform);
    const totalUSD = price + buyerFee + usT + ocean;

    // Convert to EUR
    const totalEUR = totalUSD * rate;

    // CIF = valoarea vamală (preț + taxe + transport + freight, în EUR)
    const cif = totalEUR;

    // Taxă vamală UE: 6.5% din CIF
    const customsDuty = cif * 0.065;

    // TVA 19% din (CIF + taxă vamală)
    const vat = (cif + customsDuty) * 0.19;

    // Total după vamă + TVA + port + transport RO + RAR
    const total = cif + customsDuty + vat + portH + roT + rar;

    return {
      price,
      buyerFee,
      usT,
      ocean,
      totalUSD,
      rate,
      totalEUR,
      cif,
      customsDuty,
      vat,
      portH,
      roT,
      rar,
      total,
    };
  }, [auctionPrice, platform, eurUsd, usTransport, oceanFreight, portHandling, roTransport, rarFee]);

  const hasPrice = calc.price > 0;

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

          {/* ── LEFT: Inputs ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardContent className="pt-6 pb-8 px-6 space-y-6">

                {/* Platform toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Platforma de licitație</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["copart", "iaai"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                          platform === p
                            ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                            : "border-slate-200 bg-white text-slate-600 hover:border-accent/50"
                        }`}
                      >
                        {p === "copart" ? "🏷 Copart" : "🏷 IAAI"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auction price */}
                <NumInput
                  label="Prețul licitației (USD)"
                  value={auctionPrice}
                  onChange={setAuctionPrice}
                  prefix="$"
                  hint="Prețul câștigător al licitației, fără taxe"
                />

                {hasPrice && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Taxe cumpărător {platform === "copart" ? "Copart" : "IAAI"} estimate:{" "}
                      <strong>{fmtUSD(calc.buyerFee)}</strong> pentru un preț de {fmtUSD(calc.price)}
                    </p>
                  </div>
                )}

                {/* Advanced settings toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-accent font-semibold hover:text-accent/80 transition-colors"
                >
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showAdvanced ? "Ascunde" : "Ajustează"} parametrii avansați
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                      Ajustează valorile în funcție de situația ta
                    </p>

                    <NumInput
                      label="Curs valutar EUR/USD"
                      value={eurUsd}
                      onChange={setEurUsd}
                      hint="1 USD = câți EUR (ex: 0.92)"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <NumInput
                        label="Transport intern SUA ($)"
                        value={usTransport}
                        onChange={setUsTransport}
                        prefix="$"
                        hint="Licitație → port export"
                      />
                      <NumInput
                        label="Freight oceanic ($)"
                        value={oceanFreight}
                        onChange={setOceanFreight}
                        prefix="$"
                        hint="SUA → Bremerhaven, DE"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <NumInput
                        label="Handling port Bremerhaven (€)"
                        value={portHandling}
                        onChange={setPortHandling}
                        prefix="€"
                        hint="Taxe port Germania"
                      />
                      <NumInput
                        label="Transport Bremerhaven → RO (€)"
                        value={roTransport}
                        onChange={setRoTransport}
                        prefix="€"
                        hint="Livrare în România"
                      />
                    </div>

                    <NumInput
                      label="RAR + Omologare (€)"
                      value={rarFee}
                      onChange={setRarFee}
                      prefix="€"
                      hint="Taxe RAR, ITP, înmatriculare estimat"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info card */}
            <Card className="border-0 shadow-md bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <CardContent className="pt-6 pb-6 px-6">
                <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-300" />
                  Despre această estimare
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Taxele vamale UE sunt calculate la <strong className="text-white">6.5% din valoarea CIF</strong></li>
                  <li>• TVA se aplică la <strong className="text-white">19%</strong> din (valoare CIF + taxă vamală)</li>
                  <li>• Estimarea nu include eventuale costuri de reparație</li>
                  <li>• Prețurile de transport pot varia în funcție de sezon și locație</li>
                  <li>• Comisionul MC SUA este stabilit individual, la consultanță</li>
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    Pentru o ofertă exactă și personalizată, contactează echipa MC SUA.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT: Breakdown ──────────────────────────────────────────── */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl sticky top-6">
              <CardContent className="pt-6 pb-8 px-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-accent/10 rounded-xl">
                    <TrendingDown className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-primary">Detalii cost estimat</h2>
                    <p className="text-xs text-slate-500">Toate valorile sunt aproximative</p>
                  </div>
                </div>

                {!hasPrice ? (
                  <div className="text-center py-12 text-slate-400">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Introdu prețul licitației pentru a vedea estimarea</p>
                  </div>
                ) : (
                  <div className="space-y-0">

                    {/* SUA costs */}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                      <DollarSign className="h-3 w-3" /> Costuri în SUA
                    </p>
                    <Row label="Preț licitație" value={fmtUSD(calc.price)} />
                    <Row
                      label={`Taxe cumpărător ${platform === "copart" ? "Copart" : "IAAI"}`}
                      value={fmtUSD(calc.buyerFee)}
                      sub="Estimat pe baza prețului de adjudecare"
                    />
                    <Row label="Transport intern SUA (auction → port)" value={fmtUSD(calc.usT)} />

                    {/* Transport */}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-5 mb-2 flex items-center gap-2">
                      <Ship className="h-3 w-3" /> Transport oceanic
                    </p>
                    <Row label="Freight oceanic SUA → Bremerhaven" value={fmtUSD(calc.ocean)} />
                    <Row
                      label="Total costuri USD → EUR"
                      value={fmt(calc.totalEUR)}
                      sub={`${fmtUSD(calc.totalUSD)} × ${calc.rate} EUR/USD`}
                      accent
                    />

                    {/* Customs */}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-5 mb-2 flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Vamă & taxe România
                    </p>
                    <Row
                      label="Valoare CIF (baza de calcul vamal)"
                      value={fmt(calc.cif)}
                      sub="Cost + Insurance + Freight în EUR"
                    />
                    <Row
                      label="Taxă vamală UE (6.5% × CIF)"
                      value={fmt(calc.customsDuty)}
                    />
                    <Row
                      label="TVA 19% × (CIF + taxă vamală)"
                      value={fmt(calc.vat)}
                    />

                    {/* RO logistics */}
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-5 mb-2 flex items-center gap-2">
                      <Car className="h-3 w-3" /> Logistică & taxe finale
                    </p>
                    <Row label="Handling port Bremerhaven" value={fmt(calc.portH)} />
                    <Row label="Transport Bremerhaven → România" value={fmt(calc.roT)} />
                    <Row
                      label="RAR + Omologare + Înmatriculare"
                      value={fmt(calc.rar)}
                      sub="Estimat, poate varia"
                    />

                    {/* TOTAL */}
                    <Row label="TOTAL ESTIMAT" value={fmt(calc.total)} total />

                    <p className="text-xs text-slate-400 mt-4 text-center">
                      * Estimare orientativă, exclusiv comision MC SUA și eventuale reparații
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-3">
              <p className="text-sm text-slate-500">
                Ai găsit o mașină pe Copart sau IAAI? Trimite-ne link-ul și îți oferim consultanță gratuită.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white w-full h-14 text-base font-semibold shadow-lg shadow-accent/25">
                <Link href="/contact" className="flex items-center justify-center gap-2">
                  Solicită consultanță gratuită
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* ── How customs work section ───────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-center mb-10">
            Cum se calculează taxele de import?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <DollarSign className="h-6 w-6 text-accent" />,
                title: "1. Taxe platformă",
                desc: "Copart și IAAI aplică taxe de cumpărător pe baza prețului adjudecat, conform unui barem progresiv.",
              },
              {
                icon: <Ship className="h-6 w-6 text-accent" />,
                title: "2. Transport & Freight",
                desc: "Mașina este transportată la portul din SUA, apoi cu nava până în portul Bremerhaven, Germania.",
              },
              {
                icon: <FileText className="h-6 w-6 text-accent" />,
                title: "3. Vamă UE",
                desc: "Taxă vamală 6.5% + TVA 19% calculate pe valoarea CIF (prețul + asigurare + transport).",
              },
              {
                icon: <Car className="h-6 w-6 text-accent" />,
                title: "4. Livrare în RO",
                desc: "Transport auto de la Bremerhaven la tine acasă, plus taxe RAR, omologare și înmatriculare.",
              },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6 pb-6">
                  <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4">{item.icon}</div>
                  <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
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
