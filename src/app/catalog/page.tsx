"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Car, Fuel, Gauge, MapPin, Calendar, AlertTriangle,
  CheckCircle2, ArrowRight, RefreshCw, ChevronLeft, ChevronRight,
  ExternalLink, Zap, Info, ChevronDown, X, SlidersHorizontal,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Vehicle {
  id: string; slug: string; platform: "copart" | "iaai"; lotNumber: string; vin: string;
  year: number; make: string; model: string; trim?: string; color?: string;
  odometer: number; odometerUnit: string; titleType: string; damage: string;
  estimatedBid: number; buyNow?: number; auctionDate?: string;
  location: string; state: string; images: string[]; hasKey: boolean;
  fuelType: string; transmission: string; engine?: string; runCondition: string; auctionUrl: string;
}

interface MakeOption { name: string; models: string[]; }
interface FiltersMeta {
  makes: MakeOption[]; vehicle_types: string[]; fuel_types: string[];
  transmissions: string[]; drive_types: string[]; run_conditions: string[];
  damages: string[]; colors: string[]; cylinders: string[];
}

// ── Filters state ──────────────────────────────────────────────────────────────
interface Filters {
  search: string; platform: string; lotStatus: string; subStatus: string;
  make: string; model: string; vehicleType: string;
  yearFrom: string; yearTo: string; priceMin: string; priceMax: string;
  odoFrom: string; odoTo: string; engineSizeFrom: string; engineSizeTo: string;
  engineHpFrom: string; engineHpTo: string;
  color: string; fuel: string; transmission: string; drive: string;
  condition: string; damage: string; cylinders: string; hasKey: string; titleType: string;
}

const DEFAULT_FILTERS: Filters = {
  search: "", platform: "", lotStatus: "", subStatus: "Open",
  make: "", model: "", vehicleType: "",
  yearFrom: "", yearTo: "", priceMin: "", priceMax: "",
  odoFrom: "", odoTo: "", engineSizeFrom: "", engineSizeTo: "",
  engineHpFrom: "", engineHpTo: "",
  color: "", fuel: "", transmission: "", drive: "",
  condition: "", damage: "", cylinders: "", hasKey: "", titleType: "",
};

// ── API mapper ──────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiVehicle(v: any): Vehicle {
  const platformId = Number(v.platform_id ?? 0);
  const platformStr = String(v.platform || "").toLowerCase();
  const platform: "copart" | "iaai" = platformId === 2 || platformStr.includes("iaai") ? "iaai" : "copart";
  const lotNumber = String(v.lot_number || v.lot || "");
  const vin = String(v.vin || "");
  const slug = String(vin || v.slug_vin || v.slug || lotNumber);
  const media = v.media || {};
  let images: string[] = [];
  if (Array.isArray(media.thumbs)) images = (media.thumbs as unknown[]).filter((s): s is string => typeof s === "string");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  else if (Array.isArray(media.items)) images = (media.items as any[]).map((i) => String(i.full || i.large || i.thumb || "")).filter(Boolean);
  const pricing = v.pricing || {};
  const bid = Number(pricing.current_bid_usd ?? pricing.current_bid2_usd ?? pricing.buy_now_usd ?? 0);
  const buyNow = pricing.buy_now_usd ? Number(pricing.buy_now_usd) : undefined;
  const condition = v.condition || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rcObj = condition.run_condition as any;
  const runCondition = rcObj && typeof rcObj === "object" ? String(rcObj.label || rcObj.value || "Unknown") : String(rcObj || "Unknown");
  const specs = v.vehicle_specs || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engObj = specs.engine as any;
  const engine = engObj && typeof engObj === "object" ? String(engObj.raw || (engObj.size_l ? `${engObj.size_l}L` : "") || "") : (engObj ? String(engObj) : undefined);
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
    id: String(v.id || lotNumber || vin || Math.random()), slug, platform, lotNumber, vin,
    year: Number(v.year) || 0, make: String(v.make || ""), model: String(v.model || ""),
    trim: v.trim ? String(v.trim) : undefined, color: specs.exterior_color ? String(specs.exterior_color) : undefined,
    odometer, odometerUnit, titleType, damage, estimatedBid: bid, buyNow, auctionDate,
    location: locationDisplay, state, images, hasKey, fuelType, transmission,
    engine: engine || undefined, runCondition,
    auctionUrl: platform === "iaai" ? `https://www.iaai.com/vehauto/${lotNumber}` : `https://www.copart.com/lot/${lotNumber}`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFiltersMeta(raw: any): FiltersMeta {
  // Structura REALA din API (verificat cu test endpoint):
  // response.data.make_model.makes = ["ACURA", "BMW", ...]
  // response.data.make_model.models_by_make = { "BMW": ["X3","X5",...], ... }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = raw?.data ?? raw ?? {};
  const makeModel = data?.make_model ?? {};

  // makes = array de string-uri din make_model.makes
  const makesArr: string[] = Array.isArray(makeModel?.makes) ? makeModel.makes : [];

  // models_by_make = obiect din make_model.models_by_make
  const modelsByMake: Record<string, string[]> = makeModel?.models_by_make ?? {};

  const makes: MakeOption[] = makesArr
    .map((name: string) => ({
      name,
      models: Array.isArray(modelsByMake[name]) ? modelsByMake[name] : [],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function toStrArr(arr: unknown): string[] {
    if (!Array.isArray(arr)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (arr as any[]).map((x: any) => String(x?.name ?? x?.value ?? x?.label ?? x)).filter(Boolean);
  }

  const extra = data?.extra_filters ?? data?.filters ?? data?.options ?? data ?? {};
  return {
    makes,
    vehicle_types: toStrArr(extra?.types ?? extra?.vehicle_types ?? extra?.type ?? []),
    fuel_types: toStrArr(extra?.fuel_types ?? extra?.fuel_type ?? extra?.fuels ?? []),
    transmissions: toStrArr(extra?.transmissions ?? extra?.transmission ?? []),
    drive_types: toStrArr(extra?.drive_types ?? extra?.drive_type ?? extra?.drives ?? []),
    run_conditions: toStrArr(extra?.run_conditions ?? extra?.run_condition ?? extra?.conditions ?? []),
    damages: toStrArr(extra?.damages ?? extra?.damage ?? []),
    colors: toStrArr(extra?.colors ?? extra?.color ?? []),
    cylinders: toStrArr(extra?.cylinders ?? extra?.cylinder ?? []),
  };
}

// ── Traduceri ──────────────────────────────────────────────────────────────────
const FUEL_RO: Record<string, string> = { "Gasoline": "Benzină", "Gas": "Benzină", "Diesel": "Diesel", "Electric": "Electric", "Hybrid": "Hibrid", "Flex": "Flex" };
const TRANS_RO: Record<string, string> = { "Automatic": "Automată", "Manual": "Manuală", "CVT": "CVT" };
function tFuel(v: string) { return FUEL_RO[v] || v; }
function tCondition(v: string): string {
  const vl = v.toLowerCase();
  if (vl.includes("runs")) return "Pornește și merge";
  if (vl.includes("stationary") || vl.includes("static")) return "Staționar";
  if (vl.includes("enhanced")) return "Enhanced";
  return v;
}

// ── UI helpers ─────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{children}</p>;
}

function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(value === o.value ? "" : o.value)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            value === o.value ? "bg-accent text-white border-accent" : "bg-white text-slate-600 border-slate-200 hover:border-accent"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SelectFilter({ label, value, onChange, options, placeholder = "Toate" }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer transition-colors ${
            value ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function RangeInputs({ label, fromVal, toVal, onFromChange, onToChange, fromPlaceholder, toPlaceholder, type = "number" }: {
  label: string; fromVal: string; toVal: string;
  onFromChange: (v: string) => void; onToChange: (v: string) => void;
  fromPlaceholder?: string; toPlaceholder?: string; type?: string;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex gap-1.5">
        <input
          type={type} value={fromVal} onChange={(e) => onFromChange(e.target.value)}
          placeholder={fromPlaceholder || "De la"}
          className="flex-1 h-8 px-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-accent"
        />
        <input
          type={type} value={toVal} onChange={(e) => onToChange(e.target.value)}
          placeholder={toPlaceholder || "Până la"}
          className="flex-1 h-8 px-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

// ── Filter Panel ───────────────────────────────────────────────────────────────
function FilterPanel({
  filters, setFilters, filtersMeta, filtersLoading, onReset, total, isLoading,
}: {
  filters: Filters; setFilters: (f: Filters) => void;
  filtersMeta: FiltersMeta; filtersLoading: boolean;
  onReset: () => void; total: number; isLoading: boolean;
}) {
  const set = (key: keyof Filters) => (val: string) => setFilters({ ...filters, [key]: val });
  const [moreOpen, setMoreOpen] = useState(false);

  const availableModels = filters.make
    ? (filtersMeta.makes.find((m) => m.name === filters.make)?.models ?? [])
    : [];

  // Valori exacte din documentatia Apibara /vehicles endpoint
  const fuelOptions = filtersMeta.fuel_types.length > 0 ? filtersMeta.fuel_types
    : ["Gasoline", "Diesel", "Hybrid", "Electric", "Flexible"];
  const transOptions = filtersMeta.transmissions.length > 0 ? filtersMeta.transmissions
    : ["Automatic", "Manual", "Unknown"];
  const driveOptions = filtersMeta.drive_types.length > 0 ? filtersMeta.drive_types
    : ["AWD", "FWD", "RWD"];
  const condOptions = filtersMeta.run_conditions.length > 0 ? filtersMeta.run_conditions
    : ["RUNS AND DRIVES", "STATIONARY", "NO INFORMATION", "ENGINE START PROGRAM"];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <span className="font-bold text-sm text-primary">Filtre</span>
        </div>
        <button type="button" onClick={onReset} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="px-4 py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Search */}
        <div>
          <SectionLabel>Caută</SectionLabel>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text" value={filters.search}
              onChange={(e) => set("search")(e.target.value)}
              placeholder="VIN, lot, model..."
              className="w-full h-8 pl-8 pr-3 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-accent"
            />
            {filters.search && (
              <button type="button" onClick={() => set("search")("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Lot Status */}
        <div>
          <SectionLabel>Tip licitație</SectionLabel>
          <ToggleGroup
            value={filters.lotStatus}
            onChange={set("lotStatus")}
            options={[{ label: "Toate", value: "" }, { label: "Buy Now", value: "Buy Now" }, { label: "Timed", value: "Timed" }]}
          />
        </div>

        {/* Sub Status */}
        <div>
          <SectionLabel>Status</SectionLabel>
          <ToggleGroup
            value={filters.subStatus}
            onChange={(v) => set("subStatus")(v || "Open")}
            options={[{ label: "Deschis", value: "Open" }, { label: "Live", value: "Live" }, { label: "Încheiat", value: "Ended" }]}
          />
        </div>

        {/* Auction Type */}
        <div>
          <SectionLabel>Platformă</SectionLabel>
          <ToggleGroup
            value={filters.platform}
            onChange={set("platform")}
            options={[{ label: "Toate", value: "" }, { label: "Copart", value: "1" }, { label: "IAAI", value: "2" }]}
          />
        </div>

        {/* Make */}
        <div>
          <SectionLabel>Marcă</SectionLabel>
          <div className="relative">
            <select
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value, model: "" })}
              disabled={filtersLoading}
              className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer transition-colors ${
                filters.make ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"
              } ${filtersLoading ? "opacity-50" : ""}`}
            >
              <option value="">{filtersLoading ? "Se încarcă..." : "Toate mărcile"}</option>
              {filtersMeta.makes.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Model — apare după ce se selectează marca */}
        {filters.make && (
          <div>
            <SectionLabel>Model</SectionLabel>
            <div className="relative">
              <select
                value={filters.model}
                onChange={(e) => set("model")(e.target.value)}
                className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer transition-colors ${
                  filters.model ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"
                }`}
              >
                <option value="">Toate modelele</option>
                {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Vehicle Type */}
        <SelectFilter
          label="Tip caroserie"
          value={filters.vehicleType}
          onChange={set("vehicleType")}
          options={filtersMeta.vehicle_types.length > 0 ? filtersMeta.vehicle_types : ["Sedan", "SUV", "Truck", "Van", "Coupe", "Convertible", "Wagon", "Hatchback"]}
        />

        {/* Year */}
        <RangeInputs
          label="An fabricație"
          fromVal={filters.yearFrom} toVal={filters.yearTo}
          onFromChange={set("yearFrom")} onToChange={set("yearTo")}
          fromPlaceholder="1990" toPlaceholder="2026"
        />

        {/* Price */}
        <RangeInputs
          label="Preț (USD)"
          fromVal={filters.priceMin} toVal={filters.priceMax}
          onFromChange={set("priceMin")} onToChange={set("priceMax")}
          fromPlaceholder="$0" toPlaceholder="$100,000"
        />

        {/* Odometer */}
        <RangeInputs
          label="Kilometraj (mi)"
          fromVal={filters.odoFrom} toVal={filters.odoTo}
          onFromChange={set("odoFrom")} onToChange={set("odoTo")}
          fromPlaceholder="0 mi" toPlaceholder="250,000 mi"
        />

        {/* Engine Size */}
        <RangeInputs
          label="Capacitate motor (L)"
          fromVal={filters.engineSizeFrom} toVal={filters.engineSizeTo}
          onFromChange={set("engineSizeFrom")} onToChange={set("engineSizeTo")}
          fromPlaceholder="0" toPlaceholder="10"
        />

        {/* Engine HP */}
        <RangeInputs
          label="Putere (HP)"
          fromVal={filters.engineHpFrom} toVal={filters.engineHpTo}
          onFromChange={set("engineHpFrom")} onToChange={set("engineHpTo")}
          fromPlaceholder="0" toPlaceholder="1000"
        />

        {/* ── More filters (expandable) ── */}
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className="flex items-center justify-between w-full text-sm font-semibold text-slate-600 hover:text-accent transition-colors"
          >
            <span>Mai multe filtre</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
          </button>

          {moreOpen && (
            <div className="mt-3 space-y-3">
              {/* Color */}
              <SelectFilter
                label="Culoare"
                value={filters.color}
                onChange={set("color")}
                options={filtersMeta.colors.length > 0 ? filtersMeta.colors : ["Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Gold", "Brown", "Orange"]}
              />

              {/* Fuel */}
              <div>
                <SectionLabel>Combustibil</SectionLabel>
                <div className="relative">
                  <select
                    value={filters.fuel}
                    onChange={(e) => set("fuel")(e.target.value)}
                    className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer ${filters.fuel ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"}`}
                  >
                    <option value="">Toate</option>
                    {fuelOptions.map((o) => <option key={o} value={o}>{tFuel(o)}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Transmission */}
              <div>
                <SectionLabel>Transmisie</SectionLabel>
                <div className="relative">
                  <select
                    value={filters.transmission}
                    onChange={(e) => set("transmission")(e.target.value)}
                    className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer ${filters.transmission ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"}`}
                  >
                    <option value="">Toate</option>
                    {transOptions.map((o) => <option key={o} value={o}>{TRANS_RO[o] || o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Drive Type */}
              <div>
                <SectionLabel>Tracțiune</SectionLabel>
                <div className="relative">
                  <select
                    value={filters.drive}
                    onChange={(e) => set("drive")(e.target.value)}
                    className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer ${filters.drive ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"}`}
                  >
                    <option value="">Toate</option>
                    {driveOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Running Condition */}
              <div>
                <SectionLabel>Stare motor</SectionLabel>
                <div className="relative">
                  <select
                    value={filters.condition}
                    onChange={(e) => set("condition")(e.target.value)}
                    className={`w-full appearance-none h-8 pl-2.5 pr-7 text-xs border rounded-lg bg-white cursor-pointer ${filters.condition ? "border-accent text-primary font-semibold" : "border-slate-200 text-slate-500"}`}
                  >
                    <option value="">Toate</option>
                    {condOptions.map((o) => <option key={o} value={o}>{tCondition(o)}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Damage */}
              <SelectFilter
                label="Tip daune"
                value={filters.damage}
                onChange={set("damage")}
                options={filtersMeta.damages.length > 0 ? filtersMeta.damages : ["Mechanical", "Water", "Fire", "Hail", "Theft", "Rollover", "Chemical", "Vandalized", "Repossession"]}
              />

              {/* Cylinders */}
              <SelectFilter
                label="Cilindri"
                value={filters.cylinders}
                onChange={set("cylinders")}
                options={filtersMeta.cylinders.length > 0 ? filtersMeta.cylinders : ["3", "4", "5", "6", "8", "10", "12"]}
              />

              {/* Has Key */}
              <div>
                <SectionLabel>Cheie</SectionLabel>
                <ToggleGroup
                  value={filters.hasKey}
                  onChange={set("hasKey")}
                  options={[{ label: "Cu cheie", value: "With" }, { label: "Fără cheie", value: "No" }]}
                />
              </div>

              {/* Sale Document Type */}
              <div>
                <SectionLabel>Titlu proprietate</SectionLabel>
                <ToggleGroup
                  value={filters.titleType}
                  onChange={set("titleType")}
                  options={[{ label: "✓ Clean", value: "clean" }, { label: "⚠ Salvage", value: "salvage" }]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Rezultate count */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            {isLoading ? "Se caută..." : `${total.toLocaleString("ro-RO")} loturi găsite`}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Vehicle Card ───────────────────────────────────────────────────────────────
function VehicleCard({ v }: { v: Vehicle }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="flex flex-row">
        <Link href={`/catalog/${v.slug}`} className="block flex-shrink-0 relative w-44 sm:w-52">
          <div className="h-full min-h-[144px] bg-slate-100 overflow-hidden relative">
            {!imgError && v.images[0] ? (
              <img src={v.images[0]} alt={`${v.year} ${v.make} ${v.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgError(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Car className="h-10 w-10 text-slate-300" /></div>
            )}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${v.platform === "copart" ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
                {v.platform === "copart" ? "Copart" : "IAAI"}
              </span>
            </div>
            {v.auctionDate && (
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                {new Date(v.auctionDate).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
              </div>
            )}
          </div>
        </Link>
        <CardContent className="flex-1 py-3 px-4 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link href={`/catalog/${v.slug}`} className="hover:text-accent transition-colors min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-primary leading-tight truncate">
                {v.year} {v.make} {v.model}{v.trim ? ` ${v.trim}` : ""}
              </h3>
            </Link>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${v.titleType?.toLowerCase().includes("clean") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {v.titleType?.toLowerCase().includes("clean") ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {v.titleType}
            </span>
          </div>
          {v.damage && (
            <p className="text-xs text-amber-600 font-medium mb-2 flex items-center gap-1 truncate">
              <AlertTriangle className="h-3 w-3 flex-shrink-0" />{v.damage}
            </p>
          )}
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
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div>
              <p className="text-xs text-slate-400 leading-none mb-0.5">Bid curent</p>
              <p className="text-lg font-extrabold text-accent leading-none">${v.estimatedBid.toLocaleString("ro-RO")}</p>
              {v.buyNow && <p className="text-xs text-green-600 font-semibold mt-0.5">Buy Now: ${v.buyNow.toLocaleString("ro-RO")}</p>}
            </div>
            <div className="flex items-center gap-2">
              <a href={v.auctionUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-white text-xs h-8 px-3">
                <Link href={`/catalog/${v.slug}`}>Detalii <ArrowRight className="h-3 w-3 ml-1" /></Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white animate-pulse flex flex-row h-[144px]">
      <div className="w-44 sm:w-52 flex-shrink-0 bg-slate-200" />
      <div className="flex-1 p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-3 bg-slate-100 rounded" />)}
        </div>
        <div className="flex justify-between items-end pt-2">
          <div className="h-5 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersMeta, setFiltersMeta] = useState<FiltersMeta>({ makes: [], vehicle_types: [], fuel_types: [], transmissions: [], drive_types: [], run_conditions: [], damages: [], colors: [], cylinders: [] });
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const PER_PAGE = 12;

  // Incarc filtrele de la Apibara
  useEffect(() => {
    fetch("/api/vehicles/filters").then((r) => r.json()).then((data) => setFiltersMeta(parseFiltersMeta(data))).catch(() => {}).finally(() => setFiltersLoading(false));
  }, []);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const p = new URLSearchParams();
      if (filters.search) p.set("s", filters.search);
      if (filters.platform) p.set("auction_type", filters.platform);
      if (filters.lotStatus) p.set("lot_status", filters.lotStatus);
      p.set("lot_sub_status", filters.subStatus || "Open");
      if (filters.make) p.set("make", filters.make);
      if (filters.model) p.set("model", filters.model);
      if (filters.vehicleType) p.set("type", filters.vehicleType);
      if (filters.yearFrom) p.set("year_from", filters.yearFrom);
      if (filters.yearTo) p.set("year_to", filters.yearTo);
      if (filters.priceMin) p.set("price_min", filters.priceMin);
      if (filters.priceMax) p.set("price_max", filters.priceMax);
      if (filters.odoFrom) p.set("odometer_from", filters.odoFrom);
      if (filters.odoTo) p.set("odometer_to", filters.odoTo);
      if (filters.engineSizeFrom) p.set("engine_size_from", filters.engineSizeFrom);
      if (filters.engineSizeTo) p.set("engine_size_to", filters.engineSizeTo);
      if (filters.engineHpFrom) p.set("engine_hp_from", filters.engineHpFrom);
      if (filters.engineHpTo) p.set("engine_hp_to", filters.engineHpTo);
      if (filters.color) p.append("color[]", filters.color);
      if (filters.fuel) p.append("fuel_type[]", filters.fuel);
      if (filters.transmission) p.append("transmission[]", filters.transmission);
      if (filters.drive) p.append("drive_type[]", filters.drive);
      if (filters.condition) p.set("run_cond", filters.condition);
      if (filters.damage) p.append("damage[]", filters.damage);
      if (filters.cylinders) p.append("cylinders[]", filters.cylinders);
      if (filters.hasKey) p.set("has_key", filters.hasKey);
      if (filters.titleType) p.set("sale_document_type", filters.titleType);
      p.set("page", String(page));
      p.set("per_page", String(PER_PAGE));

      const res = await fetch(`/api/vehicles?${p.toString()}`);
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Eroare ${res.status}`); }
      const data = await res.json();
      const rawList: unknown[] = data.data ?? data.vehicles ?? data.lots ?? data.results ?? [];
      const mapped = Array.isArray(rawList) ? rawList.map(mapApiVehicle) : [];
      const tot = Number(data.meta?.total ?? data.total ?? rawList.length);
      setVehicles(mapped); setTotal(tot); setTotalPages(Math.max(1, Math.ceil(tot / PER_PAGE) || 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu s-au putut încărca datele."); setVehicles([]); setTotal(0); setTotalPages(1);
    } finally { setIsLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleSetFilters = (f: Filters) => { setFilters(f); setPage(1); };
  const resetFilters = () => { setFilters(DEFAULT_FILTERS); setPage(1); };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-slate-800 to-slate-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4 text-sm font-medium">
            <Zap className="h-4 w-4 text-yellow-300" /><span>Loturi live Copart & IAAI</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">Catalog Mașini din SUA</h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-5">Browsează loturi disponibile pe Copart și IAAI. Intră pe orice mașină și vezi estimarea costului total până în România.</p>
          {!isLoading && total > 0 && (
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-2 text-sm text-green-200">
              <CheckCircle2 className="h-4 w-4" /><span>{total.toLocaleString("ro-RO")} loturi active găsite</span>
            </div>
          )}
        </div>
      </section>

      {/* Mobile filter button */}
      <div className="lg:hidden sticky top-[73px] z-30 bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between shadow-sm">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-accent hover:text-accent transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filtre
        </button>
        <p className="text-sm text-slate-400">{isLoading ? "Se caută..." : `${total.toLocaleString("ro-RO")} loturi`}</p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 flex gap-6 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-[89px]">
          <FilterPanel filters={filters} setFilters={handleSetFilters} filtersMeta={filtersMeta} filtersLoading={filtersLoading} onReset={resetFilters} total={total} isLoading={isLoading} />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {error ? (
            <div className="text-center py-20">
              <Info className="h-10 w-10 mx-auto mb-3 text-red-400 opacity-70" />
              <p className="text-lg font-medium mb-2 text-red-600">Eroare la încărcare</p>
              <p className="text-sm mb-4 text-slate-400">{error}</p>
              <button onClick={fetchVehicles} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm hover:border-accent hover:text-accent transition-colors">
                <RefreshCw className="h-4 w-4" /> Reîncearcă
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col gap-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium mb-2">Nu am găsit loturi</p>
              <p className="text-sm mb-4">Încearcă să ajustezi filtrele</p>
              <button onClick={resetFilters} className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm hover:bg-accent/90">
                <X className="h-4 w-4" /> Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {vehicles.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
          )}

          {/* Paginare */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pages = Math.min(totalPages, 7);
                let n: number;
                if (pages <= 7) n = i + 1;
                else if (i === 0) n = 1;
                else if (i === pages - 1) n = totalPages;
                else n = Math.max(2, Math.min(totalPages - 1, page - 2 + i));
                return n;
              }).map((n, idx, arr) => (
                <span key={`${n}-${idx}`} className="inline-flex items-center gap-1">
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span className="text-slate-300 text-sm">…</span>}
                  <button type="button" onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === n ? "bg-accent text-white shadow-md" : "border border-slate-200 text-slate-600 hover:border-accent hover:text-accent"}`}>
                    {n}
                  </button>
                </span>
              ))}
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-slate-50 overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-bold text-primary">Filtre</span>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel filters={filters} setFilters={(f) => { handleSetFilters(f); }} filtersMeta={filtersMeta} filtersLoading={filtersLoading} onReset={resetFilters} total={total} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-accent to-blue-700 py-12 mt-8">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ai găsit o mașină interesantă?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">Trimite-ne link-ul lotului și în câteva ore îți spunem dacă merită — gratuit, fără obligații.</p>
          <Button asChild size="lg" className="bg-white text-accent hover:bg-white/90 h-14 px-10 font-bold text-base shadow-xl">
            <Link href="/contact" className="flex items-center gap-2">Trimite link-ul acum<ArrowRight className="h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
