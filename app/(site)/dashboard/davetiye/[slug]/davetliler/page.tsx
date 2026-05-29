"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DavetlilerYukleniyor from "./loading";

interface Davetli {
  id: string;
  ad: string;
  telefon?: string;
  email?: string;
  grup: string;
  notlar?: string;
}

interface RsvpItem {
  id: string;
  ad: string;
  telefon?: string;
  katilim: boolean;
  kisiSayisi: number;
}

interface Davetiye {
  id: string;
  baslik: string;
  slug: string;
  sablon: string;
  kapasiteLimiti?: number | null;
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

const GRUPLAR = [
  { id: "aile",     label: "Aile",     emoji: "👨‍👩‍👧",  bg: "#f3e8ff", text: "#7c3aed" },
  { id: "arkadas",  label: "Arkadaş",  emoji: "👫",      bg: "#dbeafe", text: "#1d4ed8" },
  { id: "is",       label: "İş",       emoji: "💼",      bg: "#f1f5f9", text: "#475569" },
  { id: "protokol", label: "Protokol", emoji: "🎩",      bg: "#fef3c7", text: "#92400e" },
  { id: "diger",    label: "Diğer",    emoji: "👤",      bg: "#f3f4f6", text: "#6b7280" },
];

const GRUP_MAP = Object.fromEntries(GRUPLAR.map(g => [g.id, g]));

const HIZLI_NOTLAR = ["VIP", "Çocuklu", "Ulaşım Lazım", "Vejeteryen", "Engelli"];

const KVKK_KEY = "davetli-kvkk-goruldu";

function normalizAd(ad: string) {
  return ad.toLowerCase().trim().replace(/\s+/g, " ");
}

function parseCSV(text: string): Array<{ ad: string; telefon: string; email: string; grup: string }> {
  return text.split("\n")
    .map(s => s.trim())
    .filter(s => s && !s.startsWith("#"))
    .map(satir => {
      const parts: string[] = [];
      let current = "";
      let inQuote = false;
      for (const ch of satir) {
        if (ch === '"') { inQuote = !inQuote; }
        else if (ch === "," && !inQuote) { parts.push(current.trim()); current = ""; }
        else current += ch;
      }
      parts.push(current.trim());
      return parts;
    })
    .map(p => ({
      ad:      p[0] ?? "",
      telefon: p[1] ?? "",
      email:   p[2] ?? "",
      grup:    (p[3] && GRUPLAR.some(g => g.id === p[3].toLowerCase())) ? p[3].toLowerCase() : "diger",
    }))
    .filter(d => d.ad && !["ad", "isim", "name"].includes(d.ad.toLowerCase()));
}

export default function DavetlilerSayfasi() {
  const params = useParams();
  const slug = params.slug as string;

  const [davetiye, setDavetiye] = useState<Davetiye | null>(null);
  const [davetliler, setDavetliler] = useState<Davetli[]>([]);
  const [rsvplar, setRsvplar] = useState<RsvpItem[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  // Tabs: liste | cevaplamayanlar | import
  const [aktifTab, setAktifTab] = useState<"liste" | "cevaplamayanlar" | "import">("liste");

  // Add form state
  const [yeniAd, setYeniAd] = useState("");
  const [yeniTelefon, setYeniTelefon] = useState("");
  const [yeniEmail, setYeniEmail] = useState("");
  const [yeniGrup, setYeniGrup] = useState("diger");
  const [yeniNotlar, setYeniNotlar] = useState<string[]>([]);
  const [ozelNot, setOzelNot] = useState("");
  const [ekleniyor, setEkleniyor] = useState(false);

  // List state
  const [seciliGrup, setSeciliGrup] = useState<string | null>(null);
  const [siliniyor, setSiliniyor] = useState<string | null>(null);
  const [duzenleId, setDuzenleId] = useState<string | null>(null);
  const [duzenleGrup, setDuzenleGrup] = useState("diger");
  const [duzenleNotlar, setDuzenleNotlar] = useState<string[]>([]);
  const [duzenleOzelNot, setDuzenleOzelNot] = useState("");
  const [kaydediyor, setKaydediyor] = useState(false);

  // Kapasite
  const [kapasiteGir, setKapasiteGir] = useState<string>("");
  const [kapasiteAcik, setKapasiteAcik] = useState(false);
  const [kapasiteKayit, setKapasiteKayit] = useState(false);

  // Import tab
  const [topluMetin, setTopluMetin] = useState("");
  const [importHata, setImportHata] = useState("");
  const [importBasarili, setImportBasarili] = useState(0);
  const [importYukleniyor, setImportYukleniyor] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // KVKK
  const [kvkkGoruldu, setKvkkGoruldu] = useState(true);

  const renk = davetiye ? (SABLON_RENKLER[davetiye.sablon] ?? "#7C3AED") : "#7C3AED";

  useEffect(() => {
    setKvkkGoruldu(localStorage.getItem(KVKK_KEY) === "1");
  }, []);

  const davetlileriYukle = useCallback(async (davetiyeId: string) => {
    const res = await fetch(`/api/davetli?davetiyeId=${davetiyeId}`);
    const data = await res.json();
    setDavetliler(data.davetliler || []);
  }, []);

  const rsvplariYukle = useCallback(async (s: string) => {
    const res = await fetch(`/api/dashboard/davetiye/${s}/rsvp`);
    if (res.ok) {
      const data = await res.json();
      setRsvplar(data.rsvplar || []);
    }
  }, []);

  useEffect(() => {
    const yukle = async () => {
      const res = await fetch(`/api/davetiye/${slug}`);
      const data = await res.json();
      setDavetiye(data.davetiye);
      if (data.davetiye) {
        setKapasiteGir(data.davetiye.kapasiteLimiti?.toString() ?? "");
        await Promise.all([
          davetlileriYukle(data.davetiye.id),
          rsvplariYukle(slug),
        ]);
      }
      setYukleniyor(false);
    };
    yukle();
  }, [slug, davetlileriYukle, rsvplariYukle]);

  // ── Helpers ──────────────────────────────────────────────

  const toggleNot = (not: string, liste: string[], setter: (v: string[]) => void) => {
    setter(liste.includes(not) ? liste.filter(n => n !== not) : [...liste, not]);
  };

  const notlarString = (arr: string[], ozel: string) => {
    const tumu = ozel.trim() ? [...arr, ozel.trim()] : arr;
    return tumu.join(", ") || null;
  };

  const notlarParse = (str?: string): string[] =>
    str ? str.split(",").map(s => s.trim()).filter(Boolean) : [];

  // ── CRUD ─────────────────────────────────────────────────

  const davetliEkle = async () => {
    if (!yeniAd.trim() || !davetiye) return;
    if (!kvkkGoruldu) return;
    setEkleniyor(true);
    await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        davetiyeId: davetiye.id,
        kvkkSorumlulukOnayi: true,
        davetliler: [{
          ad:      yeniAd.trim(),
          telefon: yeniTelefon,
          email:   yeniEmail,
          grup:    yeniGrup,
          notlar:  notlarString(yeniNotlar, ozelNot),
        }],
      }),
    });
    setYeniAd(""); setYeniTelefon(""); setYeniEmail("");
    setYeniGrup("diger"); setYeniNotlar([]); setOzelNot("");
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

  const duzenleAc = (davetli: Davetli) => {
    setDuzenleId(davetli.id);
    setDuzenleGrup(davetli.grup);
    const notDizisi = notlarParse(davetli.notlar);
    const hizlilar = notDizisi.filter(n => HIZLI_NOTLAR.includes(n));
    const ozelNotlar = notDizisi.filter(n => !HIZLI_NOTLAR.includes(n));
    setDuzenleNotlar(hizlilar);
    setDuzenleOzelNot(ozelNotlar.join(", "));
  };

  const duzenleKaydet = async () => {
    if (!duzenleId) return;
    setKaydediyor(true);
    const res = await fetch("/api/davetli", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id:     duzenleId,
        grup:   duzenleGrup,
        notlar: notlarString(duzenleNotlar, duzenleOzelNot),
      }),
    });
    if (res.ok) {
      const { davetli } = await res.json();
      setDavetliler(prev => prev.map(d => d.id === duzenleId ? davetli : d));
    }
    setDuzenleId(null);
    setKaydediyor(false);
  };

  // ── Kapasite ─────────────────────────────────────────────

  const kapasiteKaydet = async () => {
    if (!davetiye) return;
    setKapasiteKayit(true);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/kapasite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kapasiteLimiti: kapasiteGir ? Number(kapasiteGir) : null }),
    });
    if (res.ok) {
      const { kapasiteLimiti } = await res.json();
      setDavetiye(prev => prev ? { ...prev, kapasiteLimiti } : prev);
      setKapasiteAcik(false);
    }
    setKapasiteKayit(false);
  };

  // Kaldır butonu için ayrı fonksiyon — setState + fetch aynı anda çağrılırsa
  // React state anlık güncellenmediğinden eski değer gönderilirdi.
  const kapasiteKaldir = async () => {
    if (!davetiye) return;
    setKapasiteKayit(true);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/kapasite`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kapasiteLimiti: null }),
    });
    if (res.ok) {
      setKapasiteGir("");
      setDavetiye(prev => prev ? { ...prev, kapasiteLimiti: null } : prev);
      setKapasiteAcik(false);
    }
    setKapasiteKayit(false);
  };

  // ── Import ────────────────────────────────────────────────

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const satirlar = parseCSV(text);
      if (satirlar.length === 0) {
        setImportHata("CSV dosyasında geçerli satır bulunamadı.");
        return;
      }
      setTopluMetin(satirlar.map(s => [s.ad, s.telefon, s.email, s.grup !== "diger" ? s.grup : ""].join(",")).join("\n"));
      setImportHata("");
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const topluImport = async () => {
    if (!topluMetin.trim() || !davetiye) return;
    if (!kvkkGoruldu) {
      setImportHata("İçe aktarma için misafir verileri KVKK sorumluluk onayını tamamlayın.");
      return;
    }
    setImportYukleniyor(true);
    setImportHata("");
    const davetlilerListesi = topluMetin.trim().split("\n")
      .map(satir => {
        const p = satir.split(",").map(s => s.trim());
        return {
          ad:      p[0] || "",
          telefon: p[1] || "",
          email:   p[2] || "",
          grup:    (p[3] && GRUPLAR.some(g => g.id === p[3])) ? p[3] : "diger",
        };
      }).filter(d => d.ad);

    const res = await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ davetiyeId: davetiye.id, davetliler: davetlilerListesi, kvkkSorumlulukOnayi: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setImportBasarili(data.count);
      setTopluMetin("");
      await davetlileriYukle(davetiye.id);
      setAktifTab("liste");
    } else {
      setImportHata("İçe aktarma sırasında hata oluştu.");
    }
    setImportYukleniyor(false);
  };

  // ── WhatsApp helpers ──────────────────────────────────────

  const waPhone = (tel: string) => {
    const digits = tel.replace(/\D/g, "");
    if (digits.startsWith("90")) return digits;
    if (digits.startsWith("0")) return "9" + digits;
    return "90" + digits;
  };

  const whatsappMesaj = (ad: string) => {
    const link = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye?.slug}`;
    return encodeURIComponent(
      `Merhaba ${ad},\n\n${davetiye?.baslik} etkinliğimize davetlisiniz. Katılım bildiriminizi henüz almadık. 🙏\n\nDavetiyemiz: ${link}`
    );
  };

  const whatsappDavetMesaj = (ad: string) => {
    const link = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye?.slug}`;
    return encodeURIComponent(
      `Sayın ${ad},\n\n${davetiye?.baslik} etkinliğimize davetlisiniz.\n\nDavetiyeniz: ${link}`
    );
  };

  // ── Computed ──────────────────────────────────────────────

  const filtreliDavetliler = seciliGrup
    ? davetliler.filter(d => d.grup === seciliGrup)
    : davetliler;

  const cevapVerenAdlar = new Set(rsvplar.map(r => normalizAd(r.ad)));
  const cevaplamayanlar = davetliler.filter(d => !cevapVerenAdlar.has(normalizAd(d.ad)));

  const katilimToplamKisi = rsvplar.filter(r => r.katilim).reduce((s, r) => s + r.kisiSayisi, 0);
  const kapasite = davetiye?.kapasiteLimiti;
  const kapasiteYuzde = kapasite ? Math.min(100, Math.round((katilimToplamKisi / kapasite) * 100)) : 0;

  if (yukleniyor) return <DavetlilerYukleniyor />;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ── Header ── */}
      <div className="bg-white/90 border-b border-gray-100 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={`/dashboard/davetiye/${slug}`}
              className="w-9 h-9 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 truncate">
                {davetiye?.baslik ?? "Davetiye"} ·{" "}
                <span className="font-semibold" style={{ color: renk }}>
                  {davetliler.length} davetli
                </span>
                {cevaplamayanlar.length > 0 && (
                  <span className="text-amber-500 ml-1">· {cevaplamayanlar.length} yanıt bekliyor</span>
                )}
              </p>
              <h1 className="text-base font-bold text-gray-900">Davetli Listesi</h1>
            </div>
          </div>

          {/* Kapasite mini bar */}
          {kapasite && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${kapasiteYuzde}%`,
                    backgroundColor: kapasiteYuzde >= 90 ? "#ef4444" : kapasiteYuzde >= 70 ? "#f59e0b" : "#22c55e",
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 tabular-nums">{katilimToplamKisi}/{kapasite}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* KVKK */}
        {!kvkkGoruldu && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚖️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900 mb-1">Misafir verilerini girerken KVKK sorumluluğunuz</p>
                <p className="text-xs text-amber-800 leading-relaxed mb-3">
                  Sisteme girdiğiniz ad, telefon ve e-posta bilgileri üçüncü kişilere aittir.
                  Bu verileri yalnızca davetiye gönderimi amacıyla ekleyin; misafirleri uygun şekilde
                  bilgilendirdiğinizi ve ekleme yetkiniz olduğunu kabul ettiğinizde bu kayıt saklanır.
                </p>
                <button
                  onClick={() => { localStorage.setItem(KVKK_KEY, "1"); setKvkkGoruldu(true); }}
                  className="text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 transition-colors px-4 py-2 rounded-xl"
                >
                  Anladım, Devam Et
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
          {([
            { id: "liste",           label: "Davetliler",      count: davetliler.length },
            { id: "cevaplamayanlar", label: "Cevaplamayanlar", count: cevaplamayanlar.length },
            { id: "import",          label: "İçe Aktar",       count: null },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setAktifTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                aktifTab === tab.id
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    tab.id === "cevaplamayanlar" && aktifTab !== tab.id
                      ? "bg-amber-100 text-amber-600"
                      : aktifTab === tab.id
                      ? "text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  style={aktifTab === tab.id ? { backgroundColor: renk } : {}}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            TAB: Davetliler
        ══════════════════════════════════════════════ */}
        {aktifTab === "liste" && (
          <div className="space-y-4">

            {/* Kapasite ayarları */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setKapasiteAcik(!kapasiteAcik)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Kapasite Limiti</p>
                    <p className="text-xs text-gray-400">
                      {kapasite
                        ? `${katilimToplamKisi}/${kapasite} kişi · %${kapasiteYuzde} dolu`
                        : "Limit belirlenmedi — RSVP açık"}
                    </p>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${kapasiteAcik ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {kapasiteAcik && (
                <div className="px-5 pb-4 border-t border-gray-50 pt-4 space-y-3">
                  {kapasite && (
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${kapasiteYuzde}%`,
                          backgroundColor: kapasiteYuzde >= 90 ? "#ef4444" : kapasiteYuzde >= 70 ? "#f59e0b" : "#22c55e",
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-400">
                    Kontenjan dolduğunda RSVP otomatik kapanır. Boş bırakırsanız limit uygulanmaz.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Örn: 150"
                      min={1}
                      value={kapasiteGir}
                      onChange={e => setKapasiteGir(e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2"
                      style={{ ["--tw-ring-color" as string]: renk + "44" }}
                    />
                    <span className="text-xs text-gray-400">kişi</span>
                    <button
                      onClick={kapasiteKaydet}
                      disabled={kapasiteKayit}
                      className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: renk }}
                    >
                      {kapasiteKayit ? "..." : "Kaydet"}
                    </button>
                    {kapasite && (
                      <button
                        onClick={kapasiteKaldir}
                        className="text-xs text-red-400 hover:text-red-600 font-medium"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Add form */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Yeni Davetli Ekle</p>

              {/* Ad + Grup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Ad Soyad *"
                  value={yeniAd}
                  onChange={e => setYeniAd(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && davetliEkle()}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ ["--tw-ring-color" as string]: renk + "44" }}
                />
                <select
                  value={yeniGrup}
                  onChange={e => setYeniGrup(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
                  style={{ ["--tw-ring-color" as string]: renk + "44" }}
                >
                  {GRUPLAR.map(g => (
                    <option key={g.id} value={g.id}>{g.emoji} {g.label}</option>
                  ))}
                </select>
              </div>

              {/* Tel + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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

              {/* Notlar chips */}
              <div className="mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Notlar</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {HIZLI_NOTLAR.map(not => (
                    <button
                      key={not}
                      type="button"
                      onClick={() => toggleNot(not, yeniNotlar, setYeniNotlar)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                        yeniNotlar.includes(not)
                          ? "border-transparent text-white"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                      style={yeniNotlar.includes(not) ? { backgroundColor: renk } : {}}
                    >
                      {not}
                    </button>
                  ))}
                  <input
                    type="text"
                    placeholder="Özel not…"
                    value={ozelNot}
                    onChange={e => setOzelNot(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 focus:outline-none focus:border-gray-400 w-28 placeholder:text-gray-300"
                  />
                </div>
              </div>

                <button
                  onClick={davetliEkle}
                disabled={!yeniAd.trim() || ekleniyor || !kvkkGoruldu}
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: renk }}
              >
                {ekleniyor
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                }
                Davetli Ekle
              </button>
            </div>

            {/* Grup filtresi */}
            {davetliler.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setSeciliGrup(null)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                    !seciliGrup ? "text-white border-transparent" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                  style={!seciliGrup ? { backgroundColor: renk } : {}}
                >
                  Tümü <span className="opacity-60">({davetliler.length})</span>
                </button>
                {GRUPLAR.filter(g => davetliler.some(d => d.grup === g.id)).map(g => {
                  const sayi = davetliler.filter(d => d.grup === g.id).length;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSeciliGrup(seciliGrup === g.id ? null : g.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all`}
                      style={{
                        backgroundColor: seciliGrup === g.id ? g.bg : "white",
                        color: seciliGrup === g.id ? g.text : "#6b7280",
                        borderColor: seciliGrup === g.id ? g.bg : "#e5e7eb",
                      }}
                    >
                      {g.emoji} {g.label} <span className="opacity-60">({sayi})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Liste */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              {filtreliDavetliler.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">👥</div>
                  <p className="text-gray-500 text-sm font-medium">
                    {seciliGrup ? `Bu grupta davetli yok` : "Henüz davetli eklenmedi"}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">Yukarıdaki formu kullanarak ekleyin</p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                      {filtreliDavetliler.length} Davetli
                    </p>
                    <p className="text-xs text-gray-400">
                      {davetliler.filter(d => d.telefon).length} tel · {davetliler.filter(d => d.email).length} e-posta
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {filtreliDavetliler.map(davetli => {
                      const g = GRUP_MAP[davetli.grup] ?? GRUP_MAP.diger;
                      const notlar = notlarParse(davetli.notlar);
                      const duzenleniyor = duzenleId === davetli.id;

                      return (
                        <div key={davetli.id} className="group">
                          <div className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                            {/* Avatar */}
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                              style={{ backgroundColor: g.bg, color: g.text }}
                            >
                              {davetli.ad[0]?.toUpperCase()}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-800 text-sm">{davetli.ad}</p>
                                <span
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ backgroundColor: g.bg, color: g.text }}
                                >
                                  {g.emoji} {g.label}
                                </span>
                              </div>

                              {/* Notlar */}
                              {notlar.length > 0 && (
                                <div className="flex gap-1 flex-wrap mt-1">
                                  {notlar.map(n => (
                                    <span key={n} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-medium">
                                      {n}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Contact info */}
                              <div className="flex gap-3 mt-1 flex-wrap">
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

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0 mt-0.5">
                              {davetli.telefon && (
                                <a
                                  href={`https://wa.me/${waPhone(davetli.telefon)}?text=${whatsappDavetMesaj(davetli.ad)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                                  title="WhatsApp'ta gönder"
                                >
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                </a>
                              )}
                              <button
                                onClick={() => duzenleniyor ? setDuzenleId(null) : duzenleAc(davetli)}
                                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
                                title="Düzenle"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button
                                onClick={() => davetliSil(davetli.id)}
                                disabled={siliniyor === davetli.id}
                                className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all disabled:opacity-40"
                                title="Sil"
                              >
                                {siliniyor === davetli.id
                                  ? <div className="w-3 h-3 border border-red-300 border-t-red-500 rounded-full animate-spin" />
                                  : <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                }
                              </button>
                            </div>
                          </div>

                          {/* Inline edit panel */}
                          {duzenleniyor && (
                            <div className="mx-5 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                              <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Grup</p>
                                <div className="flex gap-1.5 flex-wrap">
                                  {GRUPLAR.map(g => (
                                    <button
                                      key={g.id}
                                      onClick={() => setDuzenleGrup(g.id)}
                                      className="text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
                                      style={{
                                        backgroundColor: duzenleGrup === g.id ? g.bg : "white",
                                        color: duzenleGrup === g.id ? g.text : "#6b7280",
                                        borderColor: duzenleGrup === g.id ? g.bg : "#e5e7eb",
                                      }}
                                    >
                                      {g.emoji} {g.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Notlar</p>
                                <div className="flex gap-1.5 flex-wrap mb-2">
                                  {HIZLI_NOTLAR.map(not => (
                                    <button
                                      key={not}
                                      onClick={() => toggleNot(not, duzenleNotlar, setDuzenleNotlar)}
                                      className="text-xs px-2.5 py-1 rounded-full border transition-all font-medium"
                                      style={{
                                        backgroundColor: duzenleNotlar.includes(not) ? renk : "white",
                                        color: duzenleNotlar.includes(not) ? "white" : "#6b7280",
                                        borderColor: duzenleNotlar.includes(not) ? renk : "#e5e7eb",
                                      }}
                                    >
                                      {not}
                                    </button>
                                  ))}
                                  <input
                                    type="text"
                                    placeholder="Özel…"
                                    value={duzenleOzelNot}
                                    onChange={e => setDuzenleOzelNot(e.target.value)}
                                    className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 focus:outline-none w-24 placeholder:text-gray-300"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={duzenleKaydet}
                                  disabled={kaydediyor}
                                  className="text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                                  style={{ backgroundColor: renk }}
                                >
                                  {kaydediyor ? "..." : "Kaydet"}
                                </button>
                                <button
                                  onClick={() => setDuzenleId(null)}
                                  className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                  İptal
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: Cevaplamayanlar
        ══════════════════════════════════════════════ */}
        {aktifTab === "cevaplamayanlar" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-start gap-3">
              <span className="text-xl shrink-0">⏳</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {cevaplamayanlar.length} davetli henüz yanıt vermedi
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Telefon numarası olanlara tek tık WhatsApp hatırlatması gönderebilirsiniz.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              {cevaplamayanlar.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
                  <p className="text-gray-700 text-sm font-semibold">Tüm davetliler yanıt verdi!</p>
                  <p className="text-gray-300 text-xs mt-1">Katılım durumunu Davetliler sekmesinden takip edebilirsiniz</p>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                      {cevaplamayanlar.length} Bekleyen Yanıt
                    </p>
                    <p className="text-xs text-gray-400">
                      {cevaplamayanlar.filter(d => d.telefon).length} telefon mevcut
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cevaplamayanlar.map(davetli => {
                      const g = GRUP_MAP[davetli.grup] ?? GRUP_MAP.diger;
                      return (
                        <div key={davetli.id} className="flex items-center gap-3 px-5 py-4">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ backgroundColor: g.bg, color: g.text }}
                          >
                            {davetli.ad[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-800 text-sm">{davetli.ad}</p>
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: g.bg, color: g.text }}
                              >
                                {g.emoji} {g.label}
                              </span>
                            </div>
                            {davetli.telefon && (
                              <p className="text-xs text-gray-400 mt-0.5">{davetli.telefon}</p>
                            )}
                          </div>
                          {davetli.telefon ? (
                            <a
                              href={`https://wa.me/${waPhone(davetli.telefon)}?text=${whatsappMesaj(davetli.ad)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs px-3.5 py-2 rounded-xl hover:opacity-90 transition-opacity font-semibold shrink-0"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Hatırlat
                            </a>
                          ) : (
                            <span className="text-[11px] text-gray-300 shrink-0">Telefon yok</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            TAB: İçe Aktar
        ══════════════════════════════════════════════ */}
        {aktifTab === "import" && (
          <div className="space-y-4">

            {/* CSV upload */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">CSV Dosyası Yükle</p>
              <p className="text-xs text-gray-400 mb-4">
                Sütunlar:{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600 text-[11px]">
                  Ad Soyad, Telefon, Email, Grup
                </code>{" "}
                — Telefon, Email ve Grup opsiyonel. Grup:{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600 text-[11px]">
                  aile | arkadas | is | protokol | diger
                </code>
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-gray-300 text-sm text-gray-500 font-medium px-5 py-3 rounded-xl transition-all hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                CSV Dosyası Seç
              </button>
            </div>

            {/* Text area */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">Metin Olarak Yapıştır</p>
              <p className="text-xs text-gray-400 mb-4">
                Her satıra bir davetli:{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600 text-[11px]">
                  Ad Soyad, Telefon, Email, Grup
                </code>
              </p>
              <textarea
                rows={8}
                placeholder={`Ahmet Yılmaz, 05001234567, ahmet@mail.com, aile\nAyşe Kaya, 05009876543, , arkadas\nMehmet Demir`}
                value={topluMetin}
                onChange={e => { setTopluMetin(e.target.value); setImportHata(""); }}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 resize-none mb-4 bg-gray-50"
              />

              {importHata && (
                <p className="text-xs text-red-500 mb-3">{importHata}</p>
              )}
              {importBasarili > 0 && (
                <p className="text-xs text-emerald-600 mb-3 font-semibold">
                  ✓ {importBasarili} davetli başarıyla eklendi
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={topluImport}
                  disabled={!topluMetin.trim() || importYukleniyor || !kvkkGoruldu}
                  className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: renk }}
                >
                  {importYukleniyor
                    ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  }
                  İçe Aktar
                </button>
                <p className="text-xs text-gray-400">
                  {topluMetin.trim().split("\n").filter(s => s.trim()).length} satır hazır
                </p>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                İçe aktarılan veriler yalnızca bu davetiye kapsamında saklanır.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
