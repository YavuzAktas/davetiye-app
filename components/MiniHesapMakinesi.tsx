"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DAVETIYE_FIYAT_KALEMLERI, ASIL_FIYAT_KODU, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

const K = DAVETIYE_FIYAT_KALEMLERI;

const EKLER = [
  { ...K.muzik,      icon: "🎵", kisa: "Müzik"         },
  { ...K.album,      icon: "📸", kisa: "Fotoğraf albümü"},
  { ...K.aniDefteri, icon: "💌", kisa: "Anı defteri"    },
  { ...K.aniKitabi,  icon: "📖", kisa: "Anı Kitabı PDF" },
  { ...K.canliDuvar, icon: "📺", kisa: "Canlı duvar"    },
  { ...K.sesliAni,   icon: "🎙️", kisa: "Sesli anı"      },
  { ...K.checkIn,     icon: "✅", kisa: "QR check-in"     },
  { ...K.luksSablon, icon: "✨", kisa: "Lüks şablon"    },
  { ...K.oturmaPlan, icon: "🪑", kisa: "Oturma planı"   },
];

const TEMEL = K.temel.tutar;
const VARSAYILAN = new Set([K.muzik.kod, K.album.kod]);

function useAnimatedNumber(target: number, duration = 400) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return display;
}

export default function MiniHesapMakinesi() {
  const [secili, setSecili] = useState<Set<string>>(new Set(VARSAYILAN));

  const toggle = (kod: string) =>
    setSecili(prev => { const s = new Set(prev); s.has(kod) ? s.delete(kod) : s.add(kod); return s; });

  const ekToplam = EKLER.filter(e => secili.has(e.kod)).reduce((a, e) => a + e.tutar, 0);
  const toplam = TEMEL + ekToplam;
  const asılEk = EKLER.filter(e => secili.has(e.kod)).reduce((a, e) => a + (ASIL_FIYAT_KODU[e.kod] ?? e.tutar), 0);
  const asılToplam = (ASIL_FIYAT_KODU[K.temel.kod] ?? TEMEL) + asılEk;
  const tasarruf = asılToplam - toplam;

  const animatedToplam = useAnimatedNumber(toplam);

  return (
    <div className="rounded-3xl border border-purple-100 bg-white shadow-sm overflow-hidden">
      <div className="h-1 bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-purple-500/70 mb-1">Kendi fiyatını hesapla</p>
            <p className="text-sm text-gray-400">İstediğin eklentileri seç — toplam anında güncellenir</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              {tasarruf > 0 && (
                <p className="text-xs text-gray-400 line-through tabular-nums">{tutarMetni(asılToplam)}</p>
              )}
              <p className="text-3xl font-black text-gray-900 tabular-nums leading-none">{tutarMetni(animatedToplam)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">tek seferlik · sınırsız misafir</p>
            </div>
          </div>
        </div>

        {/* Temel — daima dahil */}
        <div className="flex items-center justify-between px-4 py-3 mb-3 rounded-2xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2.5">
            <span className="text-base">✉️</span>
            <div>
              <p className="text-sm font-semibold text-gray-700">Dijital davetiye</p>
              <p className="text-[11px] text-gray-400">RSVP · paylaşım linki · yönetim paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-purple-600">{tutarMetni(TEMEL)}</span>
            <span className="text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full tracking-wide">DAİMA DAHİL</span>
          </div>
        </div>

        {/* Eklentiler — 2 sütun */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
          {EKLER.map(ek => {
            const aktif = secili.has(ek.kod);
            return (
              <button
                key={ek.kod}
                type="button"
                onClick={() => toggle(ek.kod)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all duration-200 ${
                  aktif
                    ? "border-purple-200 bg-purple-50 shadow-xs"
                    : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-base shrink-0 transition-opacity ${aktif ? "opacity-100" : "opacity-35"}`}>{ek.icon}</span>
                  <p className={`text-sm font-medium truncate transition-colors ${aktif ? "text-gray-800" : "text-gray-400"}`}>{ek.kisa}</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className={`text-sm font-bold tabular-nums transition-colors ${aktif ? "text-purple-600" : "text-gray-300"}`}>
                    +{tutarMetni(ek.tutar)}
                  </span>
                  <div className={`relative w-9 h-5 rounded-full transition-all duration-250 shrink-0 ${aktif ? "bg-purple-600" : "bg-gray-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-250 shadow-xs ${aktif ? "left-4.5" : "left-0.5"}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Alt satır — tasarruf + CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {tasarruf > 0 && (
            <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
              Baskılıya göre <strong>{tutarMetni(2000 - toplam > 0 ? 2000 - toplam : tasarruf)}</strong> ucuz
            </p>
          )}
          <Link
            href="/sablonlar"
            className="sm:ml-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-6 py-3 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200 w-full sm:w-auto"
          >
            Davetiyeni Oluştur
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
