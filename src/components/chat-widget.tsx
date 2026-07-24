"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { MessageCircle, X, Send, Loader2, Trash2 } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

const WELCOME: Message = {
  role: "assistant",
  content: "Salutare! Sunt asistentul MC SUA. Vă pot ajuta să găsiți o mașină, să calculați costul de import, să aflați prețul mediu pentru un model, sau să verific o mașină anume dacă îmi trimiteți VIN-ul sau linkul. Cu ce vă pot ajuta?",
};

const QUICK_REPLIES = [
  { label: "🔍 Caută o mașină", send: "Vreau să caut o mașină" },
  { label: "🧾 Verifică un VIN", send: "Vreau să verific o mașină după VIN sau link" },
  { label: "🧮 Cât costă importul?", send: "Cât costă să import o mașină din SUA în România?" },
  { label: "📊 Preț mediu model", send: "Care e prețul mediu de licitație pentru un model?" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try { const s = localStorage.getItem("mcsua_chat"); if (s) return JSON.parse(s); } catch {}
    }
    return [WELCOME];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const openChat = () => { setOpen(true); setShowNudge(false); };

  useEffect(() => {
    const h = () => openChat();
    window.addEventListener("open-mcsua-chat", h);
    return () => window.removeEventListener("open-mcsua-chat", h);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { if (localStorage.getItem("mcsua_nudge_dismissed")) return; } catch {}
    const t = setTimeout(() => setShowNudge((s) => (open ? s : true)), 5000);
    return () => clearTimeout(t);
  }, [open]);

  const dismissNudge = () => {
    setShowNudge(false);
    try { localStorage.setItem("mcsua_nudge_dismissed", "1"); } catch {}
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);
  useEffect(() => { try { localStorage.setItem("mcsua_chat", JSON.stringify(messages.slice(-40))); } catch {} }, [messages]);

  const clearChat = () => {
    try { localStorage.removeItem("mcsua_chat"); } catch {}
    setMessages([WELCOME]);
  };

  const send = async (preset?: string) => {
    const text = (typeof preset === "string" ? preset : input).trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message || "Scuze, nu am putut genera un răspuns. Ne puteți contacta la +40 764 806 987." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Scuze, a apărut o eroare. Ne puteți contacta la +40 764 806 987." }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Buton flotant + nudge (ascunse când chat-ul e deschis) */}
      <div className={`fixed bottom-6 right-6 z-50 ${open ? "hidden" : ""}`}>
        {showNudge && (
          <div className="absolute bottom-[4.5rem] right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 pr-6 transition-all">
            <button type="button" onClick={dismissNudge} aria-label="Închide" className="absolute top-2 right-2 text-slate-300 hover:text-slate-500">
              <X className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={openChat} className="text-left w-full">
              <p className="text-sm font-semibold text-primary">Salutare! 👋</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Caut o mașină pentru dumneavoastră, verific un VIN sau calculez costul de import. Întrebați-mă!</p>
            </button>
          </div>
        )}
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
          <button type="button" onClick={openChat} className="relative bg-accent hover:bg-accent/90 text-white rounded-full p-4 shadow-2xl shadow-accent/30 transition-all" aria-label="Deschide chat">
            <MessageCircle className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Panel chat — full-screen pe mobil, bulă pe desktop */}
      <div
        className={`fixed z-50 bg-white flex flex-col transition-all duration-300
          inset-0 w-full h-[100dvh] rounded-none
          sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[580px] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl sm:border sm:border-slate-100 sm:shadow-2xl
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-gradient-to-r from-primary to-slate-700 sm:rounded-t-2xl px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistent MC SUA</p>
              <p className="text-green-300 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online · răspunde imediat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={clearChat} title="Șterge conversația" aria-label="Șterge conversația" className="text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <Trash2 className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Închide chat" className="text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" ? (
                <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed bg-slate-50 text-slate-700 border border-slate-100 rounded-bl-sm [&_p]:mb-2 [&_p:last-child]:mb-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkBreaks]}
                    components={{
                      a: ({ href, children }) => (<a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold">{children}</a>),
                      strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-1">{children}</ol>,
                    }}
                  >{m.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap bg-accent text-white rounded-br-sm">{m.content}</div>
              )}
            </div>
          ))}

          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK_REPLIES.map((q) => (
                <button key={q.send} type="button" onClick={() => send(q.send)} className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent/5 transition-colors font-medium">
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-3 py-2.5">
                <Loader2 className="h-4 w-4 text-accent animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-3 pt-2 border-t border-slate-100 flex-shrink-0" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Scrieți un mesaj... (ex: verifică un VIN, caută BMW X3 sub 10.000$)"
              disabled={loading}
              rows={2}
              className="flex-1 resize-none text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent disabled:opacity-50 bg-white max-h-32"
            />
            <button type="button" onClick={() => send()} disabled={loading || !input.trim()} className="bg-accent hover:bg-accent/90 disabled:opacity-40 text-white rounded-xl p-3 transition-all flex items-center flex-shrink-0" aria-label="Trimite">
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* stiluri deja aplicate; open-chat-button și hero rămân neatinse */}
    </>
  );
}
