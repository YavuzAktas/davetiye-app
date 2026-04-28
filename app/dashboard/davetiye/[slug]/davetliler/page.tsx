"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Davetli {
  id: string;
  ad: string;
  telefon?: string;
  email?: string;
}

interface Davetiye {
  id: string;
  baslik: string;
  slug: string;
  sablon: string;
}

const SABLON_RENKLER: Record<string, string> = {
  "klasik-dugun": "#7C3AED", "romantik-dugun": "#DB2777", "altin-dugun": "#B45309",
  "modern-dugun": "#111827", "bahar-dugun": "#059669", "mavi-dugun": "#1D4ED8",
  "gul-dugun": "#E11D48", "modern-nisan": "#0891B2", "romantik-nisan": "#BE185D",
  "altin-nisan": "#92400E", "mor-nisan": "#6D28D9", "nisan-luks": "#C9A96E",
  "eglenceli-dogumgunu": "#D97706", "sade-dogumgunu": "#059669",
  "cocuk-dogumgunu": "#7C3AED", "pembe-dogumgunu": "#EC4899",
  "mavi-dogumgunu": "#2563EB", "altin-dogumgunu": "#B45309",
  "geleneksel-sunnet": "#1D4ED8", "modern-sunnet": "#0369A1",
  "altin-sunnet": "#92400E", "yildiz-sunnet": "#4338CA",
  "geleneksel-kina": "#B45309", "modern-kina": "#BE185D", "altin-kina": "#92400E",
  "kurumsal-toplanti": "#1E40AF", "kurumsal-etkinlik": "#374151", "kurumsal-kutlama": "#065F46",
  "mezuniyet": "#1D4ED8", "yildonumu": "#DC2626", "bebek-partisi": "#7C3AED",
};

export default function DavetlilerSayfasi() {
  const params = useParams();
  const slug = params.slug as string;

  const [davetiye, setDavetiye] = useState<Davetiye | null>(null);
  const [davetliler, setDavetliler] = useState<Davetli[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniAd, setYeniAd] = useState("");
  const [yeniTelefon, setYeniTelefon] = useState("");
  const [yeniEmail, setYeniEmail] = useState("");
  const [topluMetin, setTopluMetin] = useState("");
  const [aktifTab, setAktifTab] = useState<"liste" | "toplu" | "import">("liste");
  const [ekleniyor, setEkleniyor] = useState(false);
  const [siliniyor, setSiliniyor] = useState<string | null>(null);

  const renk = davetiye ? (SABLON_RENKLER[davetiye.sablon] ?? "#7C3AED") : "#7C3AED";

  const davetlileriYukle = useCallback(async (davetiyeId: string) => {
    const res = await fetch(`/api/davetli?davetiyeId=${davetiyeId}`);
    const data = await res.json();
    setDavetliler(data.davetliler || []);
  }, []);

  useEffect(() => {
    const yukle = async () => {
      const res = await fetch(`/api/davetiye/${slug}`);
      const data = await res.json();
      setDavetiye(data.davetiye);
      if (data.davetiye) await davetlileriYukle(data.davetiye.id);
      setYukleniyor(false);
    };
    yukle();
  }, [slug, davetlileriYukle]);

  const davetliEkle = async () => {
    if (!yeniAd.trim() || !davetiye) return;
    setEkleniyor(true);
    await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        davetiyeId: davetiye.id,
        davetliler: [{ ad: yeniAd, telefon: yeniTelefon, email: yeniEmail }],
      }),
    });
    setYeniAd(""); setYeniTelefon(""); setYeniEmail("");
    await davetlileriYukle(davetiye.id);
    setEkleniyor(false);
  };

  const davetliSil = async (id: string) => {
    setSiliniyor(id);
    await fetch("/api/davetli", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (davetiye) await davetlileriYukle(davetiye.id);
    setSiliniyor(null);
  };

  const topluImport = async () => {
    if (!topluMetin.trim() || !davetiye) return;
    const davetlilerListesi = topluMetin.trim().split("\n")
      .map(satir => {
        const p = satir.split(",").map(s => s.trim());
        return { ad: p[0] || "", telefon: p[1] || "", email: p[2] || "" };
      }).filter(d => d.ad);
    await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ davetiyeId: davetiye.id, davetliler: davetlilerListesi }),
    });
    setTopluMetin("");
    await davetlileriYukle(davetiye.id);
    setAktifTab("liste");
  };

  const whatsappMesaj = () => {
    if (!davetiye) return "";
    const link = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`;
    return encodeURIComponent(`Sayın misafirimiz,\n\n${davetiye.baslik} etkinliğimize davetlisiniz.\n\nDavetiyeniz: ${link}`);
  };

  if (yukleniyor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const tabSayac = {
    liste: davetliler.length,
    toplu: davetliler.filter(d => d.telefon).length,
    import: null,
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Header ── */}
      <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="text-xs text-gray-400">
                {davetiye?.baslik ?? "Davetiye"} ·{" "}
                <span className="font-semibold" style={{ color: renk }}>
                  {davetliler.length} davetli
                </span>
              </p>
              <h1 className="text-base font-bold text-gray-900">Davetli Listesi</h1>
            </div>
          </div>

          {/* Add quick button on mobile */}
          <button
            onClick={() => setAktifTab("liste")}
            className="sm:hidden text-xs font-bold px-3 py-2 rounded-xl text-white"
            style={{ backgroundColor: renk }}
          >
            + Ekle
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
          {[
            { id: "liste", label: "Davetliler", count: tabSayac.liste },
            { id: "toplu", label: "Toplu Paylaş", count: tabSayac.toplu },
            { id: "import", label: "İçe Aktar", count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAktifTab(tab.id as typeof aktifTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                aktifTab === tab.id
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    aktifTab === tab.id ? "text-white" : "bg-gray-200 text-gray-500"
                  }`}
                  style={aktifTab === tab.id ? { backgroundColor: renk } : {}}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Liste Tab ── */}
        {aktifTab === "liste" && (
          <div className="space-y-4">
            {/* Add Form */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Yeni Davetli Ekle</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Ad Soyad *"
                  value={yeniAd}
                  onChange={e => setYeniAd(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && davetliEkle()}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ ["--tw-ring-color" as string]: renk + "44" }}
                />
                <input
                  type="tel"
                  placeholder="Telefon (opsiyonel)"
                  value={yeniTelefon}
                  onChange={e => setYeniTelefon(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
                />
                <input
                  type="email"
                  placeholder="E-posta (opsiyonel)"
                  value={yeniEmail}
                  onChange={e => setYeniEmail(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
                />
              </div>
              <button
                onClick={davetliEkle}
                disabled={!yeniAd.trim() || ekleniyor}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: renk }}
              >
                {ekleniyor ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                Davetli Ekle
              </button>
            </div>

            {/* List */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              {davetliler.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👥</div>
                  <p className="text-gray-500 text-sm font-medium">Henüz davetli eklenmedi</p>
                  <p className="text-gray-300 text-xs mt-1">Yukarıdaki formu kullanarak davetli ekleyin</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                      {davetliler.length} Davetli
                    </p>
                    <p className="text-xs text-gray-400">
                      {davetliler.filter(d => d.telefon).length} telefon · {davetliler.filter(d => d.email).length} e-posta
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {davetliler.map((davetli, i) => (
                      <div key={davetli.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: renk + "15", color: renk }}
                        >
                          {davetli.ad[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{davetli.ad}</p>
                          <div className="flex gap-3 mt-0.5 flex-wrap">
                            {davetli.telefon && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <span className="text-gray-300">📱</span> {davetli.telefon}
                              </span>
                            )}
                            {davetli.email && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <span className="text-gray-300">✉️</span> {davetli.email}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => davetliSil(davetli.id)}
                          disabled={siliniyor === davetli.id}
                          className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all font-medium disabled:opacity-40"
                        >
                          {siliniyor === davetli.id ? "..." : "Sil"}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Toplu Paylaş Tab ── */}
        {aktifTab === "toplu" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">WhatsApp Toplu Paylaşım</p>
                <p className="text-xs text-gray-400 mt-1">Her davetli için ayrı WhatsApp linki. Sadece telefon numarası girilenlere gönderilebilir.</p>
              </div>

              {davetliler.filter(d => d.telefon).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📱</div>
                  <p className="text-gray-500 text-sm font-medium">Telefon numarası olan davetli yok</p>
                  <p className="text-gray-300 text-xs mt-1">Davetli listesine telefon numarası ekleyin</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {davetliler.filter(d => d.telefon).map(davetli => (
                    <div key={davetli.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: renk + "15", color: renk }}
                      >
                        {davetli.ad[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{davetli.ad}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{davetli.telefon}</p>
                      </div>
                      <a
                        href={`https://wa.me/${davetli.telefon?.replace(/\D/g, "")}?text=${whatsappMesaj()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] text-white text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold shrink-0"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Gönder
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Import Tab ── */}
        {aktifTab === "import" && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Toplu İçe Aktar</p>
            <p className="text-xs text-gray-400 mb-5">
              Her satıra bir davetli. Format:{" "}
              <code className="bg-gray-100 px-2 py-0.5 rounded-lg font-mono text-gray-600">Ad Soyad, Telefon, Email</code>
            </p>
            <textarea
              rows={8}
              placeholder={`Ahmet Yılmaz, 05001234567, ahmet@mail.com\nAyşe Kaya, 05009876543\nMehmet Demir`}
              value={topluMetin}
              onChange={e => setTopluMetin(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 resize-none mb-4 bg-gray-50"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={topluImport}
                disabled={!topluMetin.trim()}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: renk }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                İçe Aktar
              </button>
              <p className="text-xs text-gray-400">
                {topluMetin.trim().split("\n").filter(s => s.trim()).length} satır hazır
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
