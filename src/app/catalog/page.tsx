"use client";

/**
 * Catalog mașini – Copart & IAAI
 *
 * INTEGRARE API LIVE:
 * Această pagină este pregătită pentru integrarea cu apibara.tech (Vehicle Auction Data API).
 *
 * Pași pentru activare:
 * 1. Creează cont pe https://apibara.tech/en/register
 * 2. Alege planul Basic ($25/lună) sau testează gratuit (100 req/lună)
 * 3. Adaugă cheia API în .env.local:  NEXT_PUBLIC_APIBARA_KEY=your_key_here
 * 4. Decomentează secțiunea "API LIVE" de mai jos și comentează "MOCK DATA"
 *
 * Endpoint principal:
 *   GET https://apibara.tech/api/v1/vehicles
 *   Header: X-API-Key: YOUR_API_KEY
 *   Params: make, model, year_from, year_to, price_min, price_max, auction_type (copart|iaai), etc.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
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
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Platform = "all" | "copart" | "iaai";
type TitleType = "all" | "clean" | "salvage";

interface Vehicle {
  id: string;
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
  titleType: "Clean Title" | "Salvage Title" | "Rebuilt";
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

// ── Mock data (înlocuiește cu API live) ────────────────────────────────────────
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    platform: "copart",
    lotNumber: "78691915",
    vin: "WBA4J1C54KBM14523",
    year: 2019,
    make: "BMW",
    model: "430i xDrive",
    color: "Alpine White",
    odometer: 62400,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Front End",
    estimatedBid: 8500,
    auctionDate: "2026-05-28",
    location: "Gibsonia",
    state: "PA",
    images: ["https://ugc.same-assets.com/GvkfqDF9viiJszbsNYv0xg4Xg0lXTNrM.webp"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L 4-cyl",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.copart.com/lot/78691915",
  },
  {
    id: "2",
    platform: "iaai",
    lotNumber: "44912614",
    vin: "WDDM3BE85KF783192",
    year: 2019,
    make: "Mercedes-Benz",
    model: "C 300 4Matic",
    color: "Obsidian Black",
    odometer: 129755,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Rear End",
    estimatedBid: 7200,
    auctionDate: "2026-05-29",
    location: "Fredericksburg",
    state: "TX",
    images: ["https://ugc.same-assets.com/JWBzYEkBkA3odEudcZ0A165U2DDFTNRK.jpeg"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L 4-cyl Turbo",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.iaai.com/vehauto/44912614",
  },
  {
    id: "3",
    platform: "copart",
    lotNumber: "44757219",
    vin: "WDDZF4KB2HA177786",
    year: 2017,
    make: "Mercedes-Benz",
    model: "E 300 4Matic",
    color: "Iridium Silver",
    odometer: 136627,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Water/Flood",
    estimatedBid: 4800,
    auctionDate: "2026-05-30",
    location: "Medford",
    state: "PA",
    images: ["https://ugc.same-assets.com/wA67-6xSFxho_86Ky3jcZcNvRVrBw8KQ.jpeg"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L 4-cyl",
    runCondition: "Stationary",
    auctionUrl: "https://www.copart.com/lot/44757219",
  },
  {
    id: "4",
    platform: "iaai",
    lotNumber: "45118518",
    vin: "5J6RT6H59NL811645",
    year: 2022,
    make: "Honda",
    model: "CR-V Hybrid EX",
    color: "Sonic Gray",
    odometer: 138046,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Front End",
    estimatedBid: 11500,
    auctionDate: "2026-05-28",
    location: "Lorain",
    state: "OH",
    images: ["https://ugc.same-assets.com/XMebOolGfJSHW93R5khFwCazlssqiFr0.png"],
    hasKey: false,
    fuelType: "Hybrid",
    transmission: "Automatic",
    engine: "2.0L Hybrid",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.iaai.com/vehauto/45118518",
  },
  {
    id: "5",
    platform: "copart",
    lotNumber: "46676983",
    vin: "WBA4J3C52KB061086",
    year: 2019,
    make: "BMW",
    model: "430i Gran Coupe xDrive",
    color: "Black Sapphire",
    odometer: 116877,
    odometerUnit: "km",
    titleType: "Clean Title",
    damage: "Minor Dents/Scratches",
    estimatedBid: 15000,
    buyNow: 18500,
    auctionDate: "2026-05-31",
    location: "Gibsonia",
    state: "TX",
    images: ["https://ugc.same-assets.com/8Kfe7YqF4VLTQpBR4v_mCL8NI8DSTeam.png"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L 4-cyl",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.copart.com/lot/46676983",
  },
  {
    id: "6",
    platform: "copart",
    lotNumber: "45892301",
    vin: "WBAJB0C51JB084522",
    year: 2018,
    make: "BMW",
    model: "530e xDrive",
    color: "Mineral White",
    odometer: 78200,
    odometerUnit: "km",
    titleType: "Clean Title",
    damage: "Minor Dents/Scratches",
    estimatedBid: 19500,
    auctionDate: "2026-06-02",
    location: "Chicago",
    state: "IL",
    images: ["https://ugc.same-assets.com/C64Tg9tJG4XtbTRb8VNmdES36k_q7Bep.jpeg"],
    hasKey: true,
    fuelType: "Hybrid",
    transmission: "Automatic",
    engine: "2.0L Hybrid",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.copart.com/lot/45892301",
  },
  {
    id: "7",
    platform: "iaai",
    lotNumber: "46001122",
    vin: "WAUTPAF46KA061224",
    year: 2019,
    make: "Audi",
    model: "A4 Premium Plus",
    color: "Daytona Gray",
    odometer: 95400,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Side",
    estimatedBid: 9800,
    auctionDate: "2026-05-29",
    location: "Dallas",
    state: "TX",
    images: ["https://ugc.same-assets.com/dqE8AbVAK_SGFUqdwK4bb2aSBytqJ0fz.jpeg"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "2.0L TFSI",
    runCondition: "Runs and Drives",
    auctionUrl: "https://www.iaai.com/vehauto/46001122",
  },
  {
    id: "8",
    platform: "copart",
    lotNumber: "47123009",
    vin: "1C4RJFBG9KC815522",
    year: 2019,
    make: "Jeep",
    model: "Grand Cherokee Limited",
    color: "Granite Crystal",
    odometer: 142000,
    odometerUnit: "km",
    titleType: "Salvage Title",
    damage: "Rollover",
    estimatedBid: 6500,
    auctionDate: "2026-06-03",
    location: "Atlanta",
    state: "GA",
    images: ["https://ugc.same-assets.com/JxtP4cKqHgRKtIwawrzC9WCJh340LFyV.jpeg"],
    hasKey: true,
    fuelType: "Gasoline",
    transmission: "Automatic",
    engine: "3.6L V6",
    runCondition: "Stationary",
    auctionUrl: "https://www.copart.com/lot/47123009",
  },
];

// ── Title badge ────────────────────────────────────────────────────────────────
function TitleBadge({ type }: { type: string }) {
  const isClean = type === "Clean Title";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
      isClean ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
    }`}>
      {isClean ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {type}
    </span>
  );
}

// ── Platform badge ─────────────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform: "copart" | "iaai" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
      platform === "copart" ? "bg-blue-600 text-white" : "bg-red-600 text-white"
    }`}>
      {platform === "copart" ? "Copart" : "IAAI"}
    </span>
  );
}

// ── Vehicle card ───────────────────────────────────────────────────────────────
function VehicleCard({ v }: { v: Vehicle }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
        {!imgError ? (
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
        {/* Date overlay */}
        {v.auctionDate && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(v.auctionDate).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
          </div>
        )}
      </div>

      <CardContent className="pt-4 pb-5 px-5">
        {/* Title */}
        <h3 className="font-bold text-base text-primary leading-tight mb-1">
          {v.year} {v.make} {v.model}
          {v.trim ? ` ${v.trim}` : ""}
        </h3>

        {/* Damage */}
        <p className="text-xs text-amber-600 font-medium mb-3 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {v.damage}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Gauge className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>{v.odometer.toLocaleString("ro-RO")} {v.odometerUnit}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>{v.location}, {v.state}</span>
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
            <p className="text-xs text-slate-400 mb-0.5">Estimare bid</p>
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
              <Link href="/contact">
                Vreau consultanță
              </Link>
            </Button>
            <a
              href={v.auctionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-accent transition-colors font-medium"
            >
              <ExternalLink className="h-3 w-3" />
              Vezi pe {v.platform === "copart" ? "Copart" : "IAAI"}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [platform, setPlatform] = useState<Platform>("all");
  const [titleFilter, setTitleFilter] = useState<TitleType>("all");
  const [makeFilter, setMakeFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);
  const PER_PAGE = 6;

  // Filter logic
  const filtered = MOCK_VEHICLES.filter((v) => {
    if (platform !== "all" && v.platform !== platform) return false;
    if (titleFilter === "clean" && v.titleType !== "Clean Title") return false;
    if (titleFilter === "salvage" && v.titleType !== "Salvage Title") return false;
    if (makeFilter && !`${v.make} ${v.model}`.toLowerCase().includes(makeFilter.toLowerCase())) return false;
    if (maxPrice && v.estimatedBid > parseInt(maxPrice)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
            Browsează loturi disponibile pe Copart și IAAI. Trimite-ne link-ul și primești consultanță gratuită.
          </p>

          {/* API notice */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2.5 text-sm text-amber-200">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>
              Momentan afișăm exemple reprezentative. Catalogul live cu date reale se activează cu cheia API.
            </span>
          </div>
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
                  onClick={() => { setPlatform(p); resetPage(); }}
                  className={`px-4 py-2 transition-all ${
                    platform === p
                      ? "bg-accent text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
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
                  className={`px-3 py-2 transition-all ${
                    titleFilter === t
                      ? "bg-accent text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
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
                onChange={(e) => { setMakeFilter(e.target.value); resetPage(); }}
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
                onChange={(e) => { setMaxPrice(e.target.value); resetPage(); }}
                className="pl-7 h-9 text-sm border-slate-200"
              />
            </div>

            <p className="text-sm text-slate-400 ml-auto">
              {filtered.length} loturi găsite
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="container mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">
            <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin opacity-40" />
            <p>Se încarcă loturi...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Car className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium mb-2">Nu am găsit loturi</p>
            <p className="text-sm">Încearcă să ajustezi filtrele</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {paginated.map((v) => (
              <VehicleCard key={v.id} v={v} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
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

      {/* ── API activation CTA ── */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-primary rounded-3xl p-8 sm:p-10 text-white shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Activează catalogul live</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Cu un abonament la <strong className="text-white">apibara.tech</strong> ($25/lună),
                catalogul se conectează live la Copart și IAAI și afișează toate loturile disponibile
                cu filtre avansate, imagini reale și prețuri actualizate.
              </p>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" /> 30.000 request-uri/lună</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" /> Search cu 20+ filtre</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" /> Date live Copart + IAAI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" /> 100 req/lună gratuit pentru test</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://apibara.tech/en/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-all shadow-lg"
              >
                Creează cont pe apibara.tech
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="text-xs text-slate-400 text-center">
                După ce obții cheia API, echipa MC SUA o integrează în câteva minute.
              </p>
            </div>
          </div>
        </div>
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
          <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90 h-14 px-10 font-bold text-base shadow-xl">
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
