import { prisma } from "@/lib/prisma";
import { SABLONLAR } from "@/lib/sablonlar";
import { notFound } from "next/navigation";
import RsvpForm from "@/components/RsvpForm";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
  });

  if (!davetiye) {
    return { title: "Davetiye Bulunamadı" };
  }

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const aciklama = `${davetiye.mekan ? davetiye.mekan + " • " : ""}${tarihStr}`;

  return {
    title: davetiye.baslik,
    description: aciklama,
    openGraph: {
      title: davetiye.baslik,
      description: aciklama,
      type: "website",
    },
  };
}

export default async function DavetiyeSayfasi({ params }: Props) {
  const { slug } = await params;
  
  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!davetiye || !davetiye.aktif) {
    notFound();
  }

  await prisma.davetiye.update({
    where: { slug },
    data: { goruntulenme: { increment: 1 } },
  });

  const sablon =
    SABLONLAR.find((s) => s.id === davetiye.sablon) || SABLONLAR[0];

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const saatStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const etkinlikEmoji: Record<string, string> = {
    dugun: "💍",
    nisan: "💑",
    dogumgunu: "🎂",
    sunnet: "⭐",
    kina: "🌿",
    diger: "🎉",
  };

  const whatsappMetin = encodeURIComponent(
    `${davetiye.baslik} - Davetiyeyi görüntülemek için: ${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`
  );

  return (
    <div className={`min-h-screen bg-gradient-to-b ${sablon.arkaplan}`}>
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: sablon.renk }}
          >
            <span className="text-white text-2xl">
              {etkinlikEmoji[davetiye.etkinlikTur] ?? "🎉"}
            </span>
          </div>

          <p
            className="text-sm font-medium tracking-widest uppercase mb-4"
            style={{ color: sablon.renk }}
          >
            Davetiye
          </p>

          <h1
            className="text-3xl font-bold leading-tight mb-4"
            style={{ color: sablon.yaziRengi }}
          >
            {davetiye.baslik}
          </h1>

          <div
            className="w-16 h-0.5 mx-auto mb-6"
            style={{ backgroundColor: sablon.renk }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          {tarihStr && (
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${sablon.renk}15` }}
              >
                <span className="text-lg">📅</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Tarih ve Saat
                </p>
                <p className="font-semibold text-gray-800">{tarihStr}</p>
                {saatStr && saatStr !== "00:00" && (
                  <p className="text-gray-500 text-sm">Saat {saatStr}</p>
                )}
              </div>
            </div>
          )}

          {davetiye.mekan && (
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${sablon.renk}15` }}
              >
                <span className="text-lg">📍</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Mekan
                </p>
                <p className="font-semibold text-gray-800">{davetiye.mekan}</p>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    davetiye.mekan
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-1 inline-block"
                  style={{ color: sablon.renk }}
                >
                  Haritada Gör
                </a>
              </div>
            </div>
          )}

          {davetiye.mesaj && (
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${sablon.renk}15` }}
              >
                <span className="text-lg">💌</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Mesaj
                </p>
                <p className="text-gray-600 leading-relaxed italic">
                  &quot;{davetiye.mesaj}&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
  <RsvpForm davetiyeId={davetiye.id} renk={sablon.renk} />
</div>

        <a
          href={`https://wa.me/?text=${whatsappMetin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-xl font-medium hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp ile Paylaş
        </a>

        <p className="text-center text-xs text-gray-300 mt-6">
          davetim.com ile oluşturuldu
        </p>
      </div>
    </div>
  );
}