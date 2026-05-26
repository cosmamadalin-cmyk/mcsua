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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiVehicle(v: any): Vehicle {
  const platformId = Number(v.platform_id ?? 0);
  const platformStr = String(v.platform || "").toLowerCase();
  const platform: "copart" | "iaai" =
    platformId === 2 || platformStr.includes("iaai") ? "iaai" : "copart";

  const lotNumber = String(v.lot_number || v.lot || "");
  const vin = String(v.vin || "");
  const slug = String(vin || v.slug_vin || v.slug || lotNumber);

  const media = v.media || {};
  let images: string[] = [];
  if (Array.isArray(media.thumbs)) {
    images = (media.thumbs as unknown[]).filter((s): s is string => typeof s === "string");
  } else if (Array.isArray(media.items)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images = (media.items as any[]).map((i) => String(i.full || i.large || i.thumb || "")).filter(Boolean);
  }

  const pricing = v.pricing || {};
  const bid = Number(pricing.current_bid_usd ?? pricing.current_bid2_usd ?? pricing.buy_now_usd ?? 0);
  const buyNow = pricing.buy_now_usd ? Number(pricing.buy_now_usd) : undefined;

  const condition = v.condition || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rcObj = condition.run_condition as any;
  const runCondition = rcObj && typeof rcObj === "object"
    ? String(rcObj.label || rcObj.value || "Unknown")
    : String(rcObj || "Unknown");

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

// ── Chip button helper ─────────────────────────────────────────────────────────
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active
          ? "bg-accent text-white border-accent"
          : "bg-white text-slate-600 border-slate-200 hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
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

// ── Vehicle card — layout tip listă ───────────────────────────────────────────
function VehicleCard({ v }: { v: Vehicle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="flex flex-row">
        {/* Imagine stânga — 200px fix */}
        <Link href={`/catalog/${v.slug}`} className="block flex-shrink-0 relative w-48 sm:w-52">
          <div className="h-full min-h-[148px] bg-slate-100 overflow-hidden relative">
            {!imgError && v.images[0] ? (
              <img
                src={v.images[0]}
                alt={`${v.year} ${v.make} ${v.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-10 w-10 text-slate-300" />
              </div>
            )}
            {/* Badges overlay */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <PlatformBadge platform={v.platform} />
            </div>
            {v.auctionDate && (
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {new Date(v.auctionDate).toLocaleDateString("ro-RO", {
                  day: "2-digit",
                  month: "short",
                })}
              </div>
            )}
          </div>
        </Link>

        {/* Detalii dreapta */}
        <CardContent className="flex-1 py-3 px-4 flex flex-col justify-between min-w-0">
          {/* Rând 1: titlu + titlu tip */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={`/catalog/${v.slug}`} className="hover:text-accent transition-colors min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-primary leading-tight truncate">
                {v.year} {v.make} {v.model}
                {v.trim ? ` ${v.trim}` : ""}
              </h3>
            </Link>
            <TitleBadge type={v.titleType} />
          </div>

          {/* Daune */}
          {v.damage && (
            <p className="text-xs text-amber-600 font-medium mb-2 flex items-center gap-1 truncate">
              <AlertTriangle className="h-3 w-3 flex-shrink-0" />
              {v.damage}
            </p>
          )}

          {/* Grid spec-uri */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Gauge className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span>{v.odometer.toLocaleString("ro-RO")} {v.odometerUnit}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span className="truncate">{v.state || v.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Fuel className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span>{tFuel(v.fuelType)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {v.runCondition?.toLowerCase().includes("runs") ? (
                <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-green-500" />
              ) : (
                <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-500" />
              )}
              <span className="truncate">{tCondition(v.runCondition)}</span>
            </div>
            {v.engine && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2">
                <Car className="h-3 w-3 flex-shrink-0 text-slate-400" />
                <span className="truncate">{v.engine}</span>
              </div>
            )}
          </div>

          {/* Pret + butoane */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div>
              <p className="text-xs text-slate-400 leading-none mb-0.5">Bid curent</p>
              <p className="text-lg font-extrabold text-accent leading-none">
                ${v.estimatedBid.toLocaleString("ro-RO")}
              </p>
              {v.buyNow && (
                <p className="text-xs text-green-600 font-semibold mt-0.5">
                  Buy Now: ${v.buyNow.toLocaleString("ro-RO")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={v.auctionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-accent transition-colors font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-white text-xs h-8 px-3">
                <Link href={`/catalog/${v.slug}`}>
                  Detalii
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ── Skeleton list ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white animate-pulse flex flex-row h-[148px]">
      <div className="w-48 sm:w-52 flex-shrink-0 bg-slate-200" />
      <div className="flex-1 p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 bg-slate-100 rounded" />
          ))}
        </div>
        <div className="flex justify-between items-end pt-2">
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// ── Ani pentru select ──────────────────────────────────────────────────────────
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => String(CURRENT_YEAR - i));

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [platform, setPlatform] = useState<Platform>("all");
  const [titleFilter, setTitleFilter] = useState<TitleType>("all");
  const [makeFilter, setMakeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [transFilter, setTransFilter] = useState("");
  const [condFilter, setCondFilter] = useState("");
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
      if (yearFrom) params.set("year_from", yearFrom);
      if (yearTo) params.set("year_to", yearTo);
      if (fuelFilter) params.set("fuel_type", fuelFilter);
      if (transFilter) params.set("transmission", transFilter);
      if (condFilter) params.set("run_cond", condFilter);
      params.set("per_page", String(PER_PAGE));
      params.set("lot_sub_status", "Open");

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Eroare ${res.status}`);
      }
      const data = await res.json();

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
  }, [platform, titleFilter, makeFilter, maxPrice, yearFrom, yearTo, fuelFilter, transFilter, condFilter, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const resetPage = () => setPage(1);

  const resetAllFilters = () => {
    setPlatform("all");
    setTitleFilter("all");
    setMakeFilter("");
    setMaxPrice("");
    setYearFrom("");
    setYearTo("");
    setFuelFilter("");
    setTransFilter("");
    setCondFilter("");
    setPage(1);
  };

  const hasActiveFilters = platform !== "all" || titleFilter !== "all" || makeFilter || maxPrice
    || yearFrom || yearTo || fuelFilter || transFilter || condFilter;

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

      {/* ── Filtre ── */}
      <section className="bg-white border-b border-slate-100 shadow-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 space-y-2">
          {/* Rând 1: Platform | Title | Marcă | Preț | Count */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Platform */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 text-sm font-semibold">
              {(["all", "copart", "iaai"] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPlatform(p); resetPage(); }}
                  className={`px-3 py-1.5 transition-all ${
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
                  onClick={() => { setTitleFilter(t); resetPage(); }}
                  className={`px-3 py-1.5 transition-all ${
                    titleFilter === t ? "bg-accent text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t === "all" ? "Toate titlurile" : t === "clean" ? "✓ Clean" : "⚠ Salvage"}
                </button>
              ))}
            </div>

            {/* Marcă */}
            <div className="relative min-w-[150px] max-w-[200px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Marcă..."
                value={makeFilter}
                onChange={(e) => { setMakeFilter(e.target.value); resetPage(); }}
                className="pl-8 h-8 text-sm border-slate-200"
              />
            </div>

            {/* Preț max */}
            <div className="relative min-w-[120px] max-w-[150px]">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <Input
                type="number"
                placeholder="Preț max"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); resetPage(); }}
                className="pl-6 h-8 text-sm border-slate-200"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-slate-400 hover:text-accent transition-colors underline"
                >
                  Resetează
                </button>
              )}
              <p className="text-sm text-slate-400 hidden sm:block">
                {isLoading ? "Se caută..." : `${total.toLocaleString("ro-RO")} loturi`}
              </p>
            </div>
          </div>

          {/* Rând 2: Carusel chip-uri — An, Combustibil, Transmisie, Stare */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div className="flex gap-2 items-center pb-1">
              {/* Separator label */}
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex-shrink-0">An:</span>
              <select
                value={yearFrom}
                onChange={(e) => { setYearFrom(e.target.value); resetPage(); }}
                className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white text-slate-600 cursor-pointer"
              >
                <option value="">De la</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={yearTo}
                onChange={(e) => { setYearTo(e.target.value); resetPage(); }}
                className="h-7 text-xs border border-slate-200 rounded-lg px-2 bg-white text-slate-600 cursor-pointer"
              >
                <option value="">Până la</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>

              <span className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex-shrink-0">Combustibil:</span>
              {[
                { label: "Benzină", val: "gas" },
                { label: "Diesel", val: "diesel" },
                { label: "Electric", val: "electric" },
                { label: "Hibrid", val: "hybrid" },
              ].map(({ label, val }) => (
                <Chip key={val} active={fuelFilter === val} onClick={() => { setFuelFilter(fuelFilter === val ? "" : val); resetPage(); }}>
                  {label}
                </Chip>
              ))}

              <span className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex-shrink-0">Transmisie:</span>
              {[
                { label: "Automată", val: "automatic" },
                { label: "Manuală", val: "manual" },
              ].map(({ label, val }) => (
                <Chip key={val} active={transFilter === val} onClick={() => { setTransFilter(transFilter === val ? "" : val); resetPage(); }}>
                  {label}
                </Chip>
              ))}

              <span className="w-px h-5 bg-slate-200 mx-1 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex-shrink-0">Stare:</span>
              {[
                { label: "Pornește și merge", val: "run" },
                { label: "Staționar", val: "stationary" },
              ].map(({ label, val }) => (
                <Chip key={val} active={condFilter === val} onClick={() => { setCondFilter(condFilter === val ? "" : val); resetPage(); }}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lista ── */}
      <section className="container mx-auto px-4 sm:px-6 py-8">
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
          <div className="flex flex-col gap-3 max-w-5xl mx-auto">
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
          <div className="flex flex-col gap-3 max-w-5xl mx-auto">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}

        {/* Paginare */}
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
