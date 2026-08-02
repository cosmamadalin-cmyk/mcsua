import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeConversationId(value: unknown): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!id || id.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(id)) return "";
  return id;
}

async function updateFeedback(conversationId: string, feedback: "up" | "down"): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/chat_conversations?conversation_id=eq.${encodeURIComponent(conversationId)}`,
      {
        method: "PATCH",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ feedback }),
        signal: controller.signal,
      },
    );
    return res.ok;
  } catch (err) {
    console.error("Chat feedback failed", err instanceof Error ? err.message : err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payload = body as { conversationId?: unknown; conversation_id?: unknown; value?: unknown; feedback?: unknown };
  const conversationId = normalizeConversationId(payload.conversationId ?? payload.conversation_id);
  const value = payload.value ?? payload.feedback;

  if (!conversationId || (value !== "up" && value !== "down")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ok = await updateFeedback(conversationId, value);
  return NextResponse.json({ ok });
}
