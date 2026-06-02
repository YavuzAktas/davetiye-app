import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  PARTNER_EKIP_ROLLERI,
  partnerEkipRolEtiketi,
  partnerEkipTokenHash,
} from "@/lib/partner-ekip-erisim";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata = {
  title: "Partner Ekip Erişimi | DavetRota",
  robots: { index: false },
};

const DURUM_LABEL: Record<string, string> = {
  yeni: "Yeni",
  gorusuldu: "Görüşüldü",
  teklif_gonderildi: "Teklif",
  kapora_bekliyor: "Kapora",
  kazandi: "Kazandı",
  kaybedildi: "Kaybedildi",
  olusturuldu: "Link hazır",
  gonderildi: "Gönderildi",
  kayit_oldu: "Kurulum başladı",
  odeme_bekliyor: "Ek özellik bekliyor",
  davetiye_olusturuldu: "Davetiye oluşturuldu",
  yayinda: "Yayında",
};

function tarih(tarihDegeri: Date | null | undefined) {
  if (!tarihDegeri) return "Tarih yok";
  return tarihDegeri.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function publicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_URL || "https://davetrota.com";
  return `${base}${path}`;
}

export default async function PartnerEkipPage({ params }: Props) {
  const { token } = await params;
  const simdi = new Date();
  const erisim = await prisma.partnerEkipErisim.findFirst({
    where: {
      tokenHash: partnerEkipTokenHash(token),
      aktif: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: simdi } }],
    },
    select: {
      id: true,
      rol: true,
      etiket: true,
      expiresAt: true,
      partner: {
        select: {
          firmaAdi: true,
          logoUrl: true,
          markaRenk: true,
          markaSlogani: true,
          aktivasyonKodlari: {
            where: { durum: { not: "iptal" } },
            orderBy: { createdAt: "desc" },
            take: 80,
            select: {
              kod: true,
              durum: true,
              createdAt: true,
              kullanilanAt: true,
              davetiye: {
                select: {
                  slug: true,
                  baslik: true,
                  aktif: true,
                  tarih: true,
                  goruntulenme: true,
                  _count: {
                    select: {
                      davetliler: true,
                      rsvplar: true,
                      albumFotolar: true,
                      aniDefterleri: true,
                      sesliAnilar: true,
                    },
                  },
                },
              },
            },
          },
          leadler: {
            orderBy: { updatedAt: "desc" },
            take: 80,
            select: {
              baslik: true,
              etkinlikTuru: true,
              etkinlikTarihi: true,
              kisiSayisi: true,
              kaynak: true,
              durum: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  if (!erisim) notFound();

  await prisma.partnerEkipErisim.update({
    where: { id: erisim.id },
    data: { lastUsedAt: new Date() },
  });

  const markaRenk = erisim.partner.markaRenk || "#7c3aed";
  const rolEtiketi = partnerEkipRolEtiketi(erisim.rol);
  const leadler = erisim.partner.leadler;
  const kodlar = erisim.partner.aktivasyonKodlari;
  const yayinda = kodlar.filter(kod => kod.durum === "yayinda").length;
  const kurulumda = kodlar.filter(kod => ["kayit_oldu", "odeme_bekliyor", "davetiye_olusturuldu"].includes(kod.durum)).length;
  const sicakLead = leadler.filter(lead => ["teklif_gonderildi", "kapora_bekliyor"].includes(lead.durum)).length;
  const toplamRsvp = kodlar.reduce((toplam, kod) => toplam + (kod.davetiye?._count.rsvplar ?? 0), 0);

  const satisGorur = erisim.rol === PARTNER_EKIP_ROLLERI.satis;
  const operasyonGorur = erisim.rol === PARTNER_EKIP_ROLLERI.operasyon;
  const teslimGorur = erisim.rol === PARTNER_EKIP_ROLLERI.teslim;
  const gorevler = ekipGorevleri(erisim.rol);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {erisim.partner.logoUrl ? (
              <img
                src={erisim.partner.logoUrl}
                alt={`${erisim.partner.firmaAdi} logosu`}
                className="h-12 w-12 rounded-2xl border border-gray-100 bg-white object-contain p-1.5"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white"
                style={{ backgroundColor: markaRenk }}
              >
                {erisim.partner.firmaAdi.slice(0, 1).toLocaleUpperCase("tr-TR")}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-gray-950">{erisim.partner.firmaAdi}</p>
              <p className="text-xs font-semibold" style={{ color: markaRenk }}>
                {rolEtiketi} ekip erişimi
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500">
            <strong className="text-gray-800">{erisim.etiket || rolEtiketi}</strong>
            {erisim.expiresAt && <> · Süre: {tarih(erisim.expiresAt)}</>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: markaRenk }}>
            Sınırlı Yetki
          </p>
          <h1 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">
            {rolEtiketi} çalışma ekranı
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            Bu ekran yalnızca göreviniz için gerekli özetleri gösterir. Telefon, e-posta, not, davetli listesi ve ödeme bilgileri bu erişimde yer almaz.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <OzetKart baslik="Lead" deger={leadler.length.toString()} />
            <OzetKart baslik="Sıcak fırsat" deger={sicakLead.toString()} />
            <OzetKart baslik="Kurulumda" deger={kurulumda.toString()} />
            <OzetKart baslik="Yayında" deger={yayinda.toString()} />
          </div>

          <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <p className="text-sm font-black text-purple-950">Görev kontrol listesi</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {gorevler.map(gorev => (
                <div key={gorev} className="rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-relaxed text-purple-900">
                  {gorev}
                </div>
              ))}
            </div>
          </div>
        </section>

        {satisGorur && (
          <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-black text-gray-950">Satış özeti</h2>
            <p className="mt-1 text-sm text-gray-500">Kişisel iletişim bilgisi olmadan sıcak fırsat ve segment takibi.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {leadler.length > 0 ? leadler.slice(0, 10).map((lead, index) => (
                <KayitKart
                  key={`${lead.baslik}-${index}`}
                  baslik={lead.baslik}
                  etiket={DURUM_LABEL[lead.durum] ?? lead.durum}
                  detay={[lead.etkinlikTuru, lead.kisiSayisi ? `${lead.kisiSayisi} kişi` : null, lead.etkinlikTarihi ? tarih(lead.etkinlikTarihi) : null, lead.kaynak].filter(Boolean).join(" · ") || "Detay eklenmemiş"}
                />
              )) : <BosDurum metin="Görüntülenecek lead kaydı yok." />}
            </div>
          </section>
        )}

        {operasyonGorur && (
          <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-black text-gray-950">Operasyon akışı</h2>
            <p className="mt-1 text-sm text-gray-500">Aktivasyon, kurulum ve yayın durumları.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {kodlar.length > 0 ? kodlar.slice(0, 12).map(kod => (
                <KayitKart
                  key={kod.kod}
                  baslik={kod.davetiye?.baslik || `Kod ${kod.kod.slice(0, 6)}`}
                  etiket={DURUM_LABEL[kod.durum] ?? kod.durum}
                  detay={`Oluşturma: ${tarih(kod.createdAt)} · Kullanım: ${tarih(kod.kullanilanAt)}`}
                />
              )) : <BosDurum metin="Görüntülenecek aktivasyon kaydı yok." />}
            </div>
          </section>
        )}

        {teslimGorur && (
          <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-black text-gray-950">Teslim özetleri</h2>
            <p className="mt-1 text-sm text-gray-500">Müşteri teslim portalı, yayın linki ve toplam kullanım sayıları.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {kodlar.filter(kod => kod.davetiye).length > 0 ? kodlar.filter(kod => kod.davetiye).slice(0, 10).map(kod => (
                <div key={kod.kod} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-gray-950">{kod.davetiye?.baslik}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-500">
                        Görüntülenme: {kod.davetiye?.goruntulenme ?? 0} · RSVP: {kod.davetiye?._count.rsvplar ?? 0}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                      {DURUM_LABEL[kod.durum] ?? kod.durum}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={publicUrl(`/partner/aktivasyon/${kod.kod}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-purple-100 bg-purple-50 px-3 py-2 text-xs font-black text-purple-700"
                    >
                      Teslim portalı
                    </a>
                    {kod.davetiye && (
                      <a
                        href={publicUrl(`/davetiye/${kod.davetiye.slug}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700"
                      >
                        Davetiye
                      </a>
                    )}
                  </div>
                </div>
              )) : <BosDurum metin="Henüz teslim özeti oluşmuş davetiye yok." />}
            </div>
            <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-xs font-semibold text-purple-900">
              Toplam RSVP: {toplamRsvp}. Bu ekranda davetli isimleri veya yanıt detayları gösterilmez.
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-400">
          Erişimde sorun varsa partner hesap sahibinden yeni link isteyin.{" "}
          <Link href="/" className="font-semibold text-purple-500 hover:underline">DavetRota</Link>
        </p>
      </main>
    </div>
  );
}

function ekipGorevleri(rol: string) {
  if (rol === PARTNER_EKIP_ROLLERI.satis) {
    return [
      "Sıcak fırsatları kontrol et",
      "Teklif veya kapora aşamasındaki kayıtları partner sahibine bildir",
      "Kişisel iletişim bilgisini bu ekranda arama",
    ];
  }
  if (rol === PARTNER_EKIP_ROLLERI.teslim) {
    return [
      "Teslim portalı ve davetiye linklerini kontrol et",
      "Yayındaki davetiyenin açıldığını doğrula",
      "Müşteriye yalnızca gerekli teslim linkini ilet",
    ];
  }
  return [
    "Kurulum ve yayın durumlarını kontrol et",
    "QR veya canlı duvar testini etkinlikten önce yap",
    "Eksik gördüğün işi partner sahibine bildir",
  ];
}

function OzetKart({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-400">{baslik}</p>
      <p className="mt-1 text-2xl font-black tabular-nums text-gray-950">{deger}</p>
    </div>
  );
}

function KayitKart({ baslik, etiket, detay }: { baslik: string; etiket: string; detay: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-950">{baslik}</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-gray-500">{detay}</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-black text-gray-600 shadow-sm">
          {etiket}
        </span>
      </div>
    </div>
  );
}

function BosDurum({ metin }: { metin: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center md:col-span-2">
      <p className="text-sm font-bold text-gray-500">{metin}</p>
    </div>
  );
}
