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

  const secilenler  = OZELLIKLER.filter(o => secili.has(o.kod));
  const ekToplam    = secilenler.reduce((a, o) => a + o.tutar, 0);
  const toplam      = TEMEL.tutar + ekToplam;
  const kisiBasi    = Math.ceil(toplam / 100);
  const tasarruf    = BASKILI_MIN - toplam;
  const asılEkToplam = secilenler.reduce((a, o) => a + (ASIL_FIYAT_KODU[o.kod] ?? o.tutar), 0);
  const asılToplam  = (ASIL_FIYAT_KODU[TEMEL.kod] ?? TEMEL.tutar) + asılEkToplam;
  const toplamIndirim = indirimOrani(asılToplam, toplam);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 items-start">

      {/* ── Özet kart — mobilde önce, desktopda sağda ── */}
      <div className="order-first lg:order-last lg:sticky lg:top-24">
        <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">

          {/* Gradient başlık bandı */}
          <div className="h-1 bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500" />

          <div className="p-5">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-purple-400/70 mb-3">
              Tahmini Toplam
            </p>

            {/* Büyük toplam */}
            <div className="mb-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm tabular-nums text-white/30 line-through">{tutarMetni(asılToplam)}</span>
                <span className="text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }}>
                  %{toplamIndirim} İNDİRİM
                </span>
              </div>
              <span className="text-4xl font-black text-white tabular-nums leading-none">
                {tutarMetni(toplam)}
              </span>
              <p className="text-xs text-white/30 mt-1.5">tek seferlik · sınırsız misafir</p>
            </div>

            {/* Kişi başı + tasarruf */}
            <div className="flex items-center gap-2 mt-3 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-white/6 border border-white/8 rounded-full px-2.5 py-1 text-[11px] text-white/50">
                👥 100 misafir için kişi başı <strong className="text-white/80 ml-0.5">{tutarMetni(kisiBasi)}</strong>
              </span>
              {tasarruf > 0 && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 text-[11px] text-emerald-400">
                  ↓ Baskılıya göre {tutarMetni(tasarruf)} ucuz
                </span>
              )}
            </div>

            {/* Line items */}
            <div className="space-y-2 border-t border-white/8 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/45 flex items-center gap-1.5">
                  <span>✉️</span> Dijital davetiye
                </span>
                <span className="text-xs font-semibold text-white/65">{tutarMetni(TEMEL.tutar)}</span>
              </div>
              {secilenler.map(o => (
                <div key={o.kod} className="flex justify-between items-center">
                  <span className="text-xs text-white/45 truncate mr-2 flex items-center gap-1.5">
                    <span>{o.icon}</span> {o.ad}
                  </span>
                  <span className="text-xs font-semibold text-purple-300 shrink-0">+{tutarMetni(o.tutar)}</span>
                </div>
              ))}
              {secilenler.length === 0 && (
                <p className="text-xs text-white/20 italic">Ek özellik seçilmedi</p>
              )}
            </div>

            {/* CTA */}
            <Link
              href={baslaHref}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ boxShadow: "0 8px 28px rgba(124,58,237,0.45)" }}
            >
              {baslaMetni}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <p className="text-center text-[11px] text-white/20 mt-3">
              Ödeme sonrası davetiye hemen yayına alınır
            </p>

            {/* Güvenli ödeme logoları */}
            <div className="mt-4 pt-4 border-t border-white/8 flex flex-col items-center gap-1.5">
              <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/18">Güvenli ödeme altyapısı</p>
              <div className="relative h-5 w-56 opacity-50">
                <Image
                  src="/logo_band_white@3x.png"
                  alt="iyzico, Mastercard, Visa, AmEx, Troy"
                  fill
                  sizes="224px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Özellik listesi — mobilde sonra, desktopda solda ── */}
      <div className="order-last lg:order-first space-y-2">

        {/* Temel — her zaman dahil */}
        <div className="flex items-center justify-between px-4 py-4 rounded-2xl border border-purple-500/25 bg-purple-500/8">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl shrink-0">✉️</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-white">Dijital davetiye</p>
                <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-full tracking-wide">
                  DAİMA DAHİL
                </span>
              </div>
              <p className="text-xs text-white/35 mt-0.5">RSVP · paylaşım linki · yönetim paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <div className="text-right">
              <p className="text-[11px] tabular-nums text-white/25 line-through leading-none mb-0.5">
                {tutarMetni(ASIL_FIYAT_KODU[TEMEL.kod] ?? TEMEL.tutar)}
              </p>
              <span className="text-sm font-bold text-purple-300">{tutarMetni(TEMEL.tutar)}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
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
                  ? "border-purple-500/30 bg-purple-500/10 shadow-lg shadow-purple-900/20"
                  : "border-white/6 bg-white/2 hover:bg-white/4 hover:border-white/12"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* İkon */}
                <span className={`text-xl shrink-0 transition-opacity duration-200 ${aktif ? "opacity-100" : "opacity-40"}`}>
                  {ozellik.icon}
                </span>

                <div className="min-w-0">
                  {/* İsim + rozet */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-semibold transition-colors duration-200 ${
                      aktif ? "text-white" : "text-white/40"
                    }`}>
                      {ozellik.ad}
                    </p>
                    {ozellik.rozet && (
                      <span className="text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded-full tracking-wide">
                        {ozellik.rozet.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 truncate transition-colors duration-200 ${
                    aktif ? "text-white/40" : "text-white/20"
                  }`}>
                    {ozellik.desc}
                  </p>
                </div>
              </div>

              {/* Fiyat + toggle */}
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <p className="text-[11px] tabular-nums text-white/20 line-through leading-none mb-0.5">
                    {tutarMetni(ASIL_FIYAT_KODU[ozellik.kod] ?? ozellik.tutar)}
                  </p>
                  <span className={`text-sm font-bold tabular-nums transition-colors duration-200 ${
                    aktif ? "text-purple-300" : "text-white/25"
                  }`}>
                    +{tutarMetni(ozellik.tutar)}
                  </span>
                </div>

                {/* Toggle */}
                <div className={`relative w-10 h-6 rounded-full transition-all duration-300 shrink-0 ${
                  aktif
                    ? "bg-linear-to-r from-purple-600 to-pink-600 shadow-md shadow-purple-900/50"
                    : "bg-white/10"
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${
                    aktif ? "left-[22px]" : "left-1"
                  }`} />
                </div>
              </div>
            </button>
          );
        })}

        {/* Alt not */}
        <p className="text-xs text-white/20 text-center pt-1">
          İstediğiniz özellikleri ekleyip çıkarabilirsiniz
        </p>
      </div>
    </div>
  );
}
