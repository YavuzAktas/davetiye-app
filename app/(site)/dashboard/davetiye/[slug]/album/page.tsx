import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { SABLONLAR } from "@/lib/sablonlar";
import { ModerasyonIcerik } from "@/components/ModerasyonListe";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

interface Props { params: Promise<{ slug: string }> }

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default async function AlbumModerasyon({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/giris");

  const davetiyeTemel = await prisma.davetiye.findUnique({
    where: { slug },
    select: {
      id: true, userId: true, baslik: true, sablon: true, odemeDurumu: true,
      albumAktif: true, aniDefteriAktif: true, sesliAniAktif: true, canliDuvarAktif: true,
    },
  });
  if (!davetiyeTemel || davetiyeTemel.userId !== user.id) notFound();

  const sablon = SABLONLAR.find((s) => s.id === davetiyeTemel.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const rgb = hexToRgb(renk);

  // ── Plan gate — hero göster, içeriği kilitle ──
  if (!davetiyeOzelligiAktif(davetiyeTemel, "album")) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="relative bg-[#080112] overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
            style={{ backgroundColor: renk }} />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
            <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
              <Link href="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
              <span>›</span>
              <Link href={`/dashboard/davetiye/${slug}`} className="hover:text-white/60 transition-colors">{davetiyeTemel.baslik}</Link>
              <span>›</span>
              <span className="text-white/50">Albüm & Anı</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shrink-0"
                style={{ backgroundColor: renk + "22", border: `2px solid ${renk}44` }}>
                📸
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Albüm & Anı Yönetimi</h1>
                <p className="text-white/40 text-sm mt-1">{davetiyeTemel.baslik} · Ek özellik</p>
              </div>
            </div>
          </div>
          <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white border border-gray-100 rounded-3xl px-6 py-16 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">📸</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Albüm & Anı bu davetiyede aktif değil</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Bu özellik davetiye oluşturulurken seçilmemiş ya da henüz ödeme tamamlanmamış.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Hangi panel QR'a bağlansın? ──
  const qrPanel = davetiyeTemel.albumAktif || davetiyeOzelligiAktif(davetiyeTemel, "canliDuvar")
    ? "foto"
    : davetiyeOzelligiAktif(davetiyeTemel, "aniDefteri")
    ? "ani"
    : davetiyeOzelligiAktif(davetiyeTemel, "sesliAni")
    ? "sesli"
    : null;
  const qrUrl = qrPanel
    ? `${process.env.NEXT_PUBLIC_URL}/davetiye/${slug}?panel=${qrPanel}`
    : `${process.env.NEXT_PUBLIC_URL}/davetiye/${slug}`;

  // ── Özellik aktif: tam veri yükle ──
  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: user.id },
    select: {
      baslik: true,
      albumFotolar: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          yukleyenAd: true,
          dosyaUrl: true,
          onaylandi: true,
          createdAt: true,
        },
      },
      aniDefterleri: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          yazarAd: true,
          icerik: true,
          onaylandi: true,
          createdAt: true,
        },
      },
      sesliAnilar: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          adSoyad: true,
          dosyaUrl: true,
          sure: true,
          onaylandi: true,
          createdAt: true,
        },
      },
    },
  });
  if (!davetiye) notFound();

  const bekleyenIcerikSayisi =
    davetiye.albumFotolar.filter((f) => !f.onaylandi).length +
    davetiye.aniDefterleri.filter((a) => !a.onaylandi).length +
    davetiye.sesliAnilar.filter((s) => !s.onaylandi).length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none"
          style={{ backgroundColor: renk }} />
        <div className="absolute bottom-0 right-1/3 w-56 h-56 rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ backgroundColor: renk }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span>›</span>
            <Link href={`/dashboard/davetiye/${slug}`} className="hover:text-white/60 transition-colors">{davetiye.baslik}</Link>
            <span>›</span>
            <span className="text-white/50">Albüm & Anı</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl shrink-0 shadow-2xl"
              style={{ backgroundColor: renk + "22", border: `2px solid ${renk}44` }}>
              📸
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {bekleyenIcerikSayisi > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                    {bekleyenIcerikSayisi} onay bekliyor
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">Albüm & Anı Yönetimi</h1>
              <p className="text-white/40 text-sm">{davetiye.baslik}</p>
            </div>
            <Link href={`/dashboard/davetiye/${slug}`}
              className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)`, color: "#fff", boxShadow: `0 4px 20px rgba(${rgb}, 0.4)` }}>
              ← Davetiye
            </Link>
          </div>
        </div>
        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ── Masa QR Kartı ── */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Masa QR Kodu</p>
            <p className="text-xs text-gray-300 mt-0.5">Masalara koyunca misafirler direkt bu sayfayı açar</p>
          </div>
          <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: renk + "08", border: `1px solid ${renk}20` }}>
                <img
                  src={`/api/qr?url=${encodeURIComponent(qrUrl)}`}
                  alt="Anı & Katılım QR"
                  className="w-36 h-36 rounded-lg"
                />
              </div>
              <a
                href={`/api/qr?url=${encodeURIComponent(qrUrl)}`}
                download={`ani-qr-${slug}.png`}
                className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: renk }}
              >
                ⬇ QR İndir
              </a>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-1">Nasıl kullanılır?</p>
                <ol className="text-xs text-gray-500 space-y-1.5 leading-relaxed list-decimal list-inside">
                  <li>QR kodunu indirip yazdır (A7 veya kartvizit boyutu önerilir)</li>
                  <li>Etkinlik masalarına veya düğün defterine yerleştir</li>
                  <li>Misafirler telefon kameralarıyla okutunca anı paneli otomatik açılır</li>
                  <li>Fotoğraf, anı yazısı veya sesli mesaj bırakabilirler</li>
                </ol>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50">
                <span className="text-gray-400 text-xs font-mono truncate flex-1 select-all">
                  /davetiye/{slug}{qrPanel ? `?panel=${qrPanel}` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Anı Kitabı ── */}
        {(davetiye.albumFotolar.filter(f => f.onaylandi).length > 0 ||
          davetiye.aniDefterleri.filter(a => a.onaylandi).length > 0 ||
          davetiye.sesliAnilar.filter(s => s.onaylandi).length > 0) && (
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(to right, ${renk}, ${renk}99)` }} />
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: renk + "15", border: `1px solid ${renk}30` }}>
                📖
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 mb-1">Anı Kitabı</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Misafirlerin bıraktığı onaylı fotoğraf, yazılı anı ve sesli mesajları tek bir PDF'e derliyoruz.
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {davetiye.albumFotolar.filter(f => f.onaylandi).length > 0 && (
                    <span className="text-[11px] text-gray-400">📸 {davetiye.albumFotolar.filter(f => f.onaylandi).length} fotoğraf</span>
                  )}
                  {davetiye.aniDefterleri.filter(a => a.onaylandi).length > 0 && (
                    <span className="text-[11px] text-gray-400">💌 {davetiye.aniDefterleri.filter(a => a.onaylandi).length} anı</span>
                  )}
                  {davetiye.sesliAnilar.filter(s => s.onaylandi).length > 0 && (
                    <span className="text-[11px] text-gray-400">🎙 {davetiye.sesliAnilar.filter(s => s.onaylandi).length} ses kaydı</span>
                  )}
                </div>
              </div>
              <a
                href={`/api/davetiye/${slug}/ani-kitabi`}
                download={`ani-kitabi-${slug}.pdf`}
                className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, ${renk}, ${renk}cc)`, color: "#fff", boxShadow: `0 4px 20px rgba(${rgb}, 0.3)` }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF İndir
              </a>
            </div>
          </div>
        )}

        <ModerasyonIcerik
          baslangicFotolar={davetiye.albumFotolar.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() }))}
          baslangicAnilar={davetiye.aniDefterleri.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
          baslangicSesliAnilar={davetiye.sesliAnilar.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))}
          slug={slug}
          renk={renk}
        />
        <div className="rounded-2xl p-5 flex gap-4" style={{ backgroundColor: renk + "08", border: `1px solid ${renk}20` }}>
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Moderasyon Hakkında</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Misafirler yüklediği fotoğraf ve yazdığı anılar önce burada görünür. Onayladıktan sonra davetiye sayfasındaki
              albümde herkese açık hale gelir. İstediğin zaman geri alabilir veya silebilirsin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
