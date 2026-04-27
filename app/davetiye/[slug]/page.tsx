import { prisma } from "@/lib/prisma";
import { SABLONLAR } from "@/lib/sablonlar";
import { notFound } from "next/navigation";
import RsvpForm from "@/components/RsvpForm";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const davetiye = await prisma.davetiye.findUnique({ where: { slug } });
  if (!davetiye) return { title: "Davetiye Bulunamadı" };
  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";
  return {
    title: davetiye.baslik,
    description: `${davetiye.mekan ? davetiye.mekan + " • " : ""}${tarihStr}`,
    openGraph: { title: davetiye.baslik, type: "website" },
  };
}

export default async function DavetiyeSayfasi({ params }: Props) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!davetiye || !davetiye.aktif) notFound();

  await prisma.davetiye.update({
    where: { slug },
    data: { goruntulenme: { increment: 1 } },
  });

  const sablon = SABLONLAR.find((s) => s.id === davetiye.sablon) || SABLONLAR[0];

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const saatStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const whatsappMetin = encodeURIComponent(
    `${davetiye.baslik}\n${tarihStr ? tarihStr + "\n" : ""}${davetiye.mekan ? davetiye.mekan + "\n" : ""}Davetiye: ${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`
  );

  // Kategori bazlı tema
  const tema = getTema(davetiye.etkinlikTur, sablon.renk);

  return (
    <div className={`min-h-screen ${tema.bg}`}>
      {/* Üst dekoratif band */}
      <div className="h-2 w-full" style={{ backgroundColor: sablon.renk }} />

      <div className="max-w-md mx-auto px-4 py-10">

        {/* Hero Bölümü */}
        <div className="text-center mb-8">
          <div className="mb-5">
            <span className="text-5xl">{tema.emoji}</span>
          </div>

          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 opacity-70"
            style={{ color: sablon.renk }}
          >
            {tema.etiket}
          </p>

          <h1
            className="text-3xl font-bold leading-snug mb-4"
            style={{ color: sablon.yaziRengi }}
          >
            {davetiye.baslik}
          </h1>

          {davetiye.mesaj && (
            <p className="text-gray-500 text-sm italic leading-relaxed max-w-xs mx-auto">
              &ldquo;{davetiye.mesaj}&rdquo;
            </p>
          )}
        </div>

        {/* Ayraç */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sablon.renk }} />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Tarih & Mekan Kartları */}
        <div className="space-y-3 mb-6">
          {tarihStr && (
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${sablon.renk}18` }}
              >
                📅
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Tarih & Saat
                </p>
                <p className="font-semibold text-gray-800 text-sm">{tarihStr}</p>
                {saatStr && saatStr !== "00:00" && (
                  <p className="text-gray-500 text-sm">Saat {saatStr}</p>
                )}
              </div>
            </div>
          )}

          {davetiye.mekan && (
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${sablon.renk}18` }}
              >
                📍
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                  Mekan
                </p>
                <p className="font-semibold text-gray-800 text-sm truncate">{davetiye.mekan}</p>
                
                {/* DÜZELTİLEN KISIM: <a etiketi eksikti */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(davetiye.mekan)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium mt-0.5 inline-block"
                  style={{ color: sablon.renk }}
                >
                  Haritada Gör →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Geri Sayım */}
        {davetiye.tarih && new Date(davetiye.tarih) > new Date() && (
          <GeriSayim tarih={davetiye.tarih} renk={sablon.renk} />
        )}

        {/* RSVP */}
        <div className="mb-4">
          <RsvpForm davetiyeId={davetiye.id} renk={sablon.renk} />
        </div>

        {/* WhatsApp Paylaş */}
        {/* DÜZELTİLEN KISIM: <a etiketi eksikti */}
        <a
          href={`https://wa.me/?text=${whatsappMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-medium hover:bg-[#20BD5A] transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Davetiyeyi Paylaş
        </a>

        {/* Alt bilgi */}
        <p className="text-center text-xs text-gray-300">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            davetim.com
          </Link>{" "}
          ile oluşturuldu
        </p>
      </div>
    </div>
  );
}

// Geri sayım bileşeni (server-side hesaplama)
function GeriSayim({ tarih, renk }: { tarih: Date; renk: string }) {
  const simdi = new Date();
  const fark = new Date(tarih).getTime() - simdi.getTime();
  const gun = Math.floor(fark / (1000 * 60 * 60 * 24));
  const saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (gun < 0) return null;

  return (
    <div
      className="rounded-2xl p-5 mb-4 text-center"
      style={{ backgroundColor: `${renk}10`, border: `1px solid ${renk}25` }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-3 opacity-60" style={{ color: renk }}>
        Etkinliğe Kalan Süre
      </p>
      <div className="flex justify-center gap-4">
        <div>
          <p className="text-3xl font-bold" style={{ color: renk }}>{gun}</p>
          <p className="text-xs text-gray-400 mt-0.5">Gün</p>
        </div>
        <div className="text-2xl font-light text-gray-300 flex items-center">:</div>
        <div>
          <p className="text-3xl font-bold" style={{ color: renk }}>{saat}</p>
          <p className="text-xs text-gray-400 mt-0.5">Saat</p>
        </div>
      </div>
    </div>
  );
}

// Kategori bazlı tema
function getTema(etkinlikTur: string, renk: string) {
  const temalar: Record<string, { bg: string; emoji: string; etiket: string }> = {
    dugun: {
      bg: "bg-gradient-to-b from-rose-50 via-white to-white",
      emoji: "💍",
      etiket: "Düğün Davetiyesi",
    },
    nisan: {
      bg: "bg-gradient-to-b from-pink-50 via-white to-white",
      emoji: "💑",
      etiket: "Nişan Davetiyesi",
    },
    dogumgunu: {
      bg: "bg-gradient-to-b from-amber-50 via-white to-white",
      emoji: "🎂",
      etiket: "Doğum Günü Partisi",
    },
    sunnet: {
      bg: "bg-gradient-to-b from-blue-50 via-white to-white",
      emoji: "⭐",
      etiket: "Sünnet Töreni",
    },
    kina: {
      bg: "bg-gradient-to-b from-orange-50 via-white to-white",
      emoji: "🌿",
      etiket: "Kına Gecesi",
    },
    kurumsal: {
      bg: "bg-gradient-to-b from-slate-50 via-white to-white",
      emoji: "🎯",
      etiket: "Etkinlik Davetiyesi",
    },
    diger: {
      bg: "bg-gradient-to-b from-purple-50 via-white to-white",
      emoji: "🎉",
      etiket: "Davetiye",
    },
  };

  return temalar[etkinlikTur] ?? temalar.diger;
}