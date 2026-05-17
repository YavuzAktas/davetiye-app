"use client";

import React, { useRef, useState } from "react";
import {
  KATEGORILER,
  MUZIK_KUTUPHANESI,
  type MuzikKategori,
  type MuzikParcasi,
} from "@/lib/muzik-kutuphanesi";

interface Props {
  secili: string | null;
  onChange: (url: string | null) => void;
}

// ── Eşitleyici animasyonu ─────────────────────────────────────────────────────
function Esitleyici() {
  return (
    <>
      <style>{`
        @keyframes esitleyici {
          0%,100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1);   }
        }
      `}</style>
      <span
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
          height: 14,
        }}
      >
        {[0.6, 1, 0.45, 0.8].map((delay, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 2,
              height: "100%",
              background: "#fff",
              borderRadius: 2,
              transformOrigin: "bottom",
              animation: `esitleyici ${0.6 + delay * 0.4}s ease-in-out ${delay * -0.3}s infinite`,
            }}
          />
        ))}
      </span>
    </>
  );
}

// ── Soyut gradient sanat ─────────────────────────────────────────────────────
function ParcaGorsel({
  parca,
  kucuk = false,
}: {
  parca: MuzikParcasi;
  kucuk?: boolean;
}) {
  const bg = `linear-gradient(135deg, ${parca.renk1} 0%, ${parca.renk2} 60%, ${parca.renk3 ?? parca.renk2} 100%)`;
  const size = kucuk ? 44 : 88;

  const svgMap: Record<MuzikParcasi["desen"], React.ReactElement> = {
    dalgalar: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.25 }}>
        {[20, 38, 56, 74].map((y, i) => (
          <path
            key={i}
            d={`M0,${y} Q25,${y - 12} 50,${y} Q75,${y + 12} 100,${y}`}
            stroke="white"
            strokeWidth={i === 1 ? 2.5 : 1.5}
            fill="none"
          />
        ))}
      </svg>
    ),
    halkalar: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        {[12, 24, 36, 48].map((r, i) => (
          <circle key={i} cx="50" cy="50" r={r} stroke="white" strokeWidth={i === 1 ? 2 : 1.2} fill="none" />
        ))}
      </svg>
    ),
    yildizlar: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.28 }}>
        {[[50, 25, 8], [20, 65, 5], [78, 55, 4], [35, 80, 3.5], [68, 20, 3]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" />
        ))}
        {[[50, 10, 50, 40], [50, 60, 50, 90], [30, 35, 70, 35], [30, 65, 70, 65]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={0.8} opacity={0.6} />
        ))}
      </svg>
    ),
    notalar: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        <text x="18" y="52" fontSize="28" fill="white" fontFamily="serif">♩</text>
        <text x="50" y="40" fontSize="22" fill="white" fontFamily="serif">♪</text>
        <text x="68" y="62" fontSize="18" fill="white" fontFamily="serif">♫</text>
        <text x="30" y="75" fontSize="14" fill="white" fontFamily="serif">♬</text>
      </svg>
    ),
    kristal: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        {[[50, 20], [26, 35], [26, 65], [50, 80], [74, 65], [74, 35]].map(([x, y], i, arr) => (
          <line
            key={i}
            x1={x} y1={y}
            x2={arr[(i + 1) % arr.length][0]} y2={arr[(i + 1) % arr.length][1]}
            stroke="white" strokeWidth={1.4}
          />
        ))}
        <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth={0.8} />
        <line x1="26" y1="35" x2="74" y2="65" stroke="white" strokeWidth={0.8} />
        <line x1="74" y1="35" x2="26" y2="65" stroke="white" strokeWidth={0.8} />
      </svg>
    ),
    soyut: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.2 }}>
        <ellipse cx="38" cy="50" rx="30" ry="18" stroke="white" strokeWidth={1.5} fill="none" transform="rotate(-20 38 50)" />
        <ellipse cx="62" cy="50" rx="30" ry="18" stroke="white" strokeWidth={1.5} fill="none" transform="rotate(20 62 50)" />
        <ellipse cx="50" cy="40" rx="22" ry="12" stroke="white" strokeWidth={1} fill="none" transform="rotate(0 50 40)" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: kucuk ? 8 : 12,
        background: bg,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{svgMap[parca.desen]}</div>
      {/* Shine overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

// ── Parça kartı ───────────────────────────────────────────────────────────────
function ParcaKarti({
  parca,
  secili,
  caliyor,
  onSec,
  onOnizle,
}: {
  parca: MuzikParcasi;
  secili: boolean;
  caliyor: boolean;
  onSec: () => void;
  onOnizle: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onSec}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 14,
        border: secili
          ? "1.5px solid #C9A84C"
          : hover
          ? "1.5px solid rgba(255,255,255,0.15)"
          : "1.5px solid rgba(255,255,255,0.07)",
        background: secili
          ? "rgba(201,168,76,0.10)"
          : hover
          ? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        overflow: "hidden",
        transition: "all 0.2s ease",
        transform: hover && !secili ? "translateY(-2px)" : "translateY(0)",
        boxShadow: secili
          ? "0 0 0 1px rgba(201,168,76,0.25), 0 8px 24px rgba(0,0,0,0.35)"
          : hover
          ? "0 6px 20px rgba(0,0,0,0.3)"
          : "none",
      }}
    >
      {/* Artwork area */}
      <div style={{ position: "relative", height: 88, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${parca.renk1} 0%, ${parca.renk2} 60%, ${parca.renk3 ?? parca.renk2} 100%)`,
          }}
        />
        {/* SVG pattern */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ParcaGorsel parca={parca} />
        </div>
        {/* Play button overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: caliyor
              ? "rgba(0,0,0,0.35)"
              : hover
              ? "rgba(0,0,0,0.22)"
              : "transparent",
            transition: "background 0.2s ease",
          }}
        >
          <button
            type="button"
            onClick={onOnizle}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: caliyor
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.88)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: caliyor || hover ? 1 : 0,
              transform: caliyor || hover ? "scale(1)" : "scale(0.7)",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            {caliyor ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
                <Esitleyici />
              </div>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            )}
          </button>
        </div>
        {/* Selected badge */}
        {secili && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#C9A84C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Text area */}
      <div style={{ padding: "10px 12px 11px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: secili ? "#C9A84C" : "#f0f0f0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
          }}
        >
          {parca.baslik}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{parca.sanatci}</span>
          <span>{parca.sure}</span>
        </p>
      </div>
    </div>
  );
}

// ── Ana bileşen ────────────────────────────────────────────────────────────────
export default function MuzikSecici({ secili, onChange }: Props) {
  const [kategori, setKategori] = useState<MuzikKategori | "tumu">("tumu");
  const [calanId, setCalanId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Bileşen unmount olduğunda (sayfa geçişi) önizleme sesini durdur
  React.useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const liste =
    kategori === "tumu"
      ? MUZIK_KUTUPHANESI
      : MUZIK_KUTUPHANESI.filter((p) => p.kategori === kategori);

  const seciliParca = MUZIK_KUTUPHANESI.find((p) => p.url === secili) ?? null;

  function onizle(e: React.MouseEvent, parca: MuzikParcasi) {
    e.stopPropagation();
    if (calanId === parca.id) {
      audioRef.current?.pause();
      setCalanId(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(parca.url);
    audio.volume = 0.7;
    audio.play().catch(() => {});
    audio.addEventListener("ended", () => setCalanId(null));
    audioRef.current = audio;
    setCalanId(parca.id);
  }

  function sec(parca: MuzikParcasi) {
    if (secili === parca.url) {
      onChange(null);
    } else {
      onChange(parca.url);
    }
  }

  return (
    <div
      style={{
        background: "rgba(10,10,18,0.95)",
        borderRadius: 18,
        padding: 20,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Seçili parça özet çubuğu */}
      {seciliParca && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
            padding: "10px 14px",
            background: "rgba(201,168,76,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <ParcaGorsel parca={seciliParca} kucuk />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#C9A84C",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {seciliParca.baslik}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              {seciliParca.sanatci} · {seciliParca.sure}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.35)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Kategori sekmeleri */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {KATEGORILER.map((k) => {
          const aktif = kategori === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => setKategori(k.id as MuzikKategori | "tumu")}
              style={{
                padding: "5px 14px",
                borderRadius: 99,
                border: aktif ? "1px solid #C9A84C" : "1px solid rgba(255,255,255,0.12)",
                background: aktif ? "rgba(201,168,76,0.15)" : "transparent",
                color: aktif ? "#C9A84C" : "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontWeight: aktif ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.18s ease",
                letterSpacing: "0.01em",
              }}
            >
              {k.etiket}
            </button>
          );
        })}
      </div>

      {/* 2 sütunlu ızgara */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {liste.map((parca) => (
          <ParcaKarti
            key={parca.id}
            parca={parca}
            secili={secili === parca.url}
            caliyor={calanId === parca.id}
            onSec={() => sec(parca)}
            onOnizle={(e) => onizle(e, parca)}
          />
        ))}
      </div>

      {/* Alt not */}
      <p
        style={{
          margin: "14px 0 0",
          textAlign: "center",
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.02em",
        }}
      >
        Tüm parçalar telifsiz lisanslıdır · ▶ ile önizleyin
      </p>
    </div>
  );
}
