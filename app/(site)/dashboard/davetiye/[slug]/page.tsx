import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import RsvpListesi from "@/components/RsvpListesi";
import YeniDavetiyeToast from "@/components/YeniDavetiyeToast";
import { SABLONLAR } from "@/lib/sablonlar";
import DavetiyeOdemePanel from "@/components/DavetiyeOdemePanel";
import { davetiyeFiyatiHesapla, type DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import AniKitabiButon from "@/components/AniKitabiButon";

interface Props {
  params: Promise<{ slug: string }>;
}

const EMOJILER: Record<string, string> = {
  dugun: "💒", nisan: "💍", dogumgunu: "🎂", sunnet: "⭐",
  kina: "🕯️", kurumsal: "🏢", diger: "🎉",
};

const ETIKETLER: Record<string, string> = {
  dugun: "Düğün", nisan: "Nişan", dogumgunu: "Doğum Günü",
  sunnet: "Sünnet", kina: "Kına", kurumsal: "Kurumsal", diger: "Diğer",
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default async function DavetiyeDetay({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: {
      slug: true,
      id: true,
      baslik: true,
      etkinlikTur: true,
      tarih: true,
      mekan: true,
      sablon: true,
      muzik: true,
      aktif: true,
      odemeDurumu: true,
      fiyatSnapshot: true,
      albumAktif: true,
      aniDefteriAktif: true,
      sesliAniAktif: true,
      canliDuvarAktif: true,
      oturmaPlanAktif: true,
      aniKitabiAktif: true,
      goruntulenme: true,
      _count: {
        select: {
          albumFotolar: true,
          aniDefterleri: true,
          sesliAnilar: true,
        },
      },
      createdAt: true,
    },
  });

  if (!davetiye) notFound();

  const [rsvpGruplari, baslangicRsvplar, bekleyenDavetliler] = await Promise.all([
    prisma.rSVP.groupBy({
      by: ["katilim"],
      where: { davetiyeId: davetiye.id },
      _count: { id: true },
      _sum: { kisiSayisi: true },
    }),
    prisma.rSVP.findMany({
      where: { davetiyeId: davetiye.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true, ad: true, email: true, mesaj: true,
        katilim: true, kisiSayisi: true, diyet: true,
        sarkiOnerisi: true, cevaplar: true,
      },
    }),
    prisma.davetli.findMany({
      where: { davetiyeId: davetiye.id, rsvpId: null },
      select: { id: true, ad: true, email: true },
      orderBy: { ad: "asc" },
      take: 200,
    }),
  ]);

  const sablon = SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const rgb = hexToRgb(renk);
  const emoji = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
  const etiket = ETIKETLER[davetiye.etkinlikTur] ?? "Etkinlik";

  const katilimSatiri    = rsvpGruplari.find(r => r.katilim);
  const katilmayanSatiri = rsvpGruplari.find(r => !r.katilim);
  const katilimCount    = katilimSatiri?._count.id ?? 0;
  const katilmayanCount = katilmayanSatiri?._count.id ?? 0;
  const toplamRsvp      = katilimCount + katilmayanCount;
  const toplamKisi      = katilimSatiri?._sum.kisiSayisi ?? 0;
  const katilimYuzde    = toplamRsvp ? Math.round((katilimCount / toplamRsvp) * 100) : 0;

  const davetiyeUrl = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`;
  const odemeBekliyor = davetiye.odemeDurumu === "odeme_bekliyor";
  const fiyatSnapshot = davetiye.fiyatSnapshot as DavetiyeFiyatSonucu | null;
  const fiyat = fiyatSnapshot ?? davetiyeFiyatiHesapla({
    sablon: davetiye.sablon,
    muzik: davetiye.muzik,
    albumAktif: davetiye.albumAktif,
    aniDefteriAktif: davetiye.aniDefteriAktif,
    sesliAniAktif: davetiye.sesliAniAktif,
    canliDuvarAktif: davetiye.canliDuvarAktif,
    oturmaPlanAktif: davetiye.oturmaPlanAktif,
  });
  const oturmaPlanAktif  = davetiyeOzelligiAktif(davetiye, "oturmaPlan");
  const canliDuvarOdendi = davetiyeOzelligiAktif(davetiye, "canliDuvar");
  const canliDuvarUrl    = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}/canli-duvar`;
  const albumAktif       = davetiyeOzelligiAktif(davetiye, "album");
  const aniDefAktif      = davetiyeOzelligiAktif(davetiye, "aniDefteri");
  const sesliAniAktif    = davetiyeOzelligiAktif(davetiye, "sesliAni");
  const aniKitabiAktif   = davetiyeOzelligiAktif(davetiye, "aniKitabi");
  const herhangiAniAktif = albumAktif || aniDefAktif || sesliAniAktif;
  const toplamIcerik     = davetiye._count.albumFotolar + davetiye._count.aniDefterleri + davetiye._count.sesliAnilar;

  const tarihStr = davetiye.tarih
    ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(davetiye.tarih))
    : null;

  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const etkinlikGunu = davetiye.tarih ? new Date(davetiye.tarih) : null;
  etkinlikGunu?.setHours(0, 0, 0, 0);
  const etkinligeKalanGun = etkinlikGunu
    ? Math.ceil((etkinlikGunu.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const etkinlikYaklasti = etkinligeKalanGun !== null && etkinligeKalanGun <= 1;
  const etkinlikGecti = etkinligeKalanGun !== null && etkinligeKalanGun < 0;
  const checkinDurumMetni = etkinligeKalanGun === null
    ? "Etkinlik günü kullanılır"
    : etkinlikGecti
      ? "Etkinlik geçti"
      : etkinligeKalanGun === 0
        ? "Bugün kullan"
        : etkinligeKalanGun === 1
          ? "Yarın hazır olsun"
          : "Etkinlik günü kullanılır";
  const checkinVurgulu = etkinligeKalanGun !== null && etkinligeKalanGun >= 0 && etkinligeKalanGun <= 1;
  const bekleyenDavetliSayisi = bekleyenDavetliler.length;
  const anaAksiyon = odemeBekliyor
    ? {
        etiket: "Sonraki adım",
        baslik: "Ödemeyi tamamlayıp davetiyeyi yayına al",
        aciklama: "Davetiyen hazır. Ödeme tamamlandıktan sonra paylaşım, RSVP ve QR akışları aktif kullanılabilir.",
        href: "#odeme-paneli",
        buton: "Ödemeye geç",
        ikincilHref: davetiyeUrl,
        ikincilButon: "Önizle",
      }
    : etkinlikGecti && herhangiAniAktif
      ? {
          etiket: "Etkinlik sonrası",
          baslik: toplamIcerik > 0 ? "Anıları toparla ve arşivi hazırla" : "Misafir anılarını kontrol et",
          aciklama: "Fotoğraf, yazılı anı ve sesli mesajları tek yerden yönetip etkinlik sonrası arşivini hazırlayabilirsin.",
          href: `/dashboard/davetiye/${davetiye.slug}/album`,
          buton: "Anıları yönet",
          ikincilHref: davetiyeUrl,
          ikincilButon: "Davetiyeyi gör",
        }
      : etkinlikYaklasti
        ? {
            etiket: etkinligeKalanGun === 0 ? "Bugünün önceliği" : "Etkinlik yaklaşıyor",
            baslik: "QR check-in ekranını hazır tut",
            aciklama: "Etkinlik girişinde davetlilerin kişiye özel QR kodlarını okutarak katılımı hızlıca takip edebilirsin.",
            href: `/dashboard/davetiye/${davetiye.slug}/check-in`,
            buton: "Check-in'i aç",
            ikincilHref: `/dashboard/davetiye/${davetiye.slug}/davetliler`,
            ikincilButon: "Davetlileri kontrol et",
          }
        : bekleyenDavetliSayisi > 0 && toplamRsvp > 0
          ? {
              etiket: "Yanıt takibi",
              baslik: `${bekleyenDavetliSayisi} davetli henüz yanıt vermedi`,
              aciklama: "Cevaplamayan davetlileri filtreleyip kişiye özel bağlantıyla WhatsApp hatırlatması gönderebilirsin.",
              href: `/dashboard/davetiye/${davetiye.slug}/davetliler`,
              buton: "Hatırlatma gönder",
              ikincilHref: "#paylasim",
              ikincilButon: "Paylaşımı aç",
            }
          : toplamRsvp === 0
            ? {
                etiket: "Yayına hazır",
                baslik: "Davetiyeyi misafirlerinle paylaş",
                aciklama: "Linki kopyalayabilir, WhatsApp üzerinden gönderebilir veya genel QR kodunu indirebilirsin.",
                href: "#paylasim",
                buton: "Paylaşmaya başla",
                ikincilHref: davetiyeUrl,
                ikincilButon: "Önizle",
              }
            : {
                etiket: "Yönetim",
                baslik: "Yanıtları ve davetli listesini takip et",
                aciklama: "Katılım durumunu, kişi sayısını ve davetlilerin özel bağlantılarını tek ekrandan yönetebilirsin.",
                href: `/dashboard/davetiye/${davetiye.slug}/davetliler`,
                buton: "Davetlileri yönet",
                ikincilHref: "#paylasim",
                ikincilButon: "Paylaşım araçları",
              };

  const olusturulmaTarih = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(davetiye.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Suspense fallback={null}>
        <YeniDavetiyeToast />
      </Suspense>

      {/* ══ DARK HERO ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div
          className="absolute -top-20 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: renk }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ backgroundColor: renk }}
        />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span>›</span>
            <span className="text-white/50 truncate max-w-48">{davetiye.baslik}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl shrink-0 shadow-2xl"
              style={{ backgroundColor: renk + "22", border: `2px solid ${renk}44` }}
            >
              {emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: renk + "25", color: renk }}
                >
                  {etiket}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  davetiye.aktif
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/10 text-white/40"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${davetiye.aktif ? "bg-emerald-400" : "bg-white/30"}`} />
                  {odemeBekliyor ? "Ödeme Bekliyor" : davetiye.aktif ? "Yayında" : "Pasif"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
                {davetiye.baslik}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3">
                {tarihStr && (
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <span>📅</span>
                    <span>{tarihStr}</span>
                  </div>
                )}
                {davetiye.mekan && (
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <span>📍</span>
                    <span className="truncate max-w-48">{davetiye.mekan}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-white/30 text-xs">
                  <span>🗓️</span>
                  <span>{olusturulmaTarih}&apos;de oluşturuldu</span>
                </div>
              </div>
            </div>

            {!odemeBekliyor && (
              <Link
                href={davetiyeUrl}
                target="_blank"
                className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${renk}, ${renk}cc)`,
                  color: "#fff",
                  boxShadow: `0 4px 20px rgba(${rgb}, 0.4)`,
                }}
              >
                Davetiyeyi Gör
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {odemeBekliyor && (
          <div id="odeme-paneli" className="scroll-mt-6">
            <DavetiyeOdemePanel davetiyeId={davetiye.id} baslik={davetiye.baslik} fiyat={fiyat} adminMi={["aylinyavuz@gmail.com","mehlikaalan@icloud.com"].includes(session.user.email ?? "")} />
          </div>
        )}

        {/* ── Next best action ── */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: renk + "14", color: renk }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: renk }}>
                {anaAksiyon.etiket}
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {anaAksiyon.baslik}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mt-1 max-w-2xl">
                {anaAksiyon.aciklama}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 shrink-0">
              <Link
                href={anaAksiyon.href}
                className="inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${renk}, ${renk}cc)`,
                  color: "#fff",
                  boxShadow: `0 4px 18px rgba(${rgb}, 0.24)`,
                }}
              >
                {anaAksiyon.buton}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href={anaAksiyon.ikincilHref}
                target={anaAksiyon.ikincilHref.startsWith("http") ? "_blank" : undefined}
                className="inline-flex items-center justify-center text-sm font-semibold px-5 py-3 rounded-2xl border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {anaAksiyon.ikincilButon}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Görüntülenme", value: davetiye.goruntulenme, icon: "👁️", sub: "toplam ziyaret" },
            { label: "Katılıyor",    value: katilimCount,          icon: "✅", sub: `${toplamKisi} kişi toplam` },
            { label: "Katılmıyor",   value: katilmayanCount,       icon: "❌", sub: "bildirim aldı" },
            { label: "Yanıt Oranı",  value: `%${katilimYuzde}`,    icon: "📊", sub: `${toplamRsvp} yanıt` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ backgroundColor: renk + "20", transform: "translate(40%, -40%)" }}
              />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${renk}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* ── Mobil hızlı erişim (sadece küçük ekran) ── */}
        <div className="lg:hidden grid grid-cols-2 gap-2">
          <Link
            href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
            className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">👥</span>
            <span className="text-xs font-semibold text-gray-700 truncate">Davetliler</span>
          </Link>
          <Link
            href={`/dashboard/davetiye/${davetiye.slug}/check-in`}
            className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-emerald-100 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-base shrink-0">✅</span>
            <span className="text-xs font-semibold text-gray-700 truncate">Check-in</span>
          </Link>
          <Link
            href={`/dashboard/davetiye/${davetiye.slug}/rsvp-sorular`}
            className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">📋</span>
            <span className="text-xs font-semibold text-gray-700 truncate">RSVP</span>
          </Link>
          <Link
            href={`/dashboard/davetiye/${davetiye.slug}/program`}
            className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">📅</span>
            <span className="text-xs font-semibold text-gray-700 truncate">Program</span>
          </Link>
          <Link
            href={`/dashboard/davetiye/${davetiye.slug}/album`}
            className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">📸</span>
            <span className="text-xs font-semibold text-gray-700 truncate">Albüm</span>
          </Link>
          {!odemeBekliyor && (
            <a
              href={davetiyeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 min-w-0 px-3 py-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-base shrink-0">👁️</span>
              <span className="text-xs font-semibold text-gray-700 truncate">Önizle</span>
            </a>
          )}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Share + RSVP (3/5) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Share Card */}
            <div id="paylasim" className="bg-white border border-gray-100 rounded-3xl overflow-hidden scroll-mt-6">
              <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Paylaşım</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Genel link, kişiye özel linkler ve mekan QR&apos;ını ayrı yönetin.</p>
                </div>
                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                  className="inline-flex items-center justify-center text-center text-xs font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-90 sm:shrink-0"
                  style={{ borderColor: renk + "44", color: renk, backgroundColor: renk + "10" }}
                >
                  Davetli linklerini yönet →
                </Link>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: renk + "14", color: renk }}
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H15a3 3 0 010 6h-1.5m-3 0H9a3 3 0 010-6h1.5m-1.5 6h6" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">Genel davetiye linki</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Hızlı paylaşım için kullanılır. Kişi bazlı takip gerekiyorsa davetli linklerini tercih edin.</p>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 min-w-0 border border-gray-100 rounded-xl px-3 py-2.5 text-xs bg-white text-gray-500 font-mono overflow-x-auto whitespace-nowrap">
                          {davetiyeUrl}
                        </div>
                        <CopyButton text={davetiyeUrl} />
                      </div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(davetiye.baslik + " için davetiyem: " + davetiyeUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-center gap-2 bg-[#25D366] text-white text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold"
                        >
                          WhatsApp ile paylaş
                        </a>
                        <a
                          href={`https://t.me/share/url?url=${encodeURIComponent(davetiyeUrl)}&text=${encodeURIComponent(davetiye.baslik)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-center gap-2 bg-[#229ED9] text-white text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold"
                        >
                          Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="p-2.5 rounded-2xl shrink-0"
                        style={{ backgroundColor: renk + "08", border: `1px solid ${renk}20` }}
                      >
                        <img
                          src={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                          alt="Genel davetiye QR kodu"
                          className="w-20 h-20 rounded-lg"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900">Mekan QR&apos;ı</p>
                        <p className="text-xs text-gray-400 leading-relaxed mt-0.5">Masa kartı, giriş panosu veya baskı için genel QR kod.</p>
                        <a
                          href={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                          download={`davetiye-${davetiye.slug}.png`}
                          className="mt-3 inline-flex items-center justify-center text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                          style={{ backgroundColor: renk + "12", color: renk }}
                        >
                          QR indir
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-gray-200 p-4">
                    <p className="text-sm font-bold text-gray-900">Kişiye özel davetli linkleri</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">
                      RSVP takibi ve hatırlatma için her davetliye özel bağlantı oluşturulur.
                    </p>
                    <Link
                      href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                      className="mt-3 inline-flex w-full sm:w-auto items-center justify-center text-center text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                      style={{ backgroundColor: renk + "12", color: renk }}
                    >
                      Davetlileri aç
                    </Link>
                  </div>

                  {canliDuvarOdendi && (
                    <div className="rounded-2xl border border-gray-100 p-4">
                      <p className="text-sm font-bold text-gray-900">Canlı duvar linki</p>
                      <p className="text-xs text-gray-400 leading-relaxed mt-1">Salon TV&apos;sinde açılır; onaylı fotoğraflar etkinlikte akar.</p>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 min-w-0 border border-gray-100 rounded-xl px-3 py-2.5 text-xs bg-gray-50 text-gray-500 font-mono overflow-x-auto whitespace-nowrap">
                          {canliDuvarUrl}
                        </div>
                        <CopyButton text={canliDuvarUrl} />
                      </div>
                      <a
                        href={canliDuvarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center justify-center text-xs font-semibold text-gray-500 hover:text-gray-700 break-words"
                      >
                        Canlı duvarı aç ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RSVP List */}
            <RsvpListesi
              baslangicRsvplar={baslangicRsvplar.map(r => ({
                id: r.id,
                ad: r.ad,
                email: r.email,
                mesaj: r.mesaj,
                katilim: r.katilim,
                kisiSayisi: r.kisiSayisi,
                diyet: r.diyet,
                sarkiOnerisi: r.sarkiOnerisi,
                cevaplar: (r.cevaplar as { ulasim?: boolean; cocuk?: number; alerji?: string; ozelSoru?: string; ozelCevap?: string } | null) ?? null,
              }))}
              baslangicBekleyenler={bekleyenDavetliler.map(d => ({
                davetliId: d.id,
                ad: d.ad,
                email: d.email,
              }))}
              slug={slug}
              renk={renk}
            />
          </div>

          {/* RIGHT — Quick actions sidebar (2/5) */}
          <div className="lg:col-span-2 space-y-4">

            {/* Hızlı İşlemler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Hızlı İşlemler</p>
              <div className="space-y-2">

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">👥</div>
                    <span className="text-sm font-medium text-gray-700">Davetliler</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={davetiyeUrl}
                  target="_blank"
                  aria-disabled={odemeBekliyor}
                  className={`flex items-center justify-between w-full p-3.5 rounded-2xl border transition-all group ${
                    odemeBekliyor
                      ? "pointer-events-none border-gray-100 bg-gray-50 opacity-50"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">👁️</div>
                    <span className="text-sm font-medium text-gray-700">Önizle</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">↗</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/rsvp-sorular`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">📋</div>
                    <span className="text-sm font-medium text-gray-700">RSVP Soruları</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/check-in`}
                  className={`flex items-center justify-between w-full p-3.5 rounded-2xl border transition-all group ${
                    checkinVurgulu
                      ? "border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50"
                      : "border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform ${
                      checkinVurgulu ? "bg-emerald-100" : "bg-gray-50"
                    }`}>✅</div>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium text-gray-700">QR Check-in</span>
                      <span className={`block text-[11px] font-semibold mt-0.5 ${
                        checkinVurgulu ? "text-emerald-600" : "text-gray-400"
                      }`}>
                        {checkinDurumMetni}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-emerald-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/program`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">📅</div>
                    <span className="text-sm font-medium text-gray-700">Etkinlik Programı</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/album`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">📸</div>
                    <span className="text-sm font-medium text-gray-700">Albüm & Anı</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/oturma-plani`}
                  aria-disabled={!oturmaPlanAktif}
                  className={`flex items-center justify-between w-full p-3.5 rounded-2xl border transition-all group ${
                    oturmaPlanAktif
                      ? "border-purple-100 hover:border-purple-200 hover:bg-purple-50/50"
                      : "pointer-events-none border-gray-100 bg-gray-50 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">🪑</div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Oturma Planı</span>
                      <span className="ml-2 text-[10px] font-semibold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md">
                        {oturmaPlanAktif ? "Aktif" : "Ek özellik"}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-300 group-hover:text-purple-400 transition-colors text-sm">→</span>
                </Link>

              </div>
            </div>

          </div>
        </div>

        {/* ── Anı & Arşiv (sayfanın altında, yardımcı bölüm olarak) ── */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[#080112]" />
          <div className="absolute -top-16 right-12 w-72 h-72 rounded-full blur-[90px] opacity-20 pointer-events-none" style={{ backgroundColor: renk }} />
          <div className="absolute bottom-0 left-6 w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none" style={{ backgroundColor: renk }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative px-6 sm:px-8 py-7">
            <div className="flex flex-col sm:flex-row gap-6 items-start">

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: renk + "22", border: `1px solid ${renk}40` }}
                  >
                    📖
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: renk + "99" }}>
                      Anı & Arşiv
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">
                      {herhangiAniAktif ? "Aktif özellik" : "Premium özellik"}
                    </p>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">
                  {herhangiAniAktif
                    ? toplamIcerik > 0
                      ? `Misafirleriniz ${toplamIcerik} anı bıraktı`
                      : "Anı arşiviniz hazır — QR kodu masalara koyun"
                    : "Sadece davet değil, anı arşivi"}
                </h2>
                <p className="text-sm text-white/35 leading-relaxed max-w-xl">
                  {herhangiAniAktif
                    ? "Fotoğraf, anı yazısı ve sesli mesajları yönetin. Etkinlik sonrası tek tıkla PDF kitap indirin."
                    : "Misafirler QR kodu tarayarak fotoğraf yükler, anı yazar, sesli mesaj bırakır. Etkinlik sonrası tek PDF kitap olur."}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { icon: "📸", label: "Fotoğraf Albümü", aktif: albumAktif,       count: davetiye._count.albumFotolar  },
                    { icon: "💌", label: "Anı Defteri",     aktif: aniDefAktif,       count: davetiye._count.aniDefterleri },
                    { icon: "🎙", label: "Sesli Mesaj",     aktif: sesliAniAktif,     count: davetiye._count.sesliAnilar   },
                    { icon: "📖", label: "PDF Kitap",       aktif: aniKitabiAktif,    count: null                          },
                    { icon: "📺", label: "Canlı Duvar",     aktif: canliDuvarOdendi,  count: null                          },
                  ].map(f => (
                    <span
                      key={f.label}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-full border"
                      style={f.aktif
                        ? { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.12)" }
                        : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.2)",  borderColor: "rgba(255,255,255,0.06)" }
                      }
                    >
                      {f.icon} {f.label}
                      {f.aktif && f.count != null && f.count > 0 && (
                        <span className="font-bold ml-0.5" style={{ color: renk }}>{f.count}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto sm:items-end">
                {herhangiAniAktif ? (
                  <>
                    <Link
                      href={`/dashboard/davetiye/${davetiye.slug}/album`}
                      className="flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl transition-all hover:opacity-90 whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${renk}, ${renk}cc)`,
                        color: "#fff",
                        boxShadow: `0 4px 20px rgba(${rgb}, 0.35)`,
                      }}
                    >
                      Albüm & Anıları Yönet →
                    </Link>
                    {aniKitabiAktif && (
                      <AniKitabiButon slug={davetiye.slug} renk={renk} rgb={rgb} />
                    )}
                    {canliDuvarOdendi && (
                      <a
                        href={canliDuvarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-2xl border transition-all hover:bg-white/8 whitespace-nowrap"
                        style={{ borderColor: renk + "45", color: renk }}
                      >
                        📺 Canlı Duvarı Aç ↗
                      </a>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <p className="text-xs text-white/25 leading-relaxed sm:text-right">
                      Bu özellikler yeni davetiyede<br className="hidden sm:block" />
                      oluşturma sırasında seçilebilir.
                    </p>
                    <Link
                      href="/olustur"
                      className="flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-2xl border transition-all hover:bg-white/8"
                      style={{ borderColor: renk + "45", color: renk }}
                    >
                      Yeni Davetiye Oluştur →
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
