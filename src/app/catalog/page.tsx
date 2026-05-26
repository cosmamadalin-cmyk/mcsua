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

// ── API response mapper ────────────────────────────────────────────────────────
// Apibara răspunde cu structură nested conform documentației:
// slug_vin, platform_id (1=Copart,2=IAAI), pricing.current_bid,
// media.images[], condition.*, vehicle_specs.*, sale_document.name, etc.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiVehicle(v: any): Vehicle {
  // Platform: platform_id 1=Copart, 2=IAAI; sau string platform
  const platformId = Number(v.platform_id ?? 0);
  const platformStr = (v.platform || v.auction_type || v.source || "").toLowerCase();
  const platform: "copart" | "iaai" =
    platformId === 2 || platformStr.includes("iaai") ? "iaai" : "copart";

  const lotNumber = String(v.lot_number || v.lot || v.lot_id || "");
  const vin = v.vin || "";

  // slug_vin este identificatorul unic din apibara (ex: "2021-bmw-x5-5UXCR6C02M9D12345")
  const slug = v.slug_vin || v.slug || vin || lotNumber || v.id;

  // Imagini: media.images[] sau media.image_urls[] sau flat images[]
  const media = v.media || {};
  const rawImages =
    media.images || media.image_urls || media.photos ||
    v.images || v.photos || [];
  const images: string[] = Array.isArray(rawImages)
    ? rawImages
        .map((img: unknown) =>
          typeof img === "string" ? img : (img as { url?: string; src?: string })?.url || (img as { src?: string })?.src || ""
        )
        .filter(Boolean)
    : v.image ? [v.image] : [];

  // Preț: pricing.current_bid sau flat current_bid
  const pricing = v.pricing || {};
  const bid = Number(
    pricing.current_bid ?? pricing.buy_now_price ??
    v.current_bid ?? v.bid_amount ?? v.estimated_bid ?? 0
  );
  const buyNow = pricing.buy_now_price ? Number(pricing.buy_now_price) : v.buy_now_price ? Number(v.buy_now_price) : undefined;

  // Condiție: condition.*
  const condition = v.condition || {};
  const runCondRaw = condition.run_condition || v.run_condition || v.run_drive || "";
  const runCondition = typeof runCondRaw === "boolean"
    ? (runCondRaw ? "Runs and Drives" : "Stationary")
    : String(runCondRaw || "Unknown");

  // Specificații: vehicle_specs.*
  const specs = v.vehicle_specs || {};
  const fuelType = specs.fuel_type || v.fuel || v.fuel_type || "Gasoline";
  const transmission = specs.transmission || v.transmission || "Automatic";
  const engine = specs.engine || specs.engine_size || v.engine || undefined;

  // Titlu vehicul: sale_document.name sau title_type
  const saleDoc = v.sale_document || {};
  const titleType = saleDoc.name || saleDoc.type || v.title_type || v.title || "Salvage Title";

  // Daune: condition.loss sau primary_damage
  const damage = condition.loss || v.primary_damage || v.damage || "";

  // Locație: location.display sau flat location
  const loc = v.location || {};
  const locationDisplay = typeof loc === "string" ? loc : loc.display || loc.city || v.yard || "";
  const state = loc.state || v.state || v.state_code || "";

  // Odometru: odometer.mi sau odometer.km
  const odoObj = v.odometer || {};
  const odometer = typeof odoObj === "number" ? odoObj
    : Number(odoObj.mi ?? odoObj.km ?? v.odometer_value ?? v.odometer ?? 0);
  const odometerUnit = odoObj.km !== undefined && odoObj.mi === undefined ? "km" : "mi";

  // Chei: condition.key
  const hasKey = condition.key === "With" || condition.key === true || v.has_keys ?? v.has_key ?? true;

  // Data licitație: auction.date sau sale_date
  const auction = v.auction || {};
  const auctionDate = auction.date || auction.sale_date || v.sale_date || v.auction_date || undefined;

  return {
    id: String(v.id || lotNumber || vin || Math.random()),
    slug,
    platform,
    lotNumber,
    vin,
    year: Number(v.year) || 0,
    make: v.make || "",
    model: v.model || "",
    trim: v.trim || undefined,
    color: specs.color || v.color || v.primary_color || undefined,
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
    engine,
    runCondition,
    auctionUrl:
      v.auction_url || v.lot_url ||
      (platform === "iaai"
        ? `https://www.iaai.com/vehauto/${lotNumber}`
        : `https://www.copart.com/lot/${lotNumber}`),
  };
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
            <span>{v.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {v.runCondition === "Runs and Drives" ? (
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            )}
            <span>{v.runCondition === "Runs and Drives" ? "Pornește" : "Staționar"}</span>
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
      if (platform !== "all") params.set("auction_type", platform);
      if (titleFilter === "clean") params.set("title_type", "clean");
      if (titleFilter === "salvage") params.set("title_type", "salvage");
      if (makeFilter.trim()) params.set("make", makeFilter.trim());
      if (maxPrice) params.set("price_max", maxPrice);
      params.set("page", String(page));
      params.set("per_page", String(PER_PAGE));
      params.set("lot_status", "open");

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Eroare ${res.status}`);
      }
      const data = await res.json();

      // Handle different response envelope shapes from apibara
      const rawList: unknown[] = data.vehicles ?? data.data ?? data.lots ?? data.results ?? [];
      const mappedVehicles = Array.isArray(rawList) ? rawList.map(mapApiVehicle) : [];
      const tot = Number(data.total ?? data.meta?.total ?? rawList.length);
      const pages = Number(data.total_pages ?? data.meta?.last_page ?? Math.ceil(tot / PER_PAGE)) || 1;

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
          