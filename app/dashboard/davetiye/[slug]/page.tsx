import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { SABLONLAR } from "@/lib/sablonlar";

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

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/giris");

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: { rsvplar: { orderBy: { createdAt: "desc" } } },
  });

  if (!davetiye || davetiye.userId !== user.id) notFound();

  const sablon = SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const rgb = hexToRgb(renk);
  const emoji = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
  const etiket = ETIKETLER[davetiye.etkinlikTur] ?? "Etkinlik";

  const katilimlar = davetiye.rsvplar.filter(r => r.katilim);
  const katilmayanlar = davetiye.rsvplar.filter(r => !r.katilim);
  const toplamKisi = katilimlar.reduce((a, r) => a + r.kisiSayisi, 0);
  const katilimYuzde = davetiye.rsvplar.length
    ? Math.round((katilimlar.length / davetiye.rsvplar.length) * 100)
    : 0;

  const davetiyeUrl = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`;

  const tarihStr = davetiye.tarih
    ? new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(davetiye.tarih))
    : null;

  const olusturulmaTarih = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(davetiye.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* ══ DARK HERO ══ */}
      <div className="relative bg-[#080112] overflow-hidden">
        {/* Color blobs themed to invitation */}
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
            {/* Invitation icon */}
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
                  {davetiye.aktif ? "Yayında" : "Pasif"}
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
                  <span>{olusturulmaTarih}'de oluşturuldu</span>
                </div>
              </div>
            </div>

            {/* CTA */}
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
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Görüntülenme", value: davetiye.goruntulenme, icon: "👁️", sub: "toplam ziyaret" },
            { label: "Katılıyor", value: katilimlar.length, icon: "✅", sub: `${toplamKisi} kişi toplam` },
            { label: "Katılmıyor", value: katilmayanlar.length, icon: "❌", sub: "bildirim aldı" },
            { label: "Yanıt Oranı", value: `%${katilimYuzde}`, icon: "📊", sub: `${davetiye.rsvplar.length} yanıt` },
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

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Share + RSVP (3/5) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Share Card */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Paylaşım</p>
                  <p className="text-xs text-gray-300 mt-0.5">Davetiyeyi misafirlerinle paylaş</p>
                </div>
                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border transition-all hover:opacity-90"
                  style={{ borderColor: renk + "44", color: renk, backgroundColor: renk + "10" }}
                >
                  👥 Davetliler →
                </Link>
              </div>

              <div className="p-6 flex flex-col sm:flex-row gap-6">
                {/* QR */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: renk + "08", border: `1px solid ${renk}20` }}
                  >
                    <img
                      src={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                      alt="QR Kod"
                      className="w-28 h-28 rounded-lg"
                    />
                  </div>
                  <a
                    href={`/api/qr?url=${encodeURIComponent(davetiyeUrl)}`}
                    download={`davetiye-${davetiye.slug}.png`}
                    className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                    style={{ color: renk }}
                  >
                    ⬇ QR İndir
                  </a>
                </div>

                {/* Link + Buttons */}
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">Davetiye Linki</p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={davetiyeUrl}
                        className="flex-1 min-w-0 border border-gray-100 rounded-xl px-3 py-2.5 text-xs bg-gray-50 text-gray-500 focus:outline-none font-mono"
                      />
                      <CopyButton text={davetiyeUrl} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">Hızlı Paylaşım</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(davetiye.baslik + " için davetiyem: " + davetiyeUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] text-white text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(davetiyeUrl)}&text=${encodeURIComponent(davetiye.baslik)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#229ED9] text-white text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-semibold"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP List */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Katılım Bildirimleri</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-900">{davetiye.rsvplar.length} yanıt</span>
                    {katilmayanlar.length > 0 && (
                      <span className="text-xs text-gray-400">· {katilmayanlar.length} katılamıyor</span>
                    )}
                  </div>
                </div>
                {davetiye.rsvplar.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${katilimYuzde}%`, backgroundColor: renk }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: renk }}>%{katilimYuzde}</span>
                  </div>
                )}
              </div>

              {davetiye.rsvplar.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📭</div>
                  <p className="text-gray-500 text-sm font-medium">Henüz yanıt yok</p>
                  <p className="text-gray-300 text-xs mt-1">Davetiyeyi paylaşınca bildirimler burada görünecek</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {davetiye.rsvplar.map((rsvp) => (
                    <div key={rsvp.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={rsvp.katilim
                          ? { backgroundColor: renk + "18", color: renk }
                          : { backgroundColor: "#fef2f2", color: "#f87171" }
                        }
                      >
                        {rsvp.ad[0]?.toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{rsvp.ad}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          {rsvp.email && (
                            <p className="text-xs text-gray-400 truncate">{rsvp.email}</p>
                          )}
                          {rsvp.not && (
                            <p className="text-xs text-gray-400 italic truncate max-w-40">"{rsvp.not}"</p>
                          )}
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-3 shrink-0">
                        {rsvp.katilim && rsvp.kisiSayisi > 1 && (
                          <span className="text-xs text-gray-400 font-medium">{rsvp.kisiSayisi} kişi</span>
                        )}
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            rsvp.katilim
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {rsvp.katilim ? "✓ Katılıyor" : "✗ Katılmıyor"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Quick info + actions (2/5) */}
          <div className="lg:col-span-2 space-y-4">

            {/* Invitation Info Card */}
            <div className="relative rounded-3xl overflow-hidden" style={{
              background: `linear-gradient(135deg, ${renk}15 0%, ${renk}05 100%)`,
              border: `1px solid ${renk}25`,
            }}>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: renk + "99" }}>
                  Davetiye Bilgileri
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "🎭", label: "Şablon", value: sablon.isim },
                    { icon: "📅", label: "Tarih", value: tarihStr ?? "Belirtilmedi" },
                    { icon: "📍", label: "Mekan", value: davetiye.mekan ?? "Belirtilmedi" },
                    { icon: "🎵", label: "Müzik", value: davetiye.muzik ? "Açık" : "Kapalı" },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 bg-white/60">
                        {row.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5">
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Hızlı İşlemler</p>
              <div className="space-y-2">
                <Link
                  href={davetiyeUrl}
                  target="_blank"
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      👁️
                    </div>
                    <span className="text-sm font-medium text-gray-700">Önizle</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">↗</span>
                </Link>

                <Link
                  href={`/olustur?edit=${davetiye.slug}`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      ✏️
                    </div>
                    <span className="text-sm font-medium text-gray-700">Düzenle</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>

                <Link
                  href={`/dashboard/davetiye/${davetiye.slug}/davetliler`}
                  className="flex items-center justify-between w-full p-3.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      👥
                    </div>
                    <span className="text-sm font-medium text-gray-700">Davetliler</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-sm">→</span>
                </Link>
              </div>
            </div>

            {/* RSVP Summary donut-style */}
            {davetiye.rsvplar.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-5">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Katılım Özeti</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Katılıyor</span>
                      <span className="font-bold" style={{ color: renk }}>{katilimlar.length}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${katilimYuzde}%`, backgroundColor: renk }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500 font-medium">Katılmıyor</span>
                      <span className="font-bold text-red-400">{katilmayanlar.length}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-300"
                        style={{ width: `${100 - katilimYuzde}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Toplam misafir</span>
                    <span className="text-sm font-bold text-gray-900">{toplamKisi} kişi</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
