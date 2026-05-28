"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DAVETIYE_FIYAT_KALEMLERI, ASIL_FIYAT_KODU, indirimOrani, tutarMetni } from "@/lib/davetiye-fiyatlandirma";

const OZELLIKLER = [
  {
    ...DAVETIYE_FIYAT_KALEMLERI.luksSablon,
    icon: "✨",
    desc: "Nişan Lüks, Düğün Lüks ve Doğum Günü Lüks şablonlar",
    rozet: null as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.muzik,
    icon: "🎵",
    desc: "Seçilen müzik davetiyede arka planda çalar",
    rozet: "En Popüler" as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.album,
    icon: "📸",
    desc: "Misafirler fotoğraf yükler, sen onaylarsın",
    rozet: "Çok Sevilen" as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.aniDefteri,
    icon: "💌",
    desc: "Misafirler yazılı anı ve iyi dilek bırakır",
    rozet: null as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.canliDuvar,
    icon: "📺",
    desc: "Fotoğraflar salonunuzdaki ekranda canlı akar",
    rozet: null as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.sesliAni,
    icon: "🎙️",
    desc: "Misafirler sesli mesaj bırakır, 30 sn limit",
    rozet: null as string | null,
  },
  {
    ...DAVETIYE_FIYAT_KALEMLERI.oturmaPlan,
    icon: "🪑",
    desc: "Masa ve koltuk düzeni, davetli atama",
    rozet: null as string | null,
  },
];

const VARSAYILAN_SECILI = new Set([
  DAVETIYE_FIYAT_KALEMLERI.muzik.kod,
  DAVETIYE_FIYAT_KALEMLERI.album.kod,
]);

const TEMEL = DAVETIYE_FIYAT_KALEMLERI.temel;
const BASKILI_MIN = 2000;

export default function FiyatHesaplama({
  baslaHref = "/sablonlar",
  baslaMetni = "Davetiye Oluştur",
  luksSablonSecili = false,
}: {
  baslaHref?: string;
  baslaMetni?: string;
  luksSablonSecili?: boolean;
}) {
  const [secili, setSecili] = useState<Set<string>>(() => {
    const varsayilan = new Set<string>(VARSAYILAN_SECILI);
    if (luksSablonSecili) varsayilan.add(DAVETIYE_FIYAT_KALEMLERI.luksSablon.kod);
    return varsayilan;
  });

  const toggle = (kod: string) => {
    setSecili(prev => {
      const s = new Set(prev);
      s.has(kod) ? s.delete(kod) : s.add(kod);
      return s;
    });
  };

  const secilenler    = OZELLIKLER.filter(o => secili.has(o.kod));
  const ekToplam      = secilenler.reduce((a, o) => a + o.tutar, 0);
  const toplam        = TEMEL.tutar + ekToplam;
  const kisiBasi      = Math.ceil(toplam / 100);
  const tasarruf      = BASKILI_MIN - toplam;
  const asılEkToplam  = secilenler.reduce((a, o) => a + (ASIL_FIYAT_KODU[o.kod] ?? o.tutar), 0);
  const asılToplam    = (ASIL_FIYAT_KODU[TEMEL.kod] ?? TEMEL.tutar) + asılEkToplam;
  const toplamIndirim = indirimOrani(asılToplam, toplam);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 items-start">

      {/* ── Özet kart ── */}
      <div className="order-first lg:order-last lg:sticky lg:top-24">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500" />
          <div className="p-5">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-600/70 mb-3">
              Tahmini Toplam
            </p>

            <div className="mb-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm tabular-nums text-gray-400 line-through">{tutarMetni(asılToplam)}</span>
                <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  %{toplamIndirim} İNDİRİM
                </span>
              </div>
              <span className="text-4xl font-black text-gray-900 tabular-nums leading-none">
                {tutarMetni(toplam)}
              </span>
              <p className="text-xs text-gray-400 mt-1.5">tek seferlik · sınırsız misafir</p>
            </div>

            <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 text-[11px] text-gray-500">
                👥 100 misafir için kişi başı <strong className="text-gray-700 ml-0.5">{tutarMetni(kisiBasi)}</strong>
              </span>
              {tasarruf > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 text-[11px] text-emerald-600">
                  ↓ Baskılıya göre {tutarMetni(tasarruf)} ucuz
                </span>
              )}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span>✉️</span> Dijital davetiye
                </span>
                <span className="text-xs font-semibold text-gray-700">{tutarMetni(TEMEL.tutar)}</span>
              </div>
              {secilenler.map(o => (
                <div key={o.kod} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 truncate mr-2 flex items-center gap-1.5">
                    <span>{o.icon}</span> {o.ad}
                  </span>
                  <span className="text-xs font-semibold text-purple-600 shrink-0">+{tutarMetni(o.tutar)}</span>
                </div>
              ))}
              {secilenler.length === 0 && (
                <p className="text-xs text-gray-300 italic">Ek özellik seçilmedi</p>
              )}
            </div>

            <Link
              href={baslaHref}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-sm shadow-purple-200"
            >
              {baslaMetni}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p className="text-center text-[11px] text-gray-400 mt-3">
              Ödeme sonrası davetiye hemen yayına alınır
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center gap-1.5">
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-300">Güvenli ödeme altyapısı</p>
              <div className="relative h-5 w-56" style={{ filter: "invert(1)", opacity: 0.28 }}>
                <Image
                  src="/logo_band_white@3x.png"
                  alt="iyzico, Mastercard, Visa, AmEx, Troy"
                  fill sizes="224px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Özellik listesi ── */}
      <div className="order-last lg:order-first space-y-2">

        {/* Temel — her zaman dahil */}
        <div className="flex items-center justify-between px-4 py-4 rounded-2xl border border-purple-200 bg-purple-50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">✉️</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-gray-800">Dijital davetiye</p>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded-full tracking-wide">
                  DAİMA DAHİL
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">RSVP · paylaşım linki · yönetim paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <div className="text-right">
              <p className="text-[11px] tabular-nums text-gray-300 line-through leading-none mb-0.5">
                {tutarMetni(ASIL_FIYAT_KODU[TEMEL.kod] ?? TEMEL.tutar)}
              </p>
              <span className="text-sm font-bold text-purple-600">{tutarMetni(TEMEL.tutar)}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Eklentiler */}
        {OZELLIKLER.map(ozellik => {
          const aktif = secili.has(ozellik.kod);
          return (
            <button
              key={ozellik.kod}
              type="button"
              onClick={() => toggle(ozellik.kod)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border text-left transition-all duration-200 ${
                aktif
                  ? "border-purple-200 bg-purple-50 shadow-sm shadow-purple-100"
                  : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-xl shrink-0 transition-opacity duration-200 ${aktif ? "opacity-100" : "opacity-40"}`}>
                  {ozellik.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold transition-colors duration-200 ${aktif ? "text-gray-800" : "text-gray-400"}`}>
                      {ozellik.ad}
                    </p>
                    {ozellik.rozet && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full tracking-wide">
                        {ozellik.rozet.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 truncate transition-colors duration-200 ${aktif ? "text-gray-500" : "text-gray-300"}`}>
                    {ozellik.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <p className="text-[11px] tabular-nums text-gray-300 line-through leading-none mb-0.5">
                    {tutarMetni(ASIL_FIYAT_KODU[ozellik.kod] ?? ozellik.tutar)}
                  </p>
                  <span className={`text-sm font-bold tabular-nums transition-colors duration-200 ${aktif ? "text-purple-600" : "text-gray-300"}`}>
                    +{tutarMetni(ozellik.tutar)}
                  </span>
                </div>
                <div className={`relative w-10 h-6 rounded-full transition-all duration-300 shrink-0 ${aktif ? "bg-purple-600" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${aktif ? "left-5.5" : "left-1"}`} />
                </div>
              </div>
            </button>
          );
        })}

        <p className="text-xs text-gray-400 text-center pt-1">
          İstediğiniz özellikleri ekleyip çıkarabilirsiniz
        </p>
      </div>
    </div>
  );
}
