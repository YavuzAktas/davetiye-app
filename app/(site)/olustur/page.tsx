"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SABLONLAR } from "@/lib/sablonlar";
import { PREMIUM_SABLON_IDS, planOzellikVar } from "@/lib/planlar";
import Link from "next/link";
import { getSablonTipi } from "@/lib/sablon-registry";
import { KlasikSablon, NisanLuksSablon, DugunLuksSablon, DogumGunuLuksSablon } from "@/components/sablonlar";
import { DavetiyeVeri } from "@/lib/sablon-tipleri";
import SpotifyMuzikSecici from "@/components/SpotifyMuzikSecici";

const FONTLAR = [
  { id: "font-sans",  isim: "Modern",  style: "system-ui" },
  { id: "font-serif", isim: "Klasik",  style: "Georgia, serif" },
  { id: "font-mono",  isim: "Teknik",  style: "monospace" },
];

const NAT_W = 390;
const SCALE = 204 / NAT_W;

function TelefonMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      <div className="relative rounded-[34px] overflow-hidden"
        style={{ background: "#181818", padding: "12px 8px",
          boxShadow: "0 0 0 1px #333,0 24px 60px rgba(0,0,0,0.5),inset 0 0 0 1px #444" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          style={{ width: 64, height: 20, background: "#181818", borderRadius: "0 0 12px 12px" }}/>
        <div className="rounded-3xl overflow-hidden" style={{ height: 420, background: "#000" }}>
          {children}
        </div>
      </div>
      <div className="absolute right-0 top-20 w-1 h-8 rounded-l bg-gray-700" style={{ right: -1 }}/>
      <div className="absolute left-0 top-16 w-1 h-7 rounded-r bg-gray-700" style={{ left: -1 }}/>
      <div className="absolute left-0 top-28 w-1 h-7 rounded-r bg-gray-700" style={{ left: -1 }}/>
    </div>
  );
}

const INPUT = "w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900";

function OlusturIcerigi() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const sablonId = searchParams.get("sablon") || "klasik-dugun";
  const sablon = SABLONLAR.find(s => s.id === sablonId) || SABLONLAR[0];
  const sablonTipi = getSablonTipi(sablonId);
  const isNisanLuks = sablonId === "nisan-luks";
  const isDugunLuks = sablonId === "dugun-luks";
  const nisanVeyaDugun = sablon.kategori === "nisan" || sablon.kategori === "dugun";

  const isPremiumSablon = PREMIUM_SABLON_IDS.has(sablonId);
  const kullaniciBilinen = session !== undefined;
  const userPlan = (session?.user as any)?.plan ?? "free";
  const premiumEngel = isPremiumSablon && userPlan === "free";

  const [form, setForm] = useState({
    baslik: "", etkinlikTur: sablon.kategori,
    tarih: "", saat: "", mekan: "", mesaj: "",
    font: "font-sans", renk: sablon.renk,
    kisi1: "", kisi2: "", muzik: "",
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata]             = useState("");
  const [aktifTab, setAktifTab]     = useState<"icerik" | "tasarim">("icerik");

  const [notAcik,     setNotAcik]     = useState(false);
  const [muzikAcik,   setMuzikAcik]   = useState(false);
  const [spotifyAcik, setSpotifyAcik] = useState(false);
  const [aniAcik,     setAniAcik]     = useState(false);

  const muzikAktif = planOzellikVar(userPlan, "muzik");
  const aniAktif   = planOzellikVar(userPlan, "album");

  const handleSubmit = async () => {
    if (!form.tarih || !form.mekan) { setHata("Lütfen tarih ve mekan alanlarını doldurun."); return; }
    if (nisanVeyaDugun && (!form.kisi1 || !form.kisi2)) { setHata("Lütfen iki kişinin adını girin."); return; }
    if (!nisanVeyaDugun && !form.baslik) { setHata("Lütfen davetiye başlığını girin."); return; }
    setYukleniyor(true); setHata("");
    const gonderilecekBaslik = nisanVeyaDugun ? `${form.kisi1} & ${form.kisi2}` : form.baslik;
    try {
      const res = await fetch("/api/davetiye/olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          baslik: gonderilecekBaslik,
          sablon: sablonId,
          mesaj:        notAcik     ? form.mesaj : null,
          muzik:        muzikAcik   ? form.muzik : null,
          spotifyAktif: spotifyAcik,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHata(data.hata || "Bir hata oluştu.");
        if (data.upsell) setTimeout(() => router.push("/fiyatlar"), 2000);
        return;
      }
      window.open(`/davetiye/${data.slug}`, "_blank");
    } catch { setHata("Bir hata oluştu, tekrar deneyin."); }
    finally { setYukleniyor(false); }
  };

  const previewVeri: DavetiyeVeri = {
    id: "preview", slug: "preview",
    baslik: nisanVeyaDugun
      ? `${form.kisi1 || "Kişi 1"} & ${form.kisi2 || "Kişi 2"}`
      : form.baslik || "Davetiye Başlığı",
    etkinlikTur: sablon.kategori,
    tarih: form.tarih ? new Date(`${form.tarih}T${form.saat || "12:00"}`) : null,
    mekan: form.mekan || null,
    mesaj: form.mesaj || null,
    sablon: sablonId,
    ozelRenk: form.renk || null,
    font: form.font || null,
    muzik: null,
    goruntulenme: 0,
    user: { name: null, email: null },
    kisi1: form.kisi1 || null,
    kisi2: form.kisi2 || null,
    spotifyAktif: false,
    albumAktif: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Üst Bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight">Davetiye Oluştur</h1>
            <p className="text-xs text-gray-400 truncate">
              <span className="font-medium text-purple-600">{sablon.isim}</span>
            </p>
          </div>
          <button onClick={handleSubmit} disabled={yukleniyor}
            className="shrink-0 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-purple-200">
            {yukleniyor ? "Oluşturuluyor..." : "Oluştur →"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">

          {/* ── Sol — Form ── */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">

            {/* Premium engel */}
            {premiumEngel && kullaniciBilinen && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 text-center">
                <div className="text-4xl mb-3">👑</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Lüks Şablon</h2>
                <p className="text-gray-500 text-sm mb-1">
                  <span className="font-semibold text-gray-700">{sablon.isim}</span> yalnızca ücretli planlarda kullanılabilir.
                </p>
                <p className="text-gray-400 text-xs mb-5">Ücretsiz planda temel şablonlardan davetiye oluşturabilirsiniz.</p>
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => router.push("/fiyatlar")}
                    className="bg-amber-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-amber-600 transition-colors text-sm">
                    Planları Gör →
                  </button>
                  <button onClick={() => router.push("/sablonlar")}
                    className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm">
                    Temel Şablonlara Dön
                  </button>
                </div>
              </div>
            )}

            {/* Form kartı */}
            <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${premiumEngel ? "hidden" : ""}`}>
              {/* Tablar */}
              <div className="flex border-b border-gray-100">
                {[{ id: "icerik", isim: "İçerik", emoji: "✏️" }, { id: "tasarim", isim: "Tasarım", emoji: "🎨" }].map(tab => (
                  <button key={tab.id} onClick={() => setAktifTab(tab.id as "icerik" | "tasarim")}
                    className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      aktifTab === tab.id
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/60"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    }`}>
                    <span className="text-base">{tab.emoji}</span>
                    <span>{tab.isim}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {/* ── İçerik sekmesi ── */}
                {aktifTab === "icerik" && (
                  <div className="space-y-4">
                    {nisanVeyaDugun ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          İsimler <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <input type="text" placeholder="1. Kişi"
                            value={form.kisi1} onChange={e => setForm({ ...form, kisi1: e.target.value })}
                            className={INPUT} />
                          <input type="text" placeholder="2. Kişi"
                            value={form.kisi2} onChange={e => setForm({ ...form, kisi2: e.target.value })}
                            className={INPUT} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Davetiye Başlığı <span className="text-red-400">*</span>
                        </label>
                        <input type="text" placeholder="Örn: Can'ın Doğum Günü Partisi"
                          value={form.baslik} onChange={e => setForm({ ...form, baslik: e.target.value })}
                          className={INPUT} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tarih *</label>
                        <input type="date" value={form.tarih}
                          onChange={e => setForm({ ...form, tarih: e.target.value })}
                          className={INPUT} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Saat</label>
                        <input type="time" value={form.saat}
                          onChange={e => setForm({ ...form, saat: e.target.value })}
                          className={INPUT} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mekan *</label>
                      <input type="text" placeholder="Mekan adı veya adresi"
                        value={form.mekan} onChange={e => setForm({ ...form, mekan: e.target.value })}
                        className={INPUT} />
                      {form.mekan && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.mekan)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 mt-1.5 inline-flex items-center gap-1">
                          🗺️ Google Maps&apos;te kontrol et
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Tasarım sekmesi ── */}
                {aktifTab === "tasarim" && (
                  <div className="space-y-6">
                    {!isNisanLuks && !isDugunLuks && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Tema Rengi</label>
                          <div className="flex gap-3 flex-wrap">
                            {["#7C3AED","#DB2777","#0891B2","#059669","#D97706","#DC2626","#1D4ED8","#111827"].map(renk => (
                              <button key={renk} onClick={() => setForm({ ...form, renk })}
                                className="w-11 h-11 rounded-full transition-all active:scale-95 border-2"
                                style={{ backgroundColor: renk,
                                  borderColor: form.renk === renk ? "white" : "transparent",
                                  boxShadow: form.renk === renk ? `0 0 0 3px ${renk}` : "none" }}>
                                {form.renk === renk && <span className="text-white text-sm">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Yazı Stili</label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {FONTLAR.map(font => (
                              <button key={font.id} onClick={() => setForm({ ...form, font: font.id })}
                                className={`p-4 rounded-xl border-2 transition-all active:scale-95 ${
                                  form.font === font.id ? "border-purple-500 bg-purple-50" : "border-gray-100 bg-white"
                                }`}>
                                <span className="text-2xl block mb-1" style={{ fontFamily: font.style }}>Aa</span>
                                <span className="text-xs text-gray-500">{font.isim}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {isNisanLuks && (
                      <div className="text-center py-8">
                        <p className="text-3xl mb-2">🌹</p>
                        <p className="font-semibold text-gray-600">Bordo &amp; Altın Tasarım</p>
                        <p className="text-xs mt-1 text-gray-400">Bu şablonun rengi sabittir.</p>
                      </div>
                    )}
                    {isDugunLuks && (
                      <div className="text-center py-8">
                        <p className="text-3xl mb-2">💍</p>
                        <p className="font-semibold text-gray-600">Lacivert &amp; Şampanya Altın Tasarım</p>
                        <p className="text-xs mt-1 text-gray-400">Bu şablonun rengi sabittir.</p>
                      </div>
                    )}
                  </div>
                )}

                {hata && (
                  <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">⚠️ {hata}</div>
                )}

                <button onClick={handleSubmit} disabled={yukleniyor}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 active:scale-[0.99] transition-all disabled:opacity-50 mt-5 text-base sm:text-sm">
                  {yukleniyor ? "Oluşturuluyor..." : "Davetiyemi Oluştur"}
                </button>
              </div>
            </div>

            {/* ── İsteğe Bağlı Özellikler ── */}
            {!premiumEngel && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-1">İsteğe Bağlı</p>

                {/* 📝 Kişisel Not */}
                <OzellikKarti
                  emoji="📝" baslik="Kişisel Not" alt="Misafirlere özel bir mesaj ekle"
                  badge="Tüm Planlar" badgeRenk="green"
                  acik={notAcik} onToggle={() => setNotAcik(!notAcik)}
                >
                  <textarea
                    placeholder="Davetiyenize eklemek istediğiniz özel not veya mesaj..."
                    value={form.mesaj}
                    onChange={e => setForm({ ...form, mesaj: e.target.value })}
                    rows={3}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white resize-none"
                  />
                </OzellikKarti>

                {/* 🎵 Arka Plan Müziği */}
                <OzellikKarti
                  emoji="🎵" baslik="Arka Plan Müziği" alt="Davetiye açıldığında çalacak müzik"
                  badge="Standart+" badgeRenk="purple"
                  acik={muzikAktif && muzikAcik}
                  onToggle={() => muzikAktif && setMuzikAcik(!muzikAcik)}
                  upsell={!muzikAktif}
                >
                  <SpotifyMuzikSecici secili={form.muzik} onChange={deger => setForm({ ...form, muzik: deger })} />
                </OzellikKarti>

                {/* 🎧 Spotify Müzik İsteği */}
                <OzellikKarti
                  emoji="🎧" baslik="Spotify Müzik İsteği" alt="Misafirler şarkı önerebilsin"
                  badge="Standart+" badgeRenk="purple"
                  acik={muzikAktif && spotifyAcik}
                  onToggle={() => muzikAktif && setSpotifyAcik(!spotifyAcik)}
                  upsell={!muzikAktif}
                >
                  <div className="bg-green-50 rounded-xl p-4 flex gap-3">
                    <span className="text-xl shrink-0">✅</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-0.5">Müzik İsteği Aktif</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Misafirler davetiye sayfasından Spotify şarkısı önerebilir.</p>
                    </div>
                  </div>
                </OzellikKarti>

                {/* 📖 Anı Defteri */}
                <OzellikKarti
                  emoji="📖" baslik="Anı Defteri" alt="Misafirler fotoğraf ve anı paylaşabilsin"
                  badge="👑 Premium" badgeRenk="amber"
                  acik={aniAktif && aniAcik}
                  onToggle={() => aniAktif && setAniAcik(!aniAcik)}
                  upsell={!aniAktif}
                >
                  <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
                    <span className="text-xl shrink-0">💡</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-0.5">Anı Defteri Etkin</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Misafirler fotoğraf yükleyebilir ve anı yazabilir. Dashboard'dan yönetebilirsin.</p>
                    </div>
                  </div>
                </OzellikKarti>

                <div className="h-4" />
              </div>
            )}
          </div>

          {/* ── Sağ — Canlı Önizleme (sadece lg+) ── */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                Canlı Önizleme
              </p>
              <TelefonMockup>
                <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: NAT_W,
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                    position: "absolute", top: 0, left: 0,
                  }}>
                    {sablonTipi === "nisan-luks"     && <NisanLuksSablon     davetiye={previewVeri} rsvpBileseni={null} />}
                    {sablonTipi === "dugun-luks"     && <DugunLuksSablon     davetiye={previewVeri} rsvpBileseni={null} />}
                    {sablonTipi === "dogumgunu-luks" && <DogumGunuLuksSablon davetiye={previewVeri} rsvpBileseni={null} />}
                    {sablonTipi === "klasik"         && <KlasikSablon        davetiye={previewVeri} rsvpBileseni={null} />}
                  </div>
                </div>
              </TelefonMockup>
              <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Yazdıkça önizleme <span className="font-semibold text-gray-600">anında güncellenir</span>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Tekrar eden opsiyonel kart yapısı ── */
type BadgeRenk = "green" | "purple" | "amber";

function OzellikKarti({
  emoji, baslik, alt, badge, badgeRenk, acik, onToggle, upsell, children,
}: {
  emoji: string; baslik: string; alt: string;
  badge: string; badgeRenk: BadgeRenk;
  acik: boolean; onToggle: () => void;
  upsell?: boolean;
  children: React.ReactNode;
}) {
  const badgeClass: Record<BadgeRenk, string> = {
    green:  "text-green-700 bg-green-100",
    purple: "text-purple-700 bg-purple-100",
    amber:  "text-amber-700 bg-amber-100",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
          upsell ? "cursor-default" : "hover:bg-gray-50 active:bg-gray-100"
        }`}
      >
        <span className="text-2xl shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 leading-tight">{baslik}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{alt}</p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {upsell ? (
            <Link href="/fiyatlar" onClick={e => e.stopPropagation()}
              className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors whitespace-nowrap">
              Yükselt →
            </Link>
          ) : (
            <>
              <span className={`hidden sm:inline text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass[badgeRenk]}`}>
                {badge}
              </span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${acik ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </div>
      </button>
      {acik && !upsell && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  );
}

export default function OlusturSayfasi() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Yükleniyor...</div>}>
      <OlusturIcerigi/>
    </Suspense>
  );
}
