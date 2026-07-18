"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo, saya asisten AI PakDon.id 👋 Ada yang bisa saya bantu seputar bisnis, AI, atau konsultasi?" },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "Maaf, terjadi kendala. Coba lagi sebentar lagi ya." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Maaf, koneksi ke asisten AI sedang bermasalah." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 60 }}>
      {open && (
        <div className="pd-card pd-glass" style={{ width: 320, height: 420, marginBottom: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={15} color="#04211F" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>Tanya Pak Don</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                <span className="pd-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} /> AI Assistant
              </div>
            </div>
            <X size={16} style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => setOpen(false)} />
          </div>
          <div className="pd-scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
                background: m.role === "assistant" ? "var(--bg-alt)" : "var(--accent)",
                color: m.role === "assistant" ? "var(--text)" : "#04211F",
                padding: "9px 13px", borderRadius: 14, fontSize: 13, maxWidth: "85%", lineHeight: 1.5,
              }}>{m.content}</div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", fontSize: 12, color: "var(--text-secondary)" }}>Mengetik...</div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input className="pd-input" style={{ padding: "9px 13px", fontSize: 13 }} placeholder="Tulis pertanyaan..."
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button onClick={send} disabled={loading} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: loading ? 0.6 : 1 }}>
              <Send size={14} color="#04211F" />
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)}
        style={{ width: 58, height: 58, borderRadius: "50%", background: "var(--accent)", border: "none", boxShadow: "0 14px 30px -10px rgba(17,197,191,0.55)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {open ? <X size={22} color="#04211F" /> : <MessageCircle size={22} color="#04211F" />}
      </button>
    </div>
  );
}
