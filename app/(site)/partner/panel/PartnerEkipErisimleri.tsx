"use client";

import { useState } from "react";

type Rol = "satis" | "operasyon" | "teslim";

type EkipErisim = {
  id: string;
  rol: string;
  rolEtiketi: string;
  etiket: string | null;
  aktif: boolean;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

const ROLLER: Array<{
  id: Rol;
  label: string;
  aciklama: string;
}> = [
  {
    id: "satis",
    label: "Satış",
    aciklama: "Segment, lead özeti ve satış hunisini kişisel iletişim bilgisi olmadan görür.",
  },
  {
    id: "operasyon",
    label: "Operasyon",
    aciklama: "Aktivasyon, yayın durumu ve etkinlik hazırlık akışını takip eder.",
  },
  {
    id: "teslim",
    label: "Teslim",
    aciklama: "Müşteri teslim portalı ve teslim raporu özetlerini görür.",
  },
];

function tarih(deger: string | null) {
  if (!deger) return "-";
  return new Date(deger).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function erisimGecerliMi(erisim: EkipErisim) {
  return erisim.aktif && !erisim.revokedAt && (!erisim.expiresAt || new Date(erisim.expiresAt) > new Date());
}

function erisimDurumu(erisim: EkipErisim) {
  if (erisim.revokedAt || !erisim.aktif) return { label: "İptal", cls: "bg-gray-100 text-gray-500" };
  if (erisim.expiresAt && new Date(erisim.expiresAt) <= new Date()) {
    return { label: "Süresi doldu", cls: "bg-amber-50 text-amber-700" };
  }
  return { label: "Aktif", cls: "bg-emerald-50 text-emerald-700" };
}

export default function PartnerEkipErisimleri({
  baslangicErisimler,
}: {
  baslangicErisimler: EkipErisim[];
}) {
  const [erisimler, setErisimler] = useState<EkipErisim[]>(baslangicErisimler);
  const [rol, setRol] = useState<Rol>("operasyon");
  const [etiket, setEtiket] = useState("");
  const [gun, setGun] = useState("7");
  const [link, setLink] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  const aktifErisimler = erisimler.filter(erisimGecerliMi);
  const limitDoldu = aktifErisimler.length >= 10;

  const olustur = async () => {
    setHata("");
    setLink("");
    if (limitDoldu) {
      setHata("Aktif ekip linki limitine ulaştınız. Önce kullanılmayan bir linki iptal edin.");
      return;
    }
    setYukleniyor(true);
    try {
      const res = await fetch("/api/partner/ekip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol, etiket, gun }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Ekip linki oluşturulamadı.");
      setErisimler(prev => [data.erisim as EkipErisim, ...prev]);
      setLink(data.link);
      setEtiket("");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Ekip linki oluşturulamadı.");
    } finally {
      setYukleniyor(false);
    }
  };

  const iptalEt = async (erisim: EkipErisim) => {
    if (!confirm(`${erisim.etiket || erisim.rolEtiketi} erişimi iptal edilsin mi?`)) return;
    setHata("");
    try {
      const res = await fetch(`/api/partner/ekip/${erisim.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Erişim iptal edilemedi.");
      setErisimler(prev => prev.map(item => item.id === erisim.id
        ? { ...item, aktif: false, revokedAt: new Date().toISOString() }
        : item
      ));
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Erişim iptal edilemedi.");
    }
  };

  const linkKopyala = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 1800);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-linear-to-br from-gray-950 via-purple-950 to-gray-900 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-200/80">
              Ekip Rolleri
            </p>
            <h2 className="mt-2 text-xl font-black sm:text-2xl">
              Şifre paylaşmadan görevli erişimi verin
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              Satış, operasyon ve teslim ekipleri sınırlı yetkili linklerle yalnızca kendi rol ekranını görür. Linkler süreli, iptal edilebilir ve kişisel veri minimizasyonuna göre tasarlanmıştır.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-72">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40">Aktif link</p>
              <p className="mt-1 text-2xl font-black tabular-nums">{aktifErisimler.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-white/40">Limit</p>
              <p className="mt-1 text-2xl font-black tabular-nums">10</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[360px_1fr] sm:p-7">
        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-black text-gray-950">Yeni ekip linki</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Linki yalnızca ilgili görevliyle paylaşın. Görev bitince iptal edin.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Rol</span>
              <select
                value={rol}
                onChange={e => setRol(e.target.value as Rol)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              >
                {ROLLER.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>

            <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
              <p className="text-xs font-bold leading-relaxed text-purple-900">
                {ROLLER.find(item => item.id === rol)?.aciklama}
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-gray-500">Erişim adı</span>
              <input
                value={etiket}
                onChange={e => setEtiket(e.target.value)}
                placeholder="Örn. Salon operasyon ekibi"
                maxLength={80}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-gray-500">Geçerlilik</span>
              <select
                value={gun}
                onChange={e => setGun(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
              >
                <option value="1">1 gün</option>
                <option value="3">3 gün</option>
                <option value="7">7 gün</option>
                <option value="14">14 gün</option>
                <option value="30">30 gün</option>
              </select>
            </label>

            {hata && (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                {hata}
              </p>
            )}

            <button
              type="button"
              onClick={olustur}
              disabled={yukleniyor || limitDoldu}
              className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
            >
              {limitDoldu ? "Aktif link limiti doldu" : yukleniyor ? "Oluşturuluyor..." : "Sınırlı link oluştur"}
            </button>
          </div>

          {link && (
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Tek sefer gösterilir</p>
              <p className="mt-2 break-all rounded-xl bg-white px-3 py-2 text-xs font-semibold text-gray-700">{link}</p>
              <button
                type="button"
                onClick={linkKopyala}
                className="mt-3 w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-emerald-700"
              >
                {kopyalandi ? "Kopyalandı" : "Linki kopyala"}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {erisimler.length > 0 ? erisimler.map(erisim => {
            const durum = erisimDurumu(erisim);
            const iptalEdilebilir = erisimGecerliMi(erisim);
            return (
              <div key={erisim.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black text-gray-950">{erisim.etiket || erisim.rolEtiketi}</p>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black ${durum.cls}`}>
                        {durum.label}
                      </span>
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-black text-purple-700">
                        {erisim.rolEtiketi}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">
                      Oluşturma: {tarih(erisim.createdAt)} · Son kullanım: {tarih(erisim.lastUsedAt)} · Bitiş: {tarih(erisim.expiresAt)}
                    </p>
                  </div>
                  {iptalEdilebilir && (
                    <button
                      type="button"
                      onClick={() => iptalEt(erisim)}
                      className="w-fit rounded-2xl border border-red-100 px-4 py-2 text-xs font-black text-red-600 transition-colors hover:bg-red-50"
                    >
                      İptal et
                    </button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <p className="text-sm font-black text-gray-700">Henüz ekip linki yok</p>
              <p className="mt-1 text-xs text-gray-500">İlk operasyon veya satış görevliniz için sınırlı erişim oluşturabilirsiniz.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
