import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_COOKIE = "mcsua_admin_chats";
const REVIEW_STATUSES = ["new", "reviewed", "action_needed"] as const;
type ReviewStatus = (typeof REVIEW_STATUSES)[number];

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function adminPassword(): string {
  return process.env.ADMIN_CHATS_PASSWORD || "";
}

function hasAdminSession(req: NextRequest): boolean {
  const password = adminPassword();
  if (!password) return false;
  const cookieValue = req.cookies.get(ADMIN_COOKIE)?.value || "";
  const headerValue = req.headers.get("x-admin-chats-password") || "";
  return cookieValue === password || headerValue === password;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase is not configured");
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
}

function cleanDateParam(value: string | null): string {
  if (!value) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function cleanStatus(value: unknown): ReviewStatus | "" {
  return typeof value === "string" && REVIEW_STATUSES.includes(value as ReviewStatus) ? value as ReviewStatus : "";
}

function cleanConversationId(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!id || id.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(id)) return "";
  return id;
}

function listPath(req: NextRequest): string {
  const params = req.nextUrl.searchParams;
  const view = params.get("view") || "recent";
  const source = view === "queue" ? "chat_review_queue" : view === "errors" ? "chat_errors_recent" : "chat_conversations_recent";
  const query = new URLSearchParams();
  query.set("select", "conversation_id,created_at,updated_at,turn_count,total_tokens,error,rate_limited,review_status,notes,feedback,prompt_version,entry_page,device,tools_used,first_user_message,last_user_message,last_assistant_message");
  query.set("order", "updated_at.desc");
  query.set("limit", "200");

  const status = cleanStatus(params.get("review_status"));
  if (status) query.set("review_status", `eq.${status}`);

  const from = cleanDateParam(params.get("from"));
  if (from) query.set("created_at", `gte.${from}T00:00:00Z`);

  const to = cleanDateParam(params.get("to"));
  if (to) query.append("created_at", `lte.${to}T23:59:59Z`);

  if (params.get("has_error") === "true") query.set("error", "not.is.null");
  if (params.get("rate_limited") === "true") query.set("rate_limited", "eq.true");

  return `${source}?${query.toString()}`;
}

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = cleanConversationId(req.nextUrl.searchParams.get("conversation_id"));
  const path = conversationId
    ? `chat_conversations?conversation_id=eq.${encodeURIComponent(conversationId)}&select=*`
    : listPath(req);

  const res = await supabaseFetch(path);
  const data = await res.json().catch(() => null);
  if (!res.ok) return NextResponse.json({ error: "Supabase error", detail: data }, { status: 500 });
  return NextResponse.json({ data: conversationId ? data?.[0] ?? null : data });
}

export async function PATCH(req: NextRequest) {
  if (!hasAdminSession(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const payload = body as { conversation_id?: unknown; review_status?: unknown; notes?: unknown };
  const conversationId = cleanConversationId(payload.conversation_id);
  if (!conversationId) return NextResponse.json({ error: "Invalid conversation_id" }, { status: 400 });

  const update: Record<string, JsonValue> = {};
  const status = cleanStatus(payload.review_status);
  if (status) update.review_status = status;
  if (typeof payload.notes === "string") update.notes = payload.notes.slice(0, 5000);
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });

  const res = await supabaseFetch(`chat_conversations?conversation_id=eq.${encodeURIComponent(conversationId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(update),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json({ error: "Supabase error", detail }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  if (!adminPassword() || password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "Parolă incorectă" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminPassword(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
