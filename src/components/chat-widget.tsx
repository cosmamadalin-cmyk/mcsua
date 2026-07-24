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

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try { const s = localStorage.getItem("mcsua_chat"); if (s) return JSON.parse(s); } catch {}
    }
    return [WELCOME];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    try { localStorage.setItem("mcsua_chat", JSON.stringify(messages.slice(-40))); } catch {}
  }, [messages]);

  const clearChat = () => {
    try { localStorage.removeItem("mcsua_chat"); } catch {}
    setMessages([WELCOME]);
  };

  const send = async () => {
    const text = input.trim();
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/90 text-white rounded-full p-4 shadow-2xl shadow-accent/30 transition-all duration-300 ${open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
        aria-label="Deschide chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        style={{ height: "580px" }}
      >
        <div className="bg-gradient-to-r from-primary to-slate-700 rounded-t-2xl px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Asistent MC SUA</p>
              <p className="text-slate-300 text-xs">Răspund instant · 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={clearChat}
              title="Șterge conversația"
              aria-label="Șterge conversația"
              className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Închide chat"
              className="text-slate-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
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
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold">{children}</a>
                      ),
                      strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 my-1 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 my-1 space-y-1">{children}</ol>,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap bg-accent text-white rounded-br-sm">
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-3 py-2.5">
                <Loader2 className="h-4 w-4 text-accent animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="px-3 pb-3 pt-2 border-t border-slate-100 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Scrieți un mesaj... (ex: verifică un VIN, caută BMW X3 sub 10.000$)"
              disabled={loading}
              rows={2}
              className="flex-1 resize-none text-sm px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent disabled:opacity-50 bg-white max-h-32"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-accent hover:bg-accent/90 disabled:opacity-40 text-white rounded-xl px-3 py-2 transition-all flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
