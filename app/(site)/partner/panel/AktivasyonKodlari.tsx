"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Kod = {
  id: string;
  kod: string;
  durum: string;
  createdAt: string;
  kullanilanAt: string | null;
  musteriUser: { name: string | null; email: string | null } | null;
  davetiye: { slug: string; baslik: string } | null;
};

type Abonelik = {
  hakSayisi: number;
  kullanilanHak: number;
} | null;

const DURUM_ETIKET: Record<string, { label: string; cls: string }> = {
  olusturuldu:          { label: "Oluşturuldu",          cls: "bg-gray-100 text-gray-600" },
  gonderildi:           { label: "Gönderildi",           cls: "bg-blue-100 text-blue-700" },
  kayit_oldu:           { label: "Kayıt Oldu",           cls: "bg-yellow-100 text-yellow-700" },
  davetiye_olusturuldu: { label: "Davetiye Oluşturuldu", cls: "bg-orange-100 text-orange-700" },
  yayinda:              { label: "Yayında",              cls: "bg-green-100 text-green-700" },
  iptal:                { label: "İptal",                cls: "bg-red-100 text-red-500" },
};

const IPTAL_EDILEBILİR = new Set(["olusturuldu", "gonderildi"]);

export default function AktivasyonKodlari({
  firmaAdi,
  abonelik,
  kodlar: ilkKodlar,
}: {
  firmaAdi: string;
  abonelik: Abonelik;
  kodlar: Kod[];
}) {
  const router = useRouter();
  const [olusturuluyor, setOlusturuluyor] = useState(false);
  const [iptalEdilenKod, setIptalEdilenKod] = useState<string | null>(null);
  const [kopyalananKod, setKopyalananKod] = useState<string | null>(null);
  const [hata, setHata] = useState("");

  const kalanHak = abonelik ? abonelik.hakSayisi - abonelik.kullanilanHak : 0;
  const olusturulabilir = abonelik !== null && kalanHak > 0;

  const aktivasyonUrl = (kod: string) => {
    const base = process.env.NEXT_PUBLIC_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/partner/aktivasyon/${kod}`;
  };

  const whatsappMesaji = (kod: string) => {
    const url = aktivasyonUrl(kod);
    return encodeURIComponent(
      `Merhaba! ${firmaAdi} aracılığıyla size özel bir dijital davetiye hakkı sunuyoruz.\n\nAşağıdaki bağlantıya tıklayarak davetiyenizi oluşturabilirsiniz:\n${url}\n\nBu bağlantı size özeldir ve tek kullanımlıktır.`
    );
  };

  const olustur = async () => {
    setOlusturuluyor(true);
    setHata("");
    try {
      const res = await fetch("/api/partner/aktivasyon/olustur", { method: "POST" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "Kod oluşturulamadı.");
      } else {
        router.refresh();
      }
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setOlusturuluyor(false);
    }
  };

  const iptalEt = async (kod: string) => {
    if (!confirm("Bu aktivasyon kodunu iptal etmek istediğinizden emin misiniz?")) return;
    setIptalEdilenKod(kod);
    try {
      const res = await fetch(`/api/partner/aktivasyon/${kod}`, { method: "PATCH" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "İptal edilemedi.");
      } else {
        router.refresh();
      }
    } catch {
      setHata("Sunucuya bağlanılamadı.");
    } finally {
      setIptalEdilenKod(null);
    }
  };

  const kopyala = async (kod: string) => {
    try {
      await navigator.clipboard.writeText(aktivasyonUrl(kod));
      setKopyalananKod(kod);
      setTimeout(() => setKopyalananKod(null), 2000);
    } catch {
      setHata("Kopyalanamadı.");
    }
  };

  const aktifKodlar = ilkKodlar.filter(k => k.durum !== "iptal");
  const iptalKodlar = ilkKodlar.filter(k => k.durum === "iptal");
  const yayindaKodlar = ilkKodlar.filter(k => k.durum === "yayinda");
  const kullanilmisKodlar = ilkKodlar.filter(k => ["kayit_oldu", "davetiye_olusturuldu", "yayinda"].includes(k.durum));

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
      {/* Başlık + oluştur butonu */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Aktivasyon Kodları</p>
          {abonelik && (
            <p className="text-xs text-gray-400 mt-0.5">
              {kalanHak} / {abonelik.hakSayisi} hak kaldı
            </p>
          )}
        </div>
        <button
          onClick={olustur}
          disabled={!olusturulabilir || olusturuluyor}
          className="flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {olusturuluyor ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <span className="text-base leading-none">+</span>
          )}
          Yeni Kod
        </button>
      </div>

      {/* İstatistikler */}
      {ilkKodlar.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-gray-900">{aktifKodlar.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Aktif</p>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-gray-900">{kullanilmisKodlar.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Kullanılan</p>
          </div>
          <div className="bg-green-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-lg font-black text-green-700">{yayindaKodlar.length}</p>
            <p className="text-[11px] text-green-600 mt-0.5">Yayında</p>
          </div>
        </div>
      )}

      {!abonelik && (
        <p className="text-sm text-gray-400 text-center py-4">
          Aktivasyon kodu oluşturmak için önce bir paket satın alın.
        </p>
      )}

      {hata && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{hata}</p>
      )}

      {/* Aktif kodlar */}
      {aktifKodlar.length > 0 && (
        <div className="space-y-3">
          {aktifKodlar.map(k => {
            const etiket = DURUM_ETIKET[k.durum] ?? DURUM_ETIKET.olusturuldu;
            const url = aktivasyonUrl(k.kod);
            return (
              <div key={k.id} className="border border-gray-100 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${etiket.cls}`}>
                    {etiket.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(k.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                {/* Müşteri bilgisi (kullanıldıysa) */}
                {k.musteriUser && (
                  <p className="text-xs text-gray-600 font-medium">
                    👤 {k.musteriUser.name ?? k.musteriUser.email}
                    {k.musteriUser.name && k.musteriUser.email && (
                      <span className="text-gray-400 font-normal"> · {k.musteriUser.email}</span>
                    )}
                  </p>
                )}

                {/* Oluşturulan davetiye */}
                {k.davetiye && (
                  <a
                    href={`/davetiye/${k.davetiye.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-purple-600 font-medium hover:underline"
                  >
                    🎉 {k.davetiye.baslik}
                  </a>
                )}

                {/* Link */}
                <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2 min-w-0">
                  <span className="text-[11px] text-gray-400 font-mono truncate flex-1 min-w-0">{url}</span>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => kopyala(k.kod)}
                    className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    {kopyalananKod === k.kod ? "✓ Kopyalandı" : "Kopyala"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${whatsappMesaji(k.kod)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    WhatsApp
                  </a>
                  {IPTAL_EDILEBILİR.has(k.durum) && (
                    <button
                      onClick={() => iptalEt(k.kod)}
                      disabled={iptalEdilenKod === k.kod}
                      className="text-[11px] font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      {iptalEdilenKod === k.kod ? "…" : "İptal Et"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* İptal edilmiş kodlar (katlanabilir) */}
      {iptalKodlar.length > 0 && (
        <details className="group">
          <summary className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-600 transition-colors list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">›</span>
            {iptalKodlar.length} iptal edilmiş kod
          </summary>
          <div className="mt-3 space-y-2">
            {iptalKodlar.map(k => (
              <div key={k.id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl opacity-50">
                <span className="text-[11px] font-mono text-gray-400 truncate">{aktivasyonUrl(k.kod)}</span>
                <span className="text-[11px] text-gray-400 shrink-0 ml-3">
                  {new Date(k.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      {ilkKodlar.length === 0 && abonelik && (
        <p className="text-sm text-gray-400 text-center py-4">
          Henüz aktivasyon kodu oluşturulmamış.
        </p>
      )}
    </div>
  );
}
