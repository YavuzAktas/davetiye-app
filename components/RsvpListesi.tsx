"use client";

import { useState } from "react";

const DIYET_EMOJI: Record<string, string> = {
  vegan: "🌱", vejetaryen: "🥗", glutensiz: "🌾", laktozsuz: "🥛",
};

type RsvpCevaplar = {
  ulasim?: boolean;
  cocuk?: number;
  alerji?: string;
  ozelSoru?: string;
  ozelCevap?: string;
};

type RsvpItem = {
  id: string;
  ad: string;
  email: string | null;
  mesaj: string | null;
  katilim: boolean;
  kisiSayisi: number;
  diyet: string | null;
  sarkiOnerisi: string | null;
  cevaplar: RsvpCevaplar | null;
};

type BekleyenItem = {
  davetliId: string;
  ad: string;
  email: string | null;
};

type YuklenenAlan = { id: string; alan: "katilim" | "kisi" } | null;
type Parlayan = { id: string; tur: "yesil" | "kirmizi" } | null;
type BekleyenYukleniyor = string | null;

function MesajBloku({ metin, renk }: { metin: string; renk: string }) {
  const [acik, setAcik] = useState(false);
  const uzun = metin.length > 140;
  return (
    <div
      className="mt-3 rounded-xl px-4 py-3"
      style={{ background: renk + "08", borderLeft: `3px solid ${renk}40` }}
    >
      <p className={`text-xs text-gray-600 leading-relaxed whitespace-pre-wrap ${!acik && uzun ? "line-clamp-3" : ""}`}>
        &ldquo;{metin}&rdquo;
      </p>
      {uzun && (
        <button
          onClick={() => setAcik(a => !a)}
          className="text-[11px] font-semibold mt-1.5 transition-colors"
          style={{ color: renk }}
        >
          {acik ? "Küçült ↑" : "Devamını gör ↓"}
        </button>
      )}
    </div>
  );
}

function CevapPiller({ cevaplar }: { cevaplar: RsvpCevaplar | null }) {
  if (!cevaplar) return null;
  const items: { icon: string; label: string; text: string }[] = [];
  if (cevaplar.ulasim != null)
    items.push({ icon: "🚌", label: "Servis", text: cevaplar.ulasim ? "Evet" : "Hayır" });
  if (cevaplar.cocuk != null && cevaplar.cocuk > 0)
    items.push({ icon: "👶", label: "Çocuk", text: `${cevaplar.cocuk} kişi` });
  if (cevaplar.alerji)
    items.push({ icon: "⚠️", label: "Alerji", text: cevaplar.alerji });
  if (cevaplar.ozelSoru && cevaplar.ozelCevap)
    items.push({ icon: "💬", label: cevaplar.ozelSoru, text: cevaplar.ozelCevap });
  else if (cevaplar.ozelCevap)
    items.push({ icon: "💬", label: "Cevap", text: cevaplar.ozelCevap });
  if (items.length === 0) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 text-[11px] bg-white border border-gray-100 text-gray-600 px-2.5 py-1 rounded-lg shadow-sm"
        >
          <span className="text-xs">{item.icon}</span>
          <span className="text-gray-400">{item.label}:</span>
          <span className="font-medium text-gray-700">{item.text}</span>
        </span>
      ))}
    </div>
  );
}

export default function RsvpListesi({
  baslangicRsvplar,
  baslangicBekleyenler = [],
  slug,
  renk,
}: {
  baslangicRsvplar: RsvpItem[];
  baslangicBekleyenler?: BekleyenItem[];
  slug: string;
  renk: string;
}) {
  const [rsvplar, setRsvplar]         = useState<RsvpItem[]>(baslangicRsvplar);
  const [bekleyenler, setBekleyenler] = useState<BekleyenItem[]>(baslangicBekleyenler);
  const [yukleniyor, setYukleniyor]   = useState<YuklenenAlan>(null);
  const [parlayan, setParlayan]       = useState<Parlayan>(null);
  const [bekleyenYuk, setBekleyenYuk] = useState<BekleyenYukleniyor>(null);

  const katilimlar    = rsvplar.filter(r => r.katilim);
  const katilmayanlar = rsvplar.filter(r => !r.katilim);
  const toplamKisi    = katilimlar.reduce((a, r) => a + r.kisiSayisi, 0);
  const katilimYuzde  = rsvplar.length
    ? Math.round((katilimlar.length / rsvplar.length) * 100)
    : 0;

  const guncelle = async (
    id: string,
    alan: "katilim" | "kisi",
    veri: Record<string, unknown>,
    oncekiDeger: Partial<RsvpItem>,
    flashTur: "yesil" | "kirmizi",
  ) => {
    setYukleniyor({ id, alan });
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/rsvp/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veri),
      });
      if (!res.ok) throw new Error();
      setParlayan({ id, tur: flashTur });
      setTimeout(() => setParlayan(null), 1200);
    } catch {
      setRsvplar(prev => prev.map(r => r.id === id ? { ...r, ...oncekiDeger } : r));
      setParlayan({ id, tur: "kirmizi" });
      setTimeout(() => setParlayan(null), 1200);
    } finally {
      setYukleniyor(null);
    }
  };

  const toggleKatilim = (rsvp: RsvpItem) => {
    const yeniDurum = !rsvp.katilim;
    setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, katilim: yeniDurum } : r));
    guncelle(rsvp.id, "katilim", { katilim: yeniDurum }, { katilim: rsvp.katilim }, yeniDurum ? "yesil" : "kirmizi");
  };

  const bekleyenDurumAta = async (item: BekleyenItem, katilim: boolean) => {
    setBekleyenYuk(item.davetliId);
    try {
      const res = await fetch(`/api/dashboard/davetiye/${slug}/rsvp-manuel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ davetliId: item.davetliId, katilim, kisiSayisi: 1 }),
      });
      if (!res.ok) throw new Error();
      const { rsvpId } = await res.json();
      setBekleyenler(prev => prev.filter(b => b.davetliId !== item.davetliId));
      setRsvplar(prev => [{
        id: rsvpId,
        ad: item.ad,
        email: item.email,
        mesaj: null,
        katilim,
        kisiSayisi: 1,
        diyet: null,
        sarkiOnerisi: null,
        cevaplar: null,
      }, ...prev]);
    } catch {
      /* sessiz hata */
    } finally {
      setBekleyenYuk(null);
    }
  };

  const kisiDegistir = (rsvp: RsvpItem, delta: number) => {
    const yeniSayi = Math.max(1, Math.min(20, rsvp.kisiSayisi + delta));
    if (yeniSayi === rsvp.kisiSayisi) return;
    setRsvplar(prev => prev.map(r => r.id === rsvp.id ? { ...r, kisiSayisi: yeniSayi } : r));
    guncelle(rsvp.id, "kisi", { kisiSayisi: yeniSayi }, { kisiSayisi: rsvp.kisiSayisi }, "yesil");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">

      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-3">
              Katılım Bildirimleri
            </p>
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: renk + "15", color: renk }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: renk }} />
                {katilimlar.length} katılıyor
              </span>
              {katilmayanlar.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-300" />
                  {katilmayanlar.length} katılamıyor
                </span>
              )}
              {bekleyenler.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {bekleyenler.length} bekleniyor
                </span>
              )}
              {toplamKisi > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-50 text-gray-500">
                  👥 {toplamKisi} kişi
                </span>
              )}
            </div>
          </div>

          {rsvplar.length > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold tabular-nums leading-none" style={{ color: renk }}>
                %{katilimYuzde}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">katılım oranı</p>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2 ml-auto">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${katilimYuzde}%`, backgroundColor: renk }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Liste ── */}
      {rsvplar.length === 0 && bekleyenler.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: renk + "10" }}
          >
            📭
          </div>
          <p className="text-gray-600 text-sm font-semibold">Henüz yanıt yok</p>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
            Davetiyeyi paylaşınca<br />bildirimler burada görünecek
          </p>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          {rsvplar.map((rsvp) => {
            const satirYukleniyor = yukleniyor?.id === rsvp.id;
            const parlayanDurum   = parlayan?.id === rsvp.id ? parlayan.tur : null;

            return (
              <div
                key={rsvp.id}
                className="rounded-2xl border p-4 transition-all duration-500"
                style={{
                  borderColor: parlayanDurum === "yesil"
                    ? "#bbf7d0"
                    : parlayanDurum === "kirmizi"
                    ? "#fecaca"
                    : rsvp.katilim ? renk + "25" : "#fee2e2",
                  backgroundColor: parlayanDurum === "yesil"
                    ? "#f0fdf4"
                    : parlayanDurum === "kirmizi"
                    ? "#fff1f2"
                    : rsvp.katilim ? renk + "06" : "#fff9f9",
                }}
              >
                {/* Üst satır: avatar · isim · email · badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors"
                    style={rsvp.katilim
                      ? { backgroundColor: renk + "22", color: renk }
                      : { backgroundColor: "#fee2e2", color: "#f87171" }
                    }
                  >
                    {rsvp.ad[0]?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{rsvp.ad}</p>
                    {rsvp.email && (
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">{rsvp.email}</p>
                    )}
                  </div>

                  <button
                    onClick={() => !satirYukleniyor && toggleKatilim(rsvp)}
                    disabled={satirYukleniyor}
                    title="Katılım durumunu değiştir"
                    className="text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 transition-all disabled:opacity-60"
                    style={rsvp.katilim
                      ? { background: renk + "18", color: renk }
                      : { background: "#fee2e2", color: "#f87171" }
                    }
                  >
                    {satirYukleniyor && yukleniyor?.alan === "katilim"
                      ? "..."
                      : rsvp.katilim ? "✓ Katılıyor" : "✗ Katılmıyor"}
                  </button>
                </div>

                {/* Kişi sayısı + diyet */}
                {rsvp.katilim && (
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <div
                      className="flex items-center gap-1 rounded-xl px-2 py-1"
                      style={{ background: renk + "12" }}
                    >
                      <button
                        onClick={() => !satirYukleniyor && kisiDegistir(rsvp, -1)}
                        disabled={satirYukleniyor || rsvp.kisiSayisi <= 1}
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-30"
                        style={{ background: renk + "25", color: renk }}
                      >−</button>
                      <span
                        className="text-xs font-semibold tabular-nums px-1.5 min-w-14 text-center"
                        style={{ color: renk }}
                      >
                        {satirYukleniyor && yukleniyor?.alan === "kisi" ? "..." : `${rsvp.kisiSayisi} kişi`}
                      </span>
                      <button
                        onClick={() => !satirYukleniyor && kisiDegistir(rsvp, 1)}
                        disabled={satirYukleniyor || rsvp.kisiSayisi >= 20}
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-30"
                        style={{ background: renk + "25", color: renk }}
                      >+</button>
                    </div>

                    {rsvp.diyet && rsvp.diyet.split(",").map(d => (
                      <span
                        key={d}
                        className="text-[11px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-1 rounded-lg font-medium"
                      >
                        {DIYET_EMOJI[d.trim()] ?? "🍽️"} {d.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mesaj */}
                {rsvp.mesaj && <MesajBloku metin={rsvp.mesaj} renk={renk} />}

                {/* Özel cevaplar */}
                {rsvp.katilim && <CevapPiller cevaplar={rsvp.cevaplar} />}

                {/* Şarkı önerisi */}
                {rsvp.sarkiOnerisi && (
                  <div className="mt-2.5">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                      style={{ background: renk + "12", color: renk }}
                    >
                      🎵 {rsvp.sarkiOnerisi}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Bekleniyor davetliler ── */}
          {bekleyenler.length > 0 && (
            <>
              {rsvplar.length > 0 && (
                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Bekleniyor</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
              )}
              {bekleyenler.map(item => (
                <div
                  key={item.davetliId}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 bg-gray-200 text-gray-400">
                      {item.ad[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-700 text-sm leading-tight">{item.ad}</p>
                      {item.email && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => bekleyenYuk !== item.davetliId && bekleyenDurumAta(item, true)}
                        disabled={bekleyenYuk === item.davetliId}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-emerald-200"
                        style={{ background: renk + "15", color: renk }}
                      >
                        {bekleyenYuk === item.davetliId ? "..." : "✓ Katılıyor"}
                      </button>
                      <button
                        onClick={() => bekleyenYuk !== item.davetliId && bekleyenDurumAta(item, false)}
                        disabled={bekleyenYuk === item.davetliId}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-red-50 text-red-400 transition-all disabled:opacity-50 border border-transparent hover:border-red-200"
                      >
                        {bekleyenYuk === item.davetliId ? "..." : "✗ Katılamıyor"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
