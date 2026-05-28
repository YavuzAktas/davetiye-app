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

function Esitleyici() {
  return (
    <>
      <style>{`
        @keyframes esitleyici {
          0%,100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1);   }
        }
      `}</style>
      <span className="flex items-end gap-0.5" style={{ height: 13 }}>
        {[0.6, 1, 0.45, 0.8].map((delay, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 2,
              height: "100%",
              background: "#7C3AED",
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

function ParcaGorsel({ parca, kucuk = false }: { parca: MuzikParcasi; kucuk?: boolean }) {
  const bg = `linear-gradient(135deg, ${parca.renk1} 0%, ${parca.renk2} 60%, ${parca.renk3 ?? parca.renk2} 100%)`;
  const size = kucuk ? 40 : 72;

  const svgMap: Record<MuzikParcasi["desen"], React.ReactElement> = {
    dalgalar: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.25 }}>
        {[20, 38, 56, 74].map((y, i) => (
          <path key={i} d={`M0,${y} Q25,${y - 12} 50,${y} Q75,${y + 12} 100,${y}`}
            stroke="white" strokeWidth={i === 1 ? 2.5 : 1.5} fill="none" />
        ))}
      </svg>
    ),
    halkalar: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        {[12, 24, 36, 48].map((r, i) => (
          <circle key={i} cx="50" cy="50" r={r} stroke="white" strokeWidth={i === 1 ? 2 : 1.2} fill="none" />
        ))}
      </svg>
    ),
    yildizlar: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.28 }}>
        {[[50,25,8],[20,65,5],[78,55,4],[35,80,3.5],[68,20,3]].map(([cx,cy,r],i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" />
        ))}
        {[[50,10,50,40],[50,60,50,90],[30,35,70,35],[30,65,70,65]].map(([x1,y1,x2,y2],i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={0.8} opacity={0.6} />
        ))}
      </svg>
    ),
    notalar: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        <text x="18" y="52" fontSize="28" fill="white" fontFamily="serif">♩</text>
        <text x="50" y="40" fontSize="22" fill="white" fontFamily="serif">♪</text>
        <text x="68" y="62" fontSize="18" fill="white" fontFamily="serif">♫</text>
        <text x="30" y="75" fontSize="14" fill="white" fontFamily="serif">♬</text>
      </svg>
    ),
    kristal: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
        {[[50,20],[26,35],[26,65],[50,80],[74,65],[74,35]].map(([x,y],i,arr) => (
          <line key={i} x1={x} y1={y} x2={arr[(i+1)%arr.length][0]} y2={arr[(i+1)%arr.length][1]}
            stroke="white" strokeWidth={1.4} />
        ))}
        <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth={0.8} />
        <line x1="26" y1="35" x2="74" y2="65" stroke="white" strokeWidth={0.8} />
        <line x1="74" y1="35" x2="26" y2="65" stroke="white" strokeWidth={0.8} />
      </svg>
    ),
    soyut: (
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", opacity: 0.2 }}>
        <ellipse cx="38" cy="50" rx="30" ry="18" stroke="white" strokeWidth={1.5} fill="none" transform="rotate(-20 38 50)" />
        <ellipse cx="62" cy="50" rx="30" ry="18" stroke="white" strokeWidth={1.5} fill="none" transform="rotate(20 62 50)" />
        <ellipse cx="50" cy="40" rx="22" ry="12" stroke="white" strokeWidth={1} fill="none" />
      </svg>
    ),
  };

  return (
    <div style={{
      width: size, height: size,
      borderRadius: kucuk ? 8 : 10,
      background: bg,
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{ position: "absolute", inset: 0 }}>{svgMap[parca.desen]}</div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)",
      }} />
    </div>
  );
}

function ParcaKarti({
  parca, secili, caliyor, onSec, onOnizle,
}: {
  parca: MuzikParcasi; secili: boolean; caliyor: boolean;
  onSec: () => void; onOnizle: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onSec}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-150 ${
        secili
          ? "border-purple-400 shadow-sm shadow-purple-100"
          : hover
          ? "border-gray-200 shadow-sm"
          : "border-gray-100"
      }`}
      style={{ background: secili ? "#faf5ff" : hover ? "#f9fafb" : "#fff" }}
    >
      {/* Artwork */}
      <div className="relative overflow-hidden" style={{ height: 72 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${parca.renk1} 0%, ${parca.renk2} 60%, ${parca.renk3 ?? parca.renk2} 100%)`,
        }} />
        <div style={{ position: "absolute", inset: 0 }}>
          <ParcaGorsel parca={parca} />
        </div>
        {/* Play overlay */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: caliyor ? "rgba(0,0,0,0.28)" : hover ? "rgba(0,0,0,0.15)" : "transparent",
          transition: "background 0.15s ease",
        }}>
          <button
            type="button"
            onClick={onOnizle}
            className="flex items-center justify-center rounded-full transition-all duration-150"
            style={{
              width: 30, height: 30,
              background: "rgba(255,255,255,0.92)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
              opacity: caliyor || hover ? 1 : 0,
              transform: caliyor || hover ? "scale(1)" : "scale(0.7)",
              transition: "all 0.15s ease",
            }}
          >
            {caliyor
              ? <Esitleyici />
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="#374151"><path d="M8 5.14v14l11-7-11-7z" /></svg>
            }
          </button>
        </div>
        {/* Selected badge */}
        {secili && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="px-2.5 py-2">
        <p className={`text-xs font-semibold truncate leading-tight ${secili ? "text-purple-700" : "text-gray-800"}`}>
          {parca.baslik}
        </p>
        <p className="flex justify-between text-[10px] text-gray-400 mt-0.5">
          <span className="truncate mr-1">{parca.sanatci}</span>
          <span className="shrink-0">{parca.sure}</span>
        </p>
      </div>
    </div>
  );
}

export default function MuzikSecici({ secili, onChange }: Props) {
  const [kategori, setKategori] = useState<MuzikKategori | "tumu">("tumu");
  const [calanId, setCalanId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, []);

  const liste = kategori === "tumu"
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
    onChange(secili === parca.url ? null : parca.url);
  }

  return (
    <div className="space-y-3">
      {/* Seçili parça özet */}
      {seciliParca && (
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5">
          <ParcaGorsel parca={seciliParca} kucuk />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-purple-700 truncate">{seciliParca.baslik}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{seciliParca.sanatci} · {seciliParca.sure}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Kategori sekmeleri */}
      <div className="flex gap-1.5 flex-wrap">
        {KATEGORILER.map((k) => {
          const aktif = kategori === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => setKategori(k.id as MuzikKategori | "tumu")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                aktif
                  ? "border-purple-400 bg-purple-50 text-purple-700"
                  : "border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {k.etiket}
            </button>
          );
        })}
      </div>

      {/* Parça ızgarası */}
      <div className="grid grid-cols-2 gap-2">
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

      <p className="text-[10px] text-gray-300 text-center">
        Tüm parçalar telifsiz lisanslıdır · ▶ ile önizleyin
      </p>
    </div>
  );
}
