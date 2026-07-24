// ── MC SUA · Normalizare date vehicule (RO) + evaluare orientativă ──────────────
// Modul pur (fără React) folosit atât de paginile catalog cât și de chatbot,
// ca traducerile și recomandările să fie identice peste tot.

export type Platform = "copart" | "iaai";

export type TitleKind =
  | "clean"
  | "salvage"
  | "rebuilt"
  | "certificate"
  | "nonrepairable"
  | "partsonly"
  | "junk"
  | "unknown";

export type SellerKind = "insurance" | "dealer" | "individual" | "fleet" | "verify" | "unknown";

// ── Daune ────────────────────────────────────────────────────────────────────
export function translateDamage(v: string): string {
  const vl = (v || "").toLowerCase().trim();
  if (!vl) return v;
  if (vl.includes("front") && vl.includes("rear")) return "Față și spate";
  if (vl.includes("front end") || vl === "front") return "Față";
  if (vl.includes("rear end") || vl === "rear") return "Spate";
  if (vl.includes("all over")) return "Generală (peste tot)";
  if (vl.includes("side")) return "Lateral";
  if (vl.includes("undercarriage")) return "Parte inferioară (șasiu)";
  if (vl.includes("roof") || vl === "top") return "Plafon";
  if (vl.includes("frame")) return "Șasiu / structură";
  if (vl.includes("mechanical")) return "Mecanică";
  if (vl.includes("electric")) return "Electrică";
  if (vl.includes("engine")) return "Motor";
  if (vl.includes("suspension")) return "Suspensie";
  if (vl.includes("water") || vl.includes("flood")) return "Inundație";
  if (vl.includes("fire") || vl.includes("burn")) return "Incendiu";
  if (vl.includes("hail")) return "Grindină";
  if (vl.includes("theft") || vl.includes("stripped")) return "Recuperat după furt";
  if (vl.includes("rollover") || vl.includes("roll over")) return "Răsturnat";
  if (vl.includes("vandal")) return "Vandalism";
  if (vl.includes("biohazard") || vl.includes("chemical")) return "Contaminare chimică / biologică";
  if (vl.includes("normal wear")) return "Uzură normală";
  if (vl.includes("dent") || vl.includes("scratch")) return "Zgârieturi / lovituri minore";
  if (vl.includes("missing") || vl.includes("parts")) return "Piese lipsă";
  if (vl === "none" || vl === "no damage") return "Fără daune vizibile";
  if (vl.includes("unknown")) return "Necunoscută";
  return v;
}

// ── Stare de funcționare ──────────────────────────────────────────────────────
export function translateRunCondition(v: string): string {
  const vl = (v || "").toLowerCase().trim();
  if (!vl) return v;
  if (vl.includes("run") && vl.includes("driv")) return "Pornește și rulează";
  if (vl.includes("runs")) return "Pornește și merge";
  if (vl.includes("starts") || vl.includes("engine start")) return "Pornire motor";
  if (vl.includes("enhanced")) return "Vehicul enhanced";
  if (vl.includes("does not") || vl.includes("non-runner") || vl.includes("won't") || vl.includes("for parts")) return "Nu pornește";
  if (vl.includes("stationary") || vl.includes("static")) return "Staționar";
  return v;
}

// ── Tip titlu (label RO + categorie normalizată) ──────────────────────────────
export function translateTitle(v: string): { label: string; kind: TitleKind } {
  const vl = (v || "").toLowerCase().trim();
  if (!vl) return { label: v || "-", kind: "unknown" };
  if ((vl.includes("clear") || vl.includes("clean")) && vl.includes("dealer")) return { label: "Titlu Curat - Doar Dealer", kind: "clean" };
  if (vl.includes("non-repairable") || vl.includes("nonrepairable") || vl.includes("non repairable")) return { label: "Nereparabil", kind: "nonrepairable" };
  if (vl.includes("parts only") || vl.includes("parts-only")) return { label: "Doar piese", kind: "partsonly" };
  if (vl.includes("junk")) return { label: "Casare", kind: "junk" };
  if (vl.includes("rebuilt") || vl.includes("reconstructed")) return { label: "Reconstruit", kind: "rebuilt" };
  if (vl.includes("salvage")) return { label: "Titlu Salvage", kind: "salvage" };
  if (vl.includes("clean") || vl.includes("clear")) return { label: "Titlu Curat", kind: "clean" };
  if (vl.includes("certificate of title") || vl.includes("cert of title")) return { label: "Certificat de Titlu", kind: "certificate" };
  return { label: v, kind: "unknown" };
}

// ── Vânzător ──────────────────────────────────────────────────────────────────
const INSURERS = /insurance|geico|allstate|progressive|state farm|nationwide|farmers|liberty mutual|usaa|esurance|mercury|travelers|american family|hartford/i;

export function displaySeller(platform: Platform, seller?: string, sellerType?: string): { text: string; kind: SellerKind } {
  const raw = (seller || "").trim();
  const t = (sellerType || "").toLowerCase();
  const isNon = /non[-_ ]?insurance/.test(t) || /non[-_ ]?insurance/.test(raw.toLowerCase());

  // Copart NU divulgă vânzătorul real → datele Apibara sunt nesigure. Mereu "De verificat".
  if (platform === "copart") {
    return { text: "De verificat", kind: "verify" };
  }

  // IAAI expune vânzătorul real
  let kind: SellerKind = "unknown";
  if (!isNon && (t === "insurance" || INSURERS.test(raw))) kind = "insurance";
  else if (t.includes("dealer")) kind = "dealer";
  else if (isNon || t.includes("individual") || t.includes("public") || t.includes("private")) kind = "individual";
  else if (t.includes("financ") || t.includes("bank") || t.includes("lease") || t.includes("rental") || t.includes("fleet")) kind = "fleet";

  const base = raw || (kind === "insurance" ? "Companie de asigurări" : kind === "dealer" ? "Dealer" : kind === "individual" ? "Vânzător privat" : kind === "fleet" ? "Companie / flotă" : "Nespecificat");
  const suffix = kind === "insurance" && raw ? " · asigurător" : "";
  return { text: base + suffix, kind };
}

// ── Recomandare orientativă ───────────────────────────────────────────────────
export interface RecoInput {
  platform: Platform;
  titleKind: TitleKind;
  runConditionRaw?: string;
  primaryDamage?: string;
  secondaryDamage?: string;
  hasKey?: boolean;
  sellerType?: string;
}

export interface Reco {
  level: "good" | "caution" | "warn";
  label: string;
  reasons: string[];
}

export function getRecommendation(input: RecoInput): Reco {
  const reasons: string[] = [];
  let score = 0;

  // Titlu
  switch (input.titleKind) {
    case "clean":
      score += 2; reasons.push("Titlu curat"); break;
    case "salvage":
      score -= 1; reasons.push("Titlu salvage — mașină avariată, necesită reparație și omologare RAR"); break;
    case "rebuilt":
      reasons.push("Titlu reconstruit — verifică istoricul și calitatea reparațiilor"); break;
    case "certificate":
      reasons.push("Certificat de titlu — verifică statutul exact înainte de licitație"); break;
    case "nonrepairable":
    case "partsonly":
    case "junk":
      score -= 5; reasons.push("Titlu nereparabil / doar piese — nu poate fi înmatriculat legal"); break;
    default:
      break;
  }

  // Stare funcționare
  const rc = (input.runConditionRaw || "").toLowerCase();
  if (rc.includes("run") && rc.includes("driv")) { score += 2; reasons.push("Pornește și rulează"); }
  else if (rc.includes("runs")) { score += 1; reasons.push("Pornește și merge"); }
  else if (rc.includes("start")) { reasons.push("Doar pornește motorul (nedemonstrat că rulează)"); }
  else if (rc.includes("does not") || rc.includes("non-runner") || rc.includes("for parts") || rc.includes("stationary") || rc.includes("static")) { score -= 2; reasons.push("Nu pornește / staționar"); }

  // Chei
  if (input.hasKey === true) { score += 1; reasons.push("Are cheie"); }
  else if (input.hasKey === false) { score -= 1; reasons.push("Fără cheie"); }

  // Severitate daune
  const dmgAll = `${input.primaryDamage || ""} ${input.secondaryDamage || ""}`.toLowerCase();
  const severe = /(all over|fire|burn|water|flood|rollover|roll over|undercarriage|frame|biohazard|chemical|explosion)/;
  const moderate = /(mechanical|electric|engine|suspension|missing|stripped)/;
  const minor = /(front|rear|side|minor|dent|scratch|hail|normal wear|vandal)/;
  if (severe.test(dmgAll)) { score -= 3; reasons.push("Daune grave (structură / foc / apă / răsturnare)"); }
  else if (moderate.test(dmgAll)) { score -= 1; reasons.push("Daune mecanice / tehnice de verificat"); }
  else if (minor.test(dmgAll)) { score += 1; reasons.push("Daune preponderent estetice / ușoare"); }

  if (input.secondaryDamage && input.secondaryDamage.trim()) reasons.push("Are și daună secundară — verifică ambele zone");

  // Vânzător — semnal de încredere DOAR la IAAI cu asigurare reală (Copart nu divulgă vânzătorul)
  const st = (input.sellerType || "").toLowerCase();
  if (input.platform === "iaai" && st === "insurance") {
    score += 1;
    reasons.push("Vânzător: companie de asigurări (proveniență clară)");
  }

  let level: Reco["level"];
  let label: string;
  if (input.titleKind === "nonrepairable" || input.titleKind === "partsonly" || input.titleKind === "junk") {
    level = "warn"; label = "Atenție";
  } else if (score >= 3) {
    level = "good"; label = "Recomandată";
  } else if (score >= 0) {
    level = "caution"; label = "De verificat";
  } else {
    level = "warn"; label = "Atenție";
  }

  return { level, label, reasons };
}
