"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flag,
  Loader2,
  LogOut,
  MessageSquareText,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  User,
  Wrench,
} from "lucide-react";

type ReviewStatus = "new" | "reviewed" | "action_needed";
type Feedback = "up" | "down" | null;

interface ChatListItem {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  turn_count: number;
  total_tokens: number;
  error: string | null;
  rate_limited: boolean;
  review_status: ReviewStatus;
  notes: string | null;
  feedback?: Feedback;
  prompt_version: string | null;
  entry_page: string | null;
  device: string | null;
  tools_used: string[] | null;
  first_user_message: string | null;
  last_user_message: string | null;
  last_assistant_message: string | null;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts?: string;
}

interface ToolCall {
  name?: string;
  tool?: string;
  tool_name?: string;
  input?: unknown;
  output?: unknown;
  result?: unknown;
  content?: unknown;
  response?: unknown;
  ms?: number;
  ts?: string;
}

interface ChatConversation extends ChatListItem {
  messages: ChatMessage[];
  tool_calls: ToolCall[];
  ip_hash?: string | null;
  user_agent?: string | null;
  country?: string | null;
  latency_ms?: number | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
}

const STATUS_LABELS: Record<ReviewStatus, string> = {
  new: "Nou",
  reviewed: "Revizuit",
  action_needed: "Semnalat",
};

const STATUS_CLASSES: Record<ReviewStatus, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  reviewed: "bg-green-50 text-green-700 border-green-200",
  action_needed: "bg-amber-50 text-amber-700 border-amber-200",
};

function fmtDate(value?: string | null): string {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return value;
  }
}

function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function toolName(tool: ToolCall): string {
  return String(tool.name || tool.tool || tool.tool_name || "tool");
}

function toolOutput(tool: ToolCall): string {
  return asText(tool.output ?? tool.result ?? tool.content ?? tool.response ?? "");
}

function nearestToolIndex(message: ChatMessage, toolCalls: ToolCall[], used: Set<number>): number | null {
  if (!message.ts) return null;
  const msgTime = Date.parse(message.ts);
  if (Number.isNaN(msgTime)) return null;

  let bestIndex: number | null = null;
  let bestDelta = Number.POSITIVE_INFINITY;
  toolCalls.forEach((tool, index) => {
    if (used.has(index) || !tool.ts) return;
    const toolTime = Date.parse(tool.ts);
    if (Number.isNaN(toolTime) || toolTime > msgTime) return;
    const delta = msgTime - toolTime;
    if (delta <= 1000 * 60 * 3 && delta < bestDelta) {
      bestIndex = index;
      bestDelta = delta;
    }
  });
  return bestIndex;
}

function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Parolă incorectă");
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nu s-a putut autentifica.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-slate-700 text-white px-6 py-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Admin conversații chatbot</h1>
          <p className="text-sm text-slate-300 mt-2">Acces protejat pentru dogfooding MC SUA.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parolă admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="ADMIN_CHATS_PASSWORD"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading || !password} className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-bold transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Intră în dashboard
          </button>
        </div>
      </form>
    </main>
  );
}

function ConversationList({
  conversations,
  selectedId,
  onSelect,
  loading,
}: {
  conversations: ChatListItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return <div className="p-8 text-center text-slate-400"><Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />Se încarcă...</div>;
  }
  if (conversations.length === 0) {
    return <div className="p-8 text-center text-slate-400"><Search className="h-8 w-8 mx-auto mb-2 opacity-40" />Nu există conversații pentru filtrele curente.</div>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {conversations.map((c) => (
        <button
          key={c.conversation_id}
          type="button"
          onClick={() => onSelect(c.conversation_id)}
          className={`w-full text-left p-4 transition-colors ${selectedId === c.conversation_id ? "bg-accent/5" : "hover:bg-slate-50"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary truncate">{c.first_user_message || c.last_user_message || "Conversație fără mesaj user"}</p>
              <p className="text-xs text-slate-400 mt-1 truncate">{c.conversation_id}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${STATUS_CLASSES[c.review_status]}`}>
              {STATUS_LABELS[c.review_status]}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(c.updated_at)}</span>
            <span>{c.turn_count} ture</span>
            <span>{c.total_tokens?.toLocaleString("ro-RO") || 0} tokeni</span>
            {c.feedback === "up" && <span className="text-green-600 inline-flex items-center gap-1"><ThumbsUp className="h-3 w-3" />util</span>}
            {c.feedback === "down" && <span className="text-red-600 inline-flex items-center gap-1"><ThumbsDown className="h-3 w-3" />problemă</span>}
            {c.error && <span className="text-red-600 inline-flex items-center gap-1"><AlertTriangle className="h-3 w-3" />eroare</span>}
            {c.rate_limited && <span className="text-amber-600">rate limit</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

function Transcript({ conversation }: { conversation: ChatConversation }) {
  const usedTools = new Set<number>();
  const renderedToolIndexes = new Set<number>();

  const renderTool = (tool: ToolCall, index: number) => {
    renderedToolIndexes.add(index);
    return (
      <details key={`tool-${index}`} className="my-3 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <summary className="cursor-pointer px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-bold text-slate-700">
          <Wrench className="h-4 w-4 text-accent" />
          {toolName(tool)}
          {typeof tool.ms === "number" && <span className="ml-auto text-xs font-medium text-slate-400">{tool.ms} ms</span>}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </summary>
        <div className="p-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Input</p>
            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 text-slate-100 text-xs p-3 whitespace-pre-wrap">{asText(tool.input)}</pre>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Output</p>
            <pre className="max-h-72 overflow-auto rounded-xl bg-slate-950 text-slate-100 text-xs p-3 whitespace-pre-wrap">{toolOutput(tool)}</pre>
          </div>
        </div>
      </details>
    );
  };

  return (
    <div className="space-y-4">
      {(conversation.messages || []).map((m, index) => {
        const toolIndex = m.role === "assistant" ? nearestToolIndex(m, conversation.tool_calls || [], usedTools) : null;
        if (toolIndex !== null) usedTools.add(toolIndex);
        return (
          <div key={`${m.role}-${index}`}>
            {toolIndex !== null && renderTool(conversation.tool_calls[toolIndex], toolIndex)}
            <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === "user" ? "bg-accent text-white rounded-br-sm" : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"}`}>
                <div className="mb-2 flex items-center gap-2 text-[11px] opacity-70 font-semibold">
                  {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  {m.role === "user" ? "Client" : "Asistent"}
                  <span>{fmtDate(m.ts)}</span>
                </div>
                {m.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkBreaks]} components={{ a: ({ href, children }) => <a href={href} className="text-accent underline font-semibold" target="_blank" rel="noopener noreferrer">{children}</a> }}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {(conversation.tool_calls || []).map((tool, index) => renderedToolIndexes.has(index) ? null : renderTool(tool, index))}
    </div>
  );
}

export default function AdminChatsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [view, setView] = useState("recent");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [hasError, setHasError] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [conversations, setConversations] = useState<ChatListItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState<ChatConversation | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingSelected, setLoadingSelected] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const loadList = async (): Promise<boolean> => {
    setLoadingList(true);
    const params = new URLSearchParams({ view });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (status) params.set("review_status", status);
    if (hasError) params.set("has_error", "true");
    if (rateLimited) params.set("rate_limited", "true");
    try {
      const res = await fetch(`/api/admin/chats?${params.toString()}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return false;
      }
      const json = await res.json();
      const list = Array.isArray(json.data) ? json.data as ChatListItem[] : [];
      setConversations(list);
      if (!selectedId && list[0]) setSelectedId(list[0].conversation_id);
      return true;
    } finally {
      setLoadingList(false);
      setAuthChecked(true);
    }
  };

  const loadSelected = async (id: string) => {
    if (!id) return;
    setLoadingSelected(true);
    try {
      const res = await fetch(`/api/admin/chats?conversation_id=${encodeURIComponent(id)}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setSelected(json.data || null);
      setNotesDraft(json.data?.notes || "");
    } finally {
      setLoadingSelected(false);
    }
  };

  useEffect(() => {
    loadList().then((ok) => setAuthenticated(ok)).catch(() => setAuthChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authenticated) loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, from, to, status, hasError, rateLimited, authenticated]);

  useEffect(() => {
    if (authenticated && selectedId) loadSelected(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, authenticated]);

  const updateConversation = async (patch: Partial<Pick<ChatConversation, "review_status" | "notes">>) => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await fetch("/api/admin/chats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: selectedId, ...patch }),
      });
      await Promise.all([loadSelected(selectedId), loadList()]);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/chats", { method: "DELETE" });
    setAuthenticated(false);
  };

  if (!authChecked && !authenticated) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></main>;
  }
  if (!authenticated) return <LoginPanel onLogin={() => { setAuthenticated(true); loadList(); }} />;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary via-slate-800 to-slate-900 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs font-semibold mb-3">
              <MessageSquareText className="h-4 w-4 text-blue-200" /> Dogfooding chatbot
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Conversații chatbot</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">Revizuire rapidă pentru răspunsuri greșite, refuzuri nejustificate, confuzii de model/trim și calcule suspecte.</p>
          </div>
          <button onClick={logout} type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors">
            <LogOut className="h-4 w-4" /> Ieșire
          </button>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4 rounded-2xl bg-white border border-slate-100 shadow-sm p-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto_auto] items-end">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sursă</label>
            <select value={view} onChange={(e) => setView(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:border-accent">
              <option value="recent">Recente</option>
              <option value="queue">Review queue</option>
              <option value="errors">Erori</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">De la</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Până la</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm bg-white focus:outline-none focus:border-accent">
              <option value="">Toate</option>
              <option value="new">Nou</option>
              <option value="reviewed">Revizuit</option>
              <option value="action_needed">Semnalat</option>
            </select>
          </div>
          <label className="h-10 flex items-center gap-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={hasError} onChange={(e) => setHasError(e.target.checked)} /> Are eroare</label>
          <label className="h-10 flex items-center gap-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={rateLimited} onChange={(e) => setRateLimited(e.target.checked)} /> Rate limited</label>
          <button type="button" onClick={loadList} className="h-10 rounded-xl bg-accent text-white px-4 text-sm font-bold hover:bg-accent/90 flex items-center justify-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5 items-start">
          <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden xl:sticky xl:top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <ConversationList conversations={conversations} selectedId={selectedId} onSelect={setSelectedId} loading={loadingList} />
          </aside>

          <section className="min-h-[600px] rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            {!selectedId ? (
              <div className="p-12 text-center text-slate-400">Selectează o conversație.</div>
            ) : loadingSelected ? (
              <div className="p-12 text-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />Se încarcă transcriptul...</div>
            ) : selected ? (
              <div>
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_CLASSES[selected.review_status]}`}>{STATUS_LABELS[selected.review_status]}</span>
                        {selected.feedback === "up" && <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-xs font-bold"><ThumbsUp className="h-3 w-3" />Feedback pozitiv</span>}
                        {selected.feedback === "down" && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 text-xs font-bold"><ThumbsDown className="h-3 w-3" />Feedback negativ</span>}
                        {selected.error && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 text-xs font-bold"><AlertTriangle className="h-3 w-3" />Eroare</span>}
                      </div>
                      <h2 className="font-extrabold text-primary truncate">{selected.conversation_id}</h2>
                      <p className="text-xs text-slate-400 mt-1">{fmtDate(selected.created_at)} · {selected.turn_count} ture · {selected.total_tokens?.toLocaleString("ro-RO") || 0} tokeni · {selected.latency_ms || 0} ms</p>
                      <p className="text-xs text-slate-400 mt-1">{selected.entry_page || "-"} · {selected.device || "-"} · {selected.country || "-"} · prompt {selected.prompt_version || "-"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={saving} onClick={() => updateConversation({ review_status: "reviewed" })} className="inline-flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-xs font-bold disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Marchează revizuit</button>
                      <button type="button" disabled={saving} onClick={() => updateConversation({ review_status: "action_needed" })} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 text-xs font-bold disabled:opacity-50"><Flag className="h-4 w-4" />Semnalează</button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notes</label>
                    <div className="mt-1 flex gap-2">
                      <textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} rows={2} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-accent" placeholder="Observații pentru prompt / follow-up / bug..." />
                      <button type="button" disabled={saving} onClick={() => updateConversation({ notes: notesDraft })} className="rounded-xl bg-primary text-white px-4 py-2 text-sm font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"><Save className="h-4 w-4" />Salvează</button>
                    </div>
                  </div>
                </div>
                <div className="p-5 bg-slate-50">
                  <Transcript conversation={selected} />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Conversația nu a fost găsită.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
