import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  computeImportCost,
  type ImportCostVehicle,
  type ImportCostOptions,
} from "@/lib/import-cost";
import { translateTitle, translateDamage, translateRunCondition } from "@/lib/vehicle-normalize";

const client = new Anthropic({ apiKey: process.env.MCSUA_AI_KEY ?? "" });

// ── Rate limiting simplu în memorie (protecție credite) ─────────────────────────
const rateMap = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQ = 12;
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (rateMap.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  rateMap.set(ip, arr);
  return arr.length > MAX_REQ;
}

const SYSTEM_PROMPT = `Ești asistentul AI al MC SUA — companie specializată în importul de mașini din SUA (licitații Copart și IAAI) în România.

PERSONALITATE: Răspunzi profesional și calm. Folosești "dumneavoastră". Începi cu "Salutare!". Ești expert, cald, nu faci hype. Nu scrii liste lungi — răspunsuri concise și clare.
STIL: Poți folosi stilizare ușoară pentru claritate — **bold** pentru informații cheie (prețuri, modele) și link-uri markdown [text](url). Când menționezi o mașină din catalog, folosește ÎNTOTDEAUNA link clickable. Prezintă listele de mașini ca listă markdown cu liniuțe. Păstrează răspunsurile clare și la obiect, nu foarte lungi.

DESPRE MC SUA:
- Servicii complete: selecție + licitație, transport SUA→România, vămuire Rotterdam, reparație, omologare RAR, înmatriculare
- Comision fix MC SUA: 1.000€ (tot procesul inclus, fără surprize)
- Durată totală: 6-10 săptămâni
- Telefon: +40 764 806 987
- Locație: București
- Instagram: @auto_sua_auction

PROCESUL PAS CU PAS:
1. Client alege mașina sau spune ce vrea → MC SUA consultă și caută
2. MC SUA participă la licitație Copart/IAAI
3. Transport SUA → Rotterdam (variabil pe stat, ~4-6 săptămâni)
4. Vămuire Rotterdam: taxă vamală 10% + TVA 21% din valoarea CIF
5. Descărcare container: 500€
6. Transport Rotterdam → România: 850€ (opțional)
7. Reparație la service parteneri
8. Omologare RAR + înmatriculare completă

COSTURI STANDARD:
- Taxe licitație: 10% (IAAI) / 12% (Copart) din preț, minim $600
- Schimbare certificat salvage title: $550
- Transport SUA → Rotterdam: variabil pe stat, ~$1.500–$2.600
- Documentație export: $300
- Taxă port SUA (doar hibrid/electric): $400
- Descărcare container Rotterdam: 500€
- Comision MC SUA: 1.000€
- Transport România: 850€ (sedan), 900€ (SUV), 1.100€ (pickup)
- Taxă vamală: 10% din CIF
- TVA Rotterdam: 21% din (CIF + taxă vamală)
- Asigurare transport maritim: 1% din CIF (opțional)

REGULI IMPORTANTE:
- NU ești service autorizat RAR — omologarea se face LA RAR
- NU publici VIN-uri sau loturi complete ale clienților
- NU garantezi prețuri exacte — sunt estimări orientative
- Pentru detalii exacte trimite la calculator pe mcsua.ro sau la contact
- Când clientul vrea să vadă mașini → folosește search_cars
- Când întreabă cost import → folosește calculate_cost
- Când întreabă prețul mediu al unui model → folosește average_price
- Când clientul trimite un VIN, număr de lot, sau link (mcsua.ro, copart.com, iaai.com) → folosește IMEDIAT lookup_vehicle. NU cere detalii, extrage-le tu.

- TIP DE VÂNZARE — foarte important: există două categorii:
  • Buy Now (cumpărare imediată) = preț fix, o cumperi pe loc fără licitație.
  • Licitație = are un bid curent care crește până la închidere; prețul final e de obicei mai mare decât bid-ul curent.

- Când clientul caută mașini și NU a precizat ce vrea, întreabă-l ÎNTÂI, scurt: dorește mașini cu preț fix (Buy Now) sau loturi de licitație? Explică diferența într-o frază dacă pare că nu știe. Abia după răspuns cauți cu sale_type corespunzător (buy_now / auction). Dacă spune că nu contează sau vrea tot, folosește sale_type=any.

- Când afișezi rezultate, marchează clar fiecare mașină: 'Buy Now $X' (preț fix) sau 'Bid $Y' (licitație, prețul poate crește). Dacă a cerut licitații, amintește-i că bid-ul afișat e cel curent, nu final.

- Dacă clientul a precizat deja intenția (ex: 'vreau să cumpăr acum', 'ceva la licitație', 'buy now'), NU mai întreba — treci direct la căutare cu filtrul potrivit.

- La întrebarea 'cât ar ajunge la licitație', explică că bid-ul curent e minimul și prețul final depinde de cerere; folosește average_price ca reper pentru unde se vând de obicei modelele similare. Nu garanta un preț exact.
- FILTRE: aplică ÎNTOTDEAUNA în search_cars TOATE criteriile pe care le menționează clientul, nu ignora niciunul: kilometraj (odometer_max_km, în KM), combustibil (fuel: benzină=Gasoline, diesel=Diesel, hibrid=Hybrid, electric=Electric), tracțiune (drive: integrală=AWD, față=FWD, spate=RWD), cutie (transmission: automată=Automatic, manuală=Manual), an (year_from/year_to), preț maxim (price_max), tip vânzare (sale_type). Traduci termenii clientului în valorile de mai sus.
- Când clientul zice 'de la [an] în sus' / '[an]+', setează DOAR year_from (fără year_to). Nu restrânge la un singur an decât dacă cere explicit 'exact [an]'.
- Afișează primele 5 rezultate ca listă cu link-uri clickable, iar ULTIMUL rând este link-ul 'Vezi toată lista filtrată' generat de tool — păstrează-l mereu. Folosește numărul EXACT de mașini raportat de tool (nu inventa, nu număra doar cele afișate). Arată primele câteva și include mereu linkul 'Vezi toată lista filtrată' pentru restul.
- REZOLVAREA MODELULUI (obligatoriu): numele modelelor din catalog pot diferi de cum le scrie clientul (ex: clientul zice '430 ix', în catalog există '430I' și '430XI'; sau 'seria 4' = 430I/430XI/435I/440XI etc). Când clientul cere un model specific, ÎNAINTE de search_cars apelează ÎNTOTDEAUNA list_models(make, query) ca să vezi denumirile REALE. Dacă există un singur match clar, spune-i clientului ce filtru folosești ('Am găsit modelul 430XI în catalog') și caută cu acea denumire EXACTĂ. Dacă sunt mai multe variante plauzibile (ex: 430I și 430XI), ÎNTREABĂ clientul care dintre ele îl interesează, listându-le, apoi caută cu denumirea aleasă. NU ghici modelul din cunoștințele tale și NU căuta cu un nume neconfirmat. NU spune 'nu avem' până nu ai verificat cu list_models.
- CALCUL COST: când clientul întreabă de costul unei mașini specifice (a menționat una din listă, un VIN sau un link), folosește calculate_cost cu identifier ca să dai cifrele EXACTE ale acelei mașini, defalcate pe fiecare linie. Pentru întrebări generale (fără o mașină anume), folosește calculate_cost cu bid_price + platform.
- Când clientul vrea oferta completă, să meargă mai departe, sau detalii finale, oferă DOUĂ opțiuni clickable (NU email):
  • WhatsApp: [Scrie-ne pe WhatsApp](https://api.whatsapp.com/send/?phone=40764806987&text=Salutare%21+Ne+bucur%C4%83m+de+interesul+t%C4%83u+pentru+serviciile+MC+SUA+de+import+auto.%0ATrimite-ne+link-ul+ma%C8%99inii+dorite+de+pe+www.copart.com+sau+www.iaai.com+direct+%C3%AEn+acest+chat%2C+iar+noi+ne+ocup%C4%83m+de+verificarea+istoricului+%C8%99i+%C3%AE%C8%9Bi+oferim+feedback+%C3%AEn+cel+mai+scurt+timp%21&type=phone_number&app_absent=0)
  • Telefon: [+40 764 806 987](tel:+40764806987)`;

const tools: Anthropic.Tool[] = [
  {
    name: "search_cars",
    description: "Caută mașini disponibile la licitație Copart și IAAI",
    input_schema: {
      type: "object" as const,
      properties: {
        make: { type: "string", description: "Marca (ex: BMW, Toyota)" },
        model: { type: "string", description: "Modelul (ex: X5, Camry)" },
        year_from: { type: "number", description: "An minim" },
        year_to: { type: "number", description: "An maxim" },
        price_max: { type: "number", description: "Bid maxim USD" },
        sale_type: { type: "string", enum: ["any", "buy_now", "auction"], description: "Filtru: buy_now = doar cumpărare imediată, auction = doar licitații, any = toate" },
        odometer_max_km: { type: "number", description: "Kilometraj maxim în KM (ex: 100000)" },
        fuel: { type: "string", enum: ["Gasoline", "Diesel", "Hybrid", "Electric"], description: "Combustibil (benzină=Gasoline, diesel=Diesel)" },
        drive: { type: "string", enum: ["AWD", "FWD", "RWD"], description: "Tracțiune (integrală=AWD, față=FWD, spate=RWD)" },
        transmission: { type: "string", enum: ["Automatic", "Manual"], description: "Cutie (automată=Automatic, manuală=Manual)" },
      },
      required: [],
    },
  },
  {
    name: "calculate_cost",
    description: "Calculează costul total de import SUA→România, defalcat pe fiecare linie. Dacă e dat identifier (VIN/lot/link), folosește datele REALE ale acelei mașini.",
    input_schema: {
      type: "object" as const,
      properties: {
        identifier: { type: "string", description: "Opțional: VIN, lot sau link al unei mașini specifice. Dacă e prezent, se folosesc datele reale ale mașinii." },
        bid_price: { type: "number", description: "Prețul bid USD (când nu se dă identifier)" },
        platform: { type: "string", enum: ["copart", "iaai"], description: "Platforma (când nu se dă identifier)" },
        state: { type: "string", description: "Opțional: codul statului SUA (ex: NY, TX) pentru transport exact" },
        include_salvage_title: { type: "boolean" },
        include_ro_transport: { type: "boolean" },
      },
      required: [],
    },
  },
  {
    name: "average_price",
    description: "Prețul mediu de vânzare la licitație pentru un model",
    input_schema: {
      type: "object" as const,
      properties: {
        make: { type: "string" },
        model: { type: "string" },
      },
      required: ["make", "model"],
    },
  },
  {
    name: "lookup_vehicle",
    description: "Caută și verifică o mașină specifică după VIN, număr de lot, sau link (mcsua.ro, copart.com, iaai.com). Returnează an, marcă, model, tip titlu, daune, rulaj, chei, stare, motor, locație, preț.",
    input_schema: {
      type: "object" as const,
      properties: {
        identifier: { type: "string", description: "VIN, număr de lot, sau URL complet al mașinii" },
      },
      required: ["identifier"],
    },
  },
  {
    name: "list_models",
    description: "Returnează lista REALĂ de modele disponibile în catalog pentru o marcă, ca să potrivești corect ce a cerut clientul (ex: '430ix' → '430I' sau '430XI'). Folosește-l ÎNTOTDEAUNA înainte de search_cars când clientul cere un model specific.",
    input_schema: {
      type: "object" as const,
      properties: {
        make: { type: "string", description: "Marca (ex: BMW)" },
        query: { type: "string", description: "Textul aproximativ al modelului cerut de client (ex: 430ix, seria 4)" },
      },
      required: ["make"],
    },
  },
];

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const base = "https://mcsua.ro";

  if (name === "search_cars") {
    const p = new URLSearchParams();
    if (input.make) p.set("make", String(input.make));
    if (input.model) p.set("model", String(input.model));
    if (input.year_from) p.set("year_from", String(input.year_from));
    if (input.year_to) p.set("year_to", String(input.year_to));
    const priceMax = input.price_max ? Number(input.price_max) : 0;
    const saleType = String(input.sale_type || "any");
    if (priceMax && saleType !== "buy_now") p.set("price_max", String(priceMax));
    if (input.fuel) p.append("fuel_type[]", String(input.fuel));
    if (input.drive) p.append("drive_type[]", String(input.drive));
    if (input.transmission) p.append("transmission[]", String(input.transmission));
    if (saleType === "buy_now") p.set("lot_status", "Buy Now");
    else if (saleType === "auction") p.set("lot_status", "Timed");
    p.set("per_page", "20");
    p.set("lot_sub_status", "Open");

    const res = await fetch(`${base}/api/vehicles?${p}`);
    const data = await res.json();
    let vehicles: any[] = data.data || [];

    const buyNowOf = (v: any) => Number(v.pricing?.buy_now_usd ?? v.pricing?.buy_now_price ?? 0);
    const bidOf = (v: any) => Number(v.pricing?.current_bid_usd ?? v.pricing?.current_bid ?? 0);
    const odoKmOf = (v: any) => {
      const mi = typeof v.odometer === "number" ? v.odometer : (v.odometer?.mi ?? v.odometer?.km ?? 0);
      return mi ? Math.round(Number(mi) * 1.609) : 0;
    };

    // Kilometraj filtrat LA NOI, lenient: păstrăm mașinile cu km necunoscut (0)
    const kmMax = input.odometer_max_km ? Number(input.odometer_max_km) : 0;
    if (kmMax) vehicles = vehicles.filter(v => { const km = odoKmOf(v); return km === 0 || km <= kmMax; });

    if (saleType === "buy_now") {
      vehicles = vehicles.filter(v => buyNowOf(v) > 0 && (!priceMax || buyNowOf(v) <= priceMax)).sort((a, b) => buyNowOf(a) - buyNowOf(b));
    } else if (saleType === "auction") {
      vehicles = vehicles.sort((a, b) => bidOf(a) - bidOf(b));
    }

    if (!vehicles.length) return "Nu am găsit mașini cu aceste criterii momentan.";
    const total = vehicles.length;
    const shown = vehicles.slice(0, 6);

    const lines = shown.map((v: any) => {
      const vin = v.vin || v.lot_number;
      const buyNow = buyNowOf(v);
      const priceStr = buyNow > 0 ? "Buy Now $" + buyNow.toLocaleString() : "Bid $" + bidOf(v).toLocaleString();
      const loc = typeof v.location === "string" ? v.location : (v.location?.display || "");
      const km = odoKmOf(v);
      const odoStr = km ? `${km.toLocaleString()} km` : "km necunoscut";
      const title = v.sale_document?.name || v.title_type || v.title || v.damage || "";
      return `- [${v.year} ${v.make} ${v.model}${v.trim ? " " + v.trim : ""}](https://mcsua.ro/catalog/${vin}) — ${priceStr} — ${odoStr} — ${loc}${title ? " — " + title : ""}`;
    });

    // Deep-link catalog cu nume camelCase (formatul pe care îl citește pagina catalog)
    const cp = new URLSearchParams();
    if (input.make) cp.set("make", String(input.make));
    if (input.model) cp.set("model", String(input.model));
    if (input.year_from) cp.set("yearFrom", String(input.year_from));
    if (input.year_to) cp.set("yearTo", String(input.year_to));
    if (priceMax) cp.set("priceMax", String(priceMax));
    if (kmMax) cp.set("odoTo", String(Math.round(kmMax / 1.609)));
    if (input.fuel) cp.set("fuel", String(input.fuel));
    if (input.drive) cp.set("drive", String(input.drive));
    if (input.transmission) cp.set("transmission", String(input.transmission));
    if (saleType === "buy_now") cp.set("lotStatus", "Buy Now");
    else if (saleType === "auction") cp.set("lotStatus", "Timed");

    const header = total > shown.length
      ? `Am găsit ${total} mașini care se potrivesc. Primele ${shown.length} (cele mai ieftine întâi):`
      : `Am găsit ${total} mașini:`;
    lines.push(`- [Vezi toată lista filtrată pe mcsua.ro](https://mcsua.ro/catalog?${cp.toString()})`);
    return header + "\n" + lines.join("\n");
  }

  if (name === "calculate_cost") {
    const opts: ImportCostOptions = {};
    if (input.include_salvage_title !== undefined) opts.includeSalvageTitle = input.include_salvage_title === true;
    if (input.include_ro_transport !== undefined) opts.includeRoTransport = input.include_ro_transport === true;

    let vehicleForCalc: ImportCostVehicle;
    let label = "mașină";

    const idRaw = input.identifier ? String(input.identifier).trim() : "";
    if (idRaw) {
      let id = "";
      const vinMatch = idRaw.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
      const lotMatch = idRaw.match(/lot\/(\d+)/i);
      if (vinMatch) id = vinMatch[0];
      else if (lotMatch) id = lotMatch[1];
      else if (idRaw.includes("/")) id = idRaw.split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
      else id = idRaw;
      if (!id) return "Nu am putut identifica mașina pentru calcul. Trimiteți VIN-ul, lotul sau linkul.";
      const res = await fetch(`${base}/api/vehicles/${encodeURIComponent(id)}`);
      if (!res.ok) return `Nu am găsit mașina (${id}) pentru a calcula costul.`;
      const data = await res.json();
      const v = data.data ?? data.vehicle ?? data;
      if (!v || (!v.make && !v.vin)) return "Nu am găsit detalii pentru această mașină ca să calculez costul.";
      const platformId = Number(v.platform_id ?? 0);
      const platformStr = String(v.platform || "").toLowerCase();
      const platform: "copart" | "iaai" = platformId === 2 || platformStr.includes("iaai") ? "iaai" : "copart";
      const pr = v.pricing || {};
      const bid = Number(pr.current_bid_usd ?? pr.current_bid ?? pr.buy_now_usd ?? pr.buy_now_price ?? 0);
      const specs = v.vehicle_specs || {};
      const loc = typeof v.location === "string" ? v.location : (v.location?.display || "");
      const st = typeof v.location === "string" ? "" : String(v.location?.state || "");
      vehicleForCalc = {
        estimatedBid: bid,
        platform,
        location: loc,
        state: st,
        fuelType: String(specs.fuel_type || v.fuel_type || ""),
        bodyType: String(specs.body_style || v.body_type || ""),
        titleType: String(v.sale_document?.name || v.title_type || v.title || ""),
      };
      label = `${v.year || ""} ${v.make || ""} ${v.model || ""}${v.trim ? " " + v.trim : ""}`.trim() || "mașină";
      if (input.bid_price) opts.bidPrice = Number(input.bid_price);
    } else {
      const bid = Number(input.bid_price) || 0;
      const platform: "copart" | "iaai" = String(input.platform || "copart") === "iaai" ? "iaai" : "copart";
      const st = input.state ? String(input.state) : "";
      vehicleForCalc = {
        estimatedBid: bid,
        platform,
        location: st,
        state: st,
        fuelType: "",
        bodyType: "",
        titleType: "salvage",
      };
      if (opts.includeSalvageTitle === undefined) opts.includeSalvageTitle = input.include_salvage_title !== false;
      if (opts.includeRoTransport === undefined) opts.includeRoTransport = input.include_ro_transport !== false;
      if (!st) opts.usaTransportOverride = 1600;
    }

    const r = computeImportCost(vehicleForCalc, opts);
    const eur = (n: number) => `€${Math.round(n).toLocaleString("ro-RO")}`;
    const usd = (n: number) => "$" + Math.round(n).toLocaleString("ro-RO");

    const usaLines: string[] = [
      `- Preț lot: ${usd(r.bidPrice)}`,
      `- Taxe licitație (${r.platform === "iaai" ? "IAAI 10%" : "Copart 12%"}, min. $600): ${usd(r.buyerFee)}`,
      `- Transport SUA → Rotterdam: ${r.usaTransportAvailable ? usd(r.usaTransport) : "De confirmat (depinde de stat)"}`,
    ];
    if (r.includePortTax) usaLines.push(`- Taxă port hibrid/electric: ${usd(r.portTax)}`);
    if (r.includeSalvageTitle) usaLines.push(`- Schimbare titlu salvage: ${usd(r.salvageTitleCost)}`);
    usaLines.push(`- Documentație export: ${usd(r.exportDocs)}`);
    usaLines.push(`- **Total SUA: ${usd(r.totalUSA)}** (≈ ${eur(r.cifEUR)})`);

    const euLines: string[] = [];
    if (r.includeInsurance) euLines.push(`- Asigurare maritimă (1%): ${eur(r.insurance)}`);
    euLines.push(`- Taxă vamală (10%): ${eur(r.customsDuty)}`);
    euLines.push(`- TVA (21%): ${eur(r.tva)}`);
    euLines.push(`- Comision MC SUA: ${eur(r.commissionMCSUA)}`);
    euLines.push(`- Manipulare în port: ${eur(r.portHandling)}`);
    if (r.includeRoTransport) euLines.push(`- Transport Rotterdam → România: ${eur(r.roTransport)}`);

    return `**Estimare cost import — ${label}**

Costuri SUA:
${usaLines.join("\n")}

Costuri UE:
${euLines.join("\n")}

**TOTAL GENERAL: ${eur(r.totalGeneral)}**

Estimare orientativă — prețuri exacte la consultanță.`;
  }

  if (name === "average_price") {
    const p = new URLSearchParams();
    if (input.make) p.set("make", String(input.make));
    if (input.model) p.set("model", String(input.model));
    const r = await fetch(`${base}/api/vehicles/stats?${p}`);
    const rd = await r.json();
    if (!rd.available) return `Nu am suficiente date de vânzări pentru ${input.make} ${input.model} momentan.`;
    return `Prețuri de vânzare la licitație pentru ${input.make} ${input.model}:
- Interval: $${rd.min?.toLocaleString()} – $${rd.max?.toLocaleString()}
- Medie: $${rd.avg?.toLocaleString()} (${rd.count} vânzări recente)
Sunt prețuri finale de licitație — costul de import se adaugă peste.`;
  }

  if (name === "lookup_vehicle") {
    const raw = String(input.identifier || "").trim();
    let id = "";
    const vinMatch = raw.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
    const lotMatch = raw.match(/lot\/(\d+)/i);
    if (vinMatch) id = vinMatch[0];
    else if (lotMatch) id = lotMatch[1];
    else if (raw.includes("/")) {
      id = raw.split("?")[0].split("#")[0].replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
    } else {
      id = raw;
    }
    if (!id) return "Nu am putut identifica mașina. Trimiteți VIN-ul, numărul de lot sau linkul complet.";
    const res = await fetch(`${base}/api/vehicles/${encodeURIComponent(id)}`);
    if (!res.ok) return `Nu am găsit mașina (${id}). Verificați VIN-ul/lotul sau trimiteți linkul complet.`;
    const data = await res.json();
    const v = data.data ?? data.vehicle ?? data;
    if (!v || (!v.make && !v.vin)) return "Nu am găsit detalii pentru această mașină momentan.";
    const pr = v.pricing || {};
    const cond = v.condition || {};
    const specs = v.vehicle_specs || {};
    const loc = typeof v.location === "string" ? v.location : (v.location?.display || "");
    const rawTitle = String(v.sale_document?.name || v.title_type || v.title || "");
    const title = rawTitle ? translateTitle(rawTitle).label : "-";
    const rawPrimaryDamage = String(cond.primary_damage || cond.loss || v.damage || "");
    const rawSecondaryDamage = String(cond.secondary_damage || cond.secondary_loss || "");
    const damageStr = rawPrimaryDamage ? translateDamage(rawPrimaryDamage) : "-";
    const rcObj = cond.run_condition;
    const rawRc = rcObj && typeof rcObj === "object" ? String(rcObj.label || rcObj.value || "") : String(rcObj ?? v.run_condition ?? "");
    const odoNum = typeof v.odometer === "number" ? v.odometer : (v.odometer?.mi ?? v.odometer?.km ?? 0);
    const bid = pr.current_bid_usd ?? pr.current_bid ?? 0;
    const slug = v.vin || v.lot_number;
    return `**${v.year || ""} ${v.make || ""} ${v.model || ""}${v.trim ? " " + v.trim : ""}**
VIN: ${v.vin || "-"} | Lot: ${v.lot_number || "-"} | ${v.platform || ""}
Titlu: ${title}
Daună: ${damageStr}${rawSecondaryDamage ? " + " + translateDamage(rawSecondaryDamage) : ""}
Rulaj: ${odoNum ? odoNum.toLocaleString() : "-"}
Stare: ${rawRc ? translateRunCondition(rawRc) : "-"}
Chei: ${cond.key ?? (v.has_key ? "Da" : "-")}
Motor: ${specs.engine || "-"} | ${specs.fuel_type || v.fuel_type || "-"} | ${specs.transmission || v.transmission || "-"}
Locație: ${loc || "-"}
Preț: ${"$"}${Number(bid).toLocaleString()}${pr.buy_now_usd ? " (Buy Now $" + Number(pr.buy_now_usd).toLocaleString() + ")" : ""}
Pagina: [vezi pe mcsua.ro](https://mcsua.ro/catalog/${slug})`;
  }

  if (name === "list_models") {
    const make = String(input.make || "").trim();
    if (!make) return "Lipsește marca.";
    const res = await fetch(`${base}/api/vehicles/filters`);
    if (!res.ok) return "Nu am putut încărca lista de modele momentan.";
    const data = await res.json();
    const mm = data?.data?.make_model ?? data?.make_model ?? {};
    const byMake = mm.models_by_make ?? {};
    const key = Object.keys(byMake).find(k => k.toLowerCase() === make.toLowerCase()) || make;
    const models: string[] = Array.isArray(byMake[key]) ? byMake[key] : [];
    if (!models.length) return `Nu am găsit lista de modele pentru ${make}.`;
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const q = norm(String(input.query || ""));
    if (!q) return `Modele ${key}: ${models.join(", ")}`;
    const digits = (q.match(/\d+/) || [""])[0];
    let matches = models.filter(m => {
      const nm = norm(m);
      return nm.includes(q) || q.includes(nm) || (digits && nm.startsWith(digits));
    });
    if (!matches.length) matches = models;
    return `Modele ${key} relevante pentru "${input.query || ""}": ${matches.slice(0, 40).join(", ")}`;
  }

  return "Tool necunoscut";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { message: "Ați trimis prea multe mesaje într-un timp scurt. Vă rugăm așteptați puțin sau contactați-ne direct la +40 764 806 987." },
      { status: 429 },
    );
  }

  if (!process.env.MCSUA_AI_KEY) {
    console.error("MCSUA_AI_KEY lipsește din environment");
    return NextResponse.json({ message: "Asistentul este temporar indisponibil (configurare). Vă rugăm contactați-ne la +40 764 806 987." }, { status: 200 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Cerere invalidă." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
    return NextResponse.json(
      { message: "Conversație invalidă. Reîncărcați pagina și încercați din nou." },
      { status: 400 },
    );
  }
  for (const m of messages) {
    const c = (m as { content?: unknown })?.content;
    if (typeof c !== "string" || c.length > 2000) {
      return NextResponse.json(
        { message: "Mesaj prea lung sau invalid. Vă rugăm scurtați mesajul." },
        { status: 400 },
      );
    }
  }

  // Taie istoricul la ultimele 20 de mesaje pentru a controla costul tokenilor.
  const msgs = messages.slice(-20).map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  try {
    let response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages: msgs,
    });

    while (response.stop_reason === "tool_use") {
      const toolBlocks = response.content.filter(b => b.type === "tool_use") as Anthropic.ToolUseBlock[];
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const b of toolBlocks) {
        const out = await executeTool(b.name, b.input as Record<string, unknown>);
        results.push({ type: "tool_result", tool_use_id: b.id, content: out });
      }
      response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: [
          ...msgs,
          { role: "assistant", content: response.content },
          { role: "user", content: results },
        ],
      });
    }

    const text = response.content.find(b => b.type === "text") as Anthropic.TextBlock | undefined;
    return NextResponse.json({ message: text?.text || "Nu am putut genera un răspuns." });
  } catch (err: any) {
    console.error("Eroare /api/chat:", err);
    return NextResponse.json({
      message: "Scuze, asistentul a întâmpinat o problemă. Vă rugăm încercați din nou sau contactați-ne la +40 764 806 987.",
      _debug: {
        keyLen: (process.env.MCSUA_AI_KEY || "").length,
        keyPrefix: (process.env.MCSUA_AI_KEY || "").slice(0, 8),
        keyStart: (process.env.MCSUA_AI_KEY || "").slice(0, 14),
        keyEnd: (process.env.MCSUA_AI_KEY || "").slice(-6),
        errName: err?.name ?? null,
        errStatus: err?.status ?? null,
        errMsg: String(err?.message ?? "").slice(0, 160),
      },
    }, { status: 200 });
  }
}
