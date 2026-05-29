"use client";

import { useState, useEffect } from "react";

type Step = {
  id: string;
  emoji: string;
  label: string;
  hint: string;
  getHref: (base: string, slug: string) => string | null;
  download?: boolean;
  external?: boolean;
};

const ADIMLAR: Step[] = [
  {
    id: "olustur",
    emoji: "✅",
    label: "Davetiyeni oluştur",
    hint: "Tamamlandı — davetiye yayında!",
    getHref: () => null,
  },
  {
    id: "qr",
    emoji: "📲",
    label: "QR kodunu indir",
    hint: "Baskıya hazır, kamerayla taranabilir",
    getHref: (base, slug) => `/api/qr?url=${encodeURIComponent(`${base}/davetiye/${slug}`)}`,
    download: true,
  },
  {
    id: "whatsapp",
    emoji: "💬",
    label: "WhatsApp'ta paylaş",
    hint: "İlk davetini şimdi gönder",
    getHref: (base, slug) =>
      `https://wa.me/?text=${encodeURIComponent(`Davetiyemi açar mısın? ${base}/davetiye/${slug}`)}`,
    external: true,
  },
  {
    id: "davetli",
    emoji: "👥",
    label: "İlk davetliyi ekle",
    hint: "Misafir listeni oluşturmaya başla",
    getHref: (_base, slug) => `/dashboard/davetiye/${slug}/davetliler`,
  },
  {
    id: "onizle",
    emoji: "👁️",
    label: "Davetiyeni önizle",
    hint: "Misafir gözüyle bir kez daha gör",
    getHref: (base, slug) => `${base}/davetiye/${slug}`,
    external: true,
  },
];

export default function OnboardingChecklist({ slug }: { slug: string | null }) {
  const key  = `bekleriz_ob_${slug ?? "x"}`;
  const [done,    setDone]    = useState<string[]>([]);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (!slug) return;
    try {
      const raw = localStorage.getItem(key);
      setDone(raw ? JSON.parse(raw) : ["olustur"]);
    } catch { setDone(["olustur"]); }
  }, [key, slug]);

  const tik = (id: string) => {
    const next = done.includes(id) ? done.filter(d => d !== id) : [...done, id];
    setDone(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  if (!slug) return null;

  const tamamlanan = done.length;

  return (
    <div style={{
      background:    "rgba(255,255,255,0.04)",
      border:        "1px solid rgba(255,255,255,0.1)",
      borderRadius:  24,
      padding:       "24px 28px",
      animation:     "float-up 0.6s 2.2s both",
    }}>
      {/* Başlık + halka */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(196,132,252,0.7)", marginBottom: 4, fontWeight: 600 }}>
            Başlangıç Adımları
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
            {tamamlanan}/{ADIMLAR.length} tamamlandı
          </p>
        </div>
        <div style={{ width: 48, height: 48, position: "relative", flexShrink: 0 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
            <circle
              cx="24" cy="24" r="19" fill="none"
              stroke="url(#ob-g)" strokeWidth="3.5"
              strokeDasharray={`${2 * Math.PI * 19}`}
              strokeDashoffset={`${2 * Math.PI * 19 * (1 - tamamlanan / ADIMLAR.length)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <defs>
              <linearGradient id="ob-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c084fc" /><stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#c084fc" }}>
            {Math.round((tamamlanan / ADIMLAR.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Adımlar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ADIMLAR.map(adim => {
          const isDone = done.includes(adim.id);
          const isFirst = adim.id === "olustur";
          const href = baseUrl && slug ? adim.getHref(baseUrl, slug) : null;

          return (
            <div key={adim.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: isDone ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.025)",
              border:     `1px solid ${isDone ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14, padding: "10px 14px",
              transition: "background 0.2s, border-color 0.2s",
            }}>
              {/* İkon dairesi */}
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isDone
                  ? "linear-gradient(135deg,rgba(168,85,247,0.4),rgba(244,114,182,0.4))"
                  : "rgba(255,255,255,0.06)",
                border: `1px solid ${isDone ? "rgba(196,132,252,0.4)" : "rgba(255,255,255,0.1)"}`,
                fontSize: isDone ? 12 : 15, color: isDone ? "#c084fc" : "#fff",
              }}>
                {isDone ? "✓" : adim.emoji}
              </div>

              {/* Metin */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: isDone ? "rgba(255,255,255,0.4)" : "#fff", textDecoration: isDone ? "line-through" : "none" }}>
                  {adim.label}
                </p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", marginTop: 1 }}>{adim.hint}</p>
              </div>

              {/* Buton */}
              {!isFirst && href && (
                <a
                  href={href}
                  download={adim.download ? "davetiye-qr.png" : undefined}
                  target={adim.external ? "_blank" : undefined}
                  rel={adim.external ? "noopener noreferrer" : undefined}
                  onClick={() => { if (!isDone) tik(adim.id); }}
                  style={{
                    flexShrink: 0, textDecoration: "none",
                    fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 10,
                    background: isDone ? "transparent" : "linear-gradient(135deg,rgba(124,58,237,0.55),rgba(219,39,119,0.55))",
                    color: isDone ? "rgba(255,255,255,0.2)" : "#fff",
                    border: isDone ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  {isDone ? "Yapıldı ✓" : "Yap →"}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
