"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Car,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Zap,
  Info,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Platform = "all" | "copart" | "iaai";
type TitleType = "all" | "clean" | "salvage";

export interface Vehicle {
  id: string;
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
  runCondition: string;
  auctionUrl: string;
}

// ── API response mapper ─────────────────────────────────────────────────────────
// Bazat pe raspunsul REAL confirmat din browser:
// media.thumbs=string[], pricing.current_bid_usd, condition.run_condition={value,label},
// vehicle_specs.engine={raw,size_l}, location={display,send_from,state}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiVehicle(v: any): Vehicle {
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

  // Pret: pricing.current_bid_usd (poate fi null) → buy_now_usd
  const pricing = v.pricing || {};
  const bid = Number(pricing.current_bid_usd ?? pricing.current_bid2_usd ?? pricing.buy_now_usd ?? 0);
  const buyNow = pricing.buy_now_usd ? Number(pricing.buy_now_usd) : undefined;

  // Conditie: condition.run_condition este OBIECT {value, label, class_hint}
  const condition = v.condition || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rcObj = condition.run_condition as any;
  const runCondition = rcObj && typeof rcObj === "object"
    ? String(rcObj.label || rcObj.value || "Unknown")
    : String(rcObj || "Unknown");

  // Specs: vehicle_specs.engine este OBIECT {raw, size_l, hp, layout}
  const specs = v.vehicle_specs || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engObj = specs.engine as any;
  const engine = engObj && typeof engObj === "object"
    ? String(engObj.raw || (engObj.size_l ? `${engObj.size_l}L` : "") || "")
    : (engObj ? String(engObj) : undefined);
  const fuelType = String(specs.fuel_type || "Gasoline");
  const transmission = String(specs.transmission || "Automatic");

  const saleDoc = v.sale_document || {};
  const titleType = String(saleDoc.name || "Salvage Title");
  const damage = String(condition.primary_damage || condition.loss || "");

  // Locatie: location={display,send_from,state}
  const locRaw = v.location;
  const locationDisplay = !locRaw ? "" : typeof locRaw === "string" ? locRaw : String(locRaw.display || "");
  const state = !locRaw || typeof locRaw === "string" ? "" : String(locRaw.state || "");

  const odoObj = v.odometer || {};
  const odometer = typeof odoObj === "number" ? odoObj : Number(odoObj.mi ?? odoObj.km ?? 0);
  const odometerUnit = odoObj.km !== undefined && odoObj.mi === undefined ? "km" : "mi";

  const hasKey = condition.has_key === true || condition.has_key === "With";

  const auction = v.auction || {};
  const auctionDateRaw = auction.full_date || auction.date || v.auction_date || "";
  const auctionDate = auctionDateRaw ? String(auctionDateRaw) : undefined;

  return {
    id: String(v.id || lotNumber || vin || Math.random()),
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
    estimatedBid: bid,
    buyNow,
    auctionDate,
    location: locationDisplay,
    state,
    images,
    hasKey,
    fuelType,
    transmission,
    engine: engine || undefined,
    runCondition,
    auctionUrl: platform === "iaai"
      ? `https://www.iaai.com/vehauto/${lotNumber}`
      : `https://www.copart.com/lot/${lotNumber}`,
  };
}


// ── Traduceri română ──────────────────────────────────────────────────────────
function tFuel(v: string): string {
  const m: Record<string, string> = {
    "Gas": "Benzină", "Gasoline": "Benzină", "gas": "Benzină",
    "Diesel": "Diesel", "diesel": "Diesel",
    "Electric": "Electric", "electric": "Electric",
    "Hybrid": "Hibrid", "hybrid": "Hibrid",
    "Flexible": "Flex", "flexible": "Flex",
  };
  return m[v] || v;
}
function tTransmission(v: string): string {
  const m: Record<string, string> = {
    "Automatic": "Automată", "Manual": "Manuală", "manual": "Manuală",
    "automatic": "Automată",
  };
  return m[v] || v;
}
function tCondition(v: string): string {
  const vl = v.toLowerCase();
  if (vl.includes("runs")) return "Pornește și merge";
  if (vl.includes("stationary") || vl.includes("static")) return "Staționar";
  if (vl.includes("no info") || vl.includes("engine start")) return "Fără info";
  return v;
}

// ── Title badge ────────────────────────────────────────────────────────────────
function TitleBadge({ type }: { type: string }) {
  const isClean = type?.toLowerCase().includes("clean");
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isClean ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {isClean ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {type}
    </span>
  );
}

// ── Platform badge ─────────────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: "copart" | "iaai" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
        platform === "copart" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      {platform === "copart" ? "Copart" : "IAAI"}
    </span>
  );
}

// ── Vehicle card ───────────────────────────────────────────────────────────────
function VehicleCard({ v }: { v: Vehicle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {/* Image — clicking goes to detail page */}
      <Link href={`/catalog/${v.slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
          {!imgError && v.images[0] ? (
            <img
              src={v.images[0]}
              alt={`${v.year} ${v.make} ${v.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="h-12 w-12 text-slate-300" />
            </div>
          )}
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <PlatformBadge platform={v.platform} />
            <TitleBadge type={v.titleType} />
          </div>
          {v.buyNow && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Buy Now
            </div>
          )}
          {v.auctionDate && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(v.auctionDate).toLocaleDateString("ro-RO", {
                day: "2-digit",
                month: "short",
              })}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="pt-4 pb-5 px-5">
        {/* Title */}
        <Link href={`/catalog/${v.slug}`} className="block hover:text-accent transition-colors">
          <h3 className="font-bold text-base text-primary leading-tight mb-1">
            {v.year} {v.make} {v.model}
            {v.trim ? ` ${v.trim}` : ""}
          </h3>
        </Link>

        {/* Damage */}
        <p className="text-xs text-amber-600 font-medium mb-3 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {v.damage}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Gauge className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>
              {v.odometer.toLocaleString("ro-RO")} {v.odometerUnit}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>
              {v.location}
              {v.state ? `, ${v.state}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Fuel className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>{tFuel(v.fuelType)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {v.runCondition === "Runs and Drives" ? (
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            )}
            <span>{tCondition(v.runCondition)}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Bid curent</p>
            <p className="text-xl font-extrabold text-accent">
              ${v.estimatedBid.toLocaleString("ro-RO")}
            </p>
            {v.buyNow && (
              <p className="text-xs text-green-600 font-semibold">
                Buy Now: ${v.buyNow.toLocaleString("ro-RO")}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-white text-xs h-8 px-3">
              <Link href={`/catalog/${v.slug}`}>Vezi detalii</Link>
            </Button>
            <a
              href={v.auctionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-accent transition-colors font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              {v.platform === "copart" ? "Copart" : "IAAI"}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border-0 shadow-lg bg-white animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-slate-100 rounded" />
          ))}
        </div>
        <div className="flex justify-between items-end pt-1">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-100 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [platform, setPlatform] = useState<Platform>("all");
  const [titleFilter, setTitleFilter] = useState<TitleType>("all");
  const [makeFilter, setMakeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PER_PAGE = 12;

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (platform === "copart") params.set("auction_type", "1");
      else if (platform === "iaai") params.set("auction_type", "2");
      if (makeFilter.trim()) params.set("make", makeFilter.trim().toUpperCase());
      if (maxPrice) params.set("price_max", maxPrice);
      params.set("per_page", String(PER_PAGE));
      params.set("lot_sub_status", "Open");

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Eroare ${res.status}`);
      }
      const data = await res.json();

      // Handle different response envelope shapes from apibara
      const rawList: unknown[] = data.data ?? data.vehicles ?? data.lots ?? data.results ?? [];
      const mappedVehicles = Array.isArray(rawList) ? rawList.map(mapApiVehicle) : [];
      const tot = Number(data.meta?.total ?? data.total ?? rawList.length);
      const pages = Math.max(1, Math.ceil(tot / PER_PAGE) || 1);

      setVehicles(mappedVehicles);
      setTotal(tot);
      setTotalPages(pages);
    } catch (err) {
      console.error("Catalog fetch error:", err);
      setError(err instanceof Error ? err.message : "Nu s-au putut încărca datele.");
      setVehicles([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [platform, titleFilter, makeFilter, maxPrice, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const resetPage = () => setPage(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary via-slate-800 to-slate-900 text-white py-14 sm:py-18">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-sm font-medium">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span>Loturi live Copart & IAAI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Catalog Mașini din SUA
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-6">
            Browsează loturi disponibile pe Copart și IAAI. Intră pe orice mașină și vezi estimarea costului
            total până în România.
          </p>
          {!isLoading && total > 0 && (
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2.5 text-sm text-green-200">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{total.toLocaleString("ro-RO")} loturi active găsite</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="bg-white border-b border-slate-100 shadow-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Platform */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
              {(["all", "copart", "iaai"] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPlatform(p);
                    resetPage();
                  }}
                  className={`px-4 py-2 transition-all ${
                    platform === p ? "bg-accent text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p === "all" ? "Toate" : p === "copart" ? "Copart" : "IAAI"}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
              {(["all", "clean", "salvage"] as TitleType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTitleFilter(t);
                    resetPage();
                  }}
                  className={`px-3 py-2 transition-all ${
                    titleFilter === t ? "bg-accent text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t === "all" ? "Toate titlurile" : t === "clean" ? "✓ Clean" : "⚠ Salvage"}
                </button>
              ))}
            </div>

            {/* Make search */}
            <div className="relative flex-1 min-w-[160px] max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Marcă / model..."
                value={makeFilter}
                onChange={(e) => {
                  setMakeFilter(e.target.value);
                  resetPage();
                }}
                className="pl-9 h-9 text-sm border-slate-200"
              />
            </div>

            {/* Max price */}
            <div className="relative min-w-[140px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">$</span>
              <Input
                type="number"
                placeholder="Preț max..."
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  resetPage();
                }}
                className="pl-7 h-9 text-sm border-slate-200"
              />
            </div>

            <p className="text-sm text-slate-400 ml-auto hidden sm:block">
              {isLoading ? "Se caută..." : `${total.toLocaleString("ro-RO")} loturi`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="container mx-auto px-4 sm:px-6 py-10">
        {error ? (
          <div className="text-center py-20 text-slate-500">
            <Info className="h-10 w-10 mx-auto mb-3 text-red-400 opacity-70" />
            <p className="text-lg font-medium mb-2 text-red-600">Eroare la încărcare</p>
            <p className="text-sm mb-4 text-slate-400">{error}</p>
            <Button onClick={fetchVehicles} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reîncearcă
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium mb-2">Nu am găsit loturi</p>
            <p className="text-sm">Încearcă să ajustezi filtrele</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              // Show first, last, and pages around current
              const pages = Math.min(totalPages, 7);
              let n: number;
              if (pages <= 7) {
                n = i + 1;
              } else if (i === 0) {
                n = 1;
              } else if (i === pages - 1) {
                n = totalPages;
              } else {
                n = Math.max(2, Math.min(totalPages - 1, page - 2 + i));
              }
              return n;
            }).map((n, idx, arr) => (
              <span key={`${n}-${idx}`} className="inline-flex items-center gap-1">
                {idx > 0 && arr[idx - 1] !== n - 1 && (
                  <span className="text-slate-300 text-sm">…</span>
                )}
                <button
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    page === n
                      ? "bg-accent text-white shadow-md shadow-accent/25"
                      : "border border-slate-200 text-slate-600 hover:border-accent hover:text-accent"
                  }`}
                >
                  {n}
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-accent to-blue-700 py-12">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ai găsit o mașină interesantă pe Copart sau IAAI?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Trimite-ne link-ul lotului și în câteva ore îți spunem dacă merită — gratuit, fără obligații.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-accent hover:bg-white/90 h-14 px-10 font-bold text-base shadow-xl"
          >
            <Link href="/contact" className="flex items-center gap-2">
              Trimite link-ul acum
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
