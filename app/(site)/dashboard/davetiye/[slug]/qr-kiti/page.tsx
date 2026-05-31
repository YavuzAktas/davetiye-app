import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import QRKitiAksiyonlari from "./QRKitiAksiyonlari";

interface Props {
  params: Promise<{ slug: string }>;
}

type QrKart = {
  baslik: string;
  etiket: string;
  aciklama: string;
  url: string;
  dosyaAdi: string;
  vurgu: string;
};

function qrSrc(url: string) {
  return `/api/qr?url=${encodeURIComponent(url)}`;
}

function panelParametresi(davetiye: {
  albumAktif: boolean;
  canliDuvarAktif: boolean;
  aniDefteriAktif: boolean;
  sesliAniAktif: boolean;
}) {
  if (davetiye.albumAktif || davetiye.canliDuvarAktif) return "foto";
  if (davetiye.aniDefteriAktif) return "ani";
  if (davetiye.sesliAniAktif) return "sesli";
  return null;
}

export default async function QRKitiPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: {
      id: true,
      slug: true,
      baslik: true,
      tarih: true,
      mekan: true,
      odemeDurumu: true,
      albumAktif: true,
      aniDefteriAktif: true,
      sesliAniAktif: true,
      canliDuvarAktif: true,
      checkInAktif: true,
      oturmaPlanAktif: true,
      _count: { select: { davetliler: true } },
    },
  });

  if (!davetiye) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "";
  const davetiyeUrl = `${baseUrl}/davetiye/${davetiye.slug}`;
  const canliDuvarUrl = `${baseUrl}/davetiye/${davetiye.slug}/canli-duvar`;
  const albumAktif = davetiyeOzelligiAktif(davetiye, "album");
  const aniDefteriAktif = davetiyeOzelligiAktif(davetiye, "aniDefteri");
  const sesliAniAktif = davetiyeOzelligiAktif(davetiye, "sesliAni");
  const canliDuvarAktif = davetiyeOzelligiAktif(davetiye, "canliDuvar");
  const checkInAktif = davetiyeOzelligiAktif(davetiye, "checkIn");
  const oturmaPlanAktif = davetiyeOzelligiAktif(davetiye, "oturmaPlan");
  const medyaPanel = panelParametresi({
    albumAktif,
    aniDefteriAktif,
    sesliAniAktif,
    canliDuvarAktif,
  });
  const medyaUrl = medyaPanel ? `${davetiyeUrl}?panel=${medyaPanel}` : null;
  const tarih = davetiye.tarih
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(davetiye.tarih))
    : null;

  const kartlar: QrKart[] = [
    {
      baslik: "Davetiyeyi Aç",
      etiket: "Giriş / Masa Panosu",
      aciklama: "Misafirler davetiye detaylarını ve RSVP alanını buradan açar.",
      url: davetiyeUrl,
      dosyaAdi: `davetiye-qr-${davetiye.slug}.png`,
      vurgu: "from-purple-600 to-pink-600",
    },
  ];

  if (medyaUrl) {
    kartlar.push({
      baslik: "Fotoğraf & Anı Yükle",
      etiket: "Masa Kartı",
      aciklama: "Misafirler fotoğraf, yazılı anı veya sesli anı gönderebilir.",
      url: medyaUrl,
      dosyaAdi: `ani-yukleme-qr-${davetiye.slug}.png`,
      vurgu: "from-emerald-600 to-teal-500",
    });
  }

  if (canliDuvarAktif) {
    kartlar.push({
      baslik: "Canlı Duvarı Aç",
      etiket: "Salon TV",
      aciklama: "Salondaki ekranda onaylanan fotoğrafları canlı gösterir.",
      url: canliDuvarUrl,
      dosyaAdi: `canli-duvar-qr-${davetiye.slug}.png`,
      vurgu: "from-gray-900 to-purple-900",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:break-inside-avoid { break-inside: avoid !important; }
          .print\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/dashboard/davetiye/${slug}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Davetiyeye dön"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-gray-400">{davetiye.baslik}</p>
            <h1 className="text-base font-black text-gray-900">Etkinlik Günü QR Kiti</h1>
          </div>
          <QRKitiAksiyonlari />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 print:p-0">
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm print:shadow-none print:border-gray-200">
          <div className="bg-linear-to-br from-gray-950 via-purple-950 to-gray-950 px-5 py-7 text-white sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200/80">
              Baskıya Hazır Salon Kiti
            </p>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{davetiye.baslik}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                  Masa kartı, giriş panosu ve salon ekranı için kullanılacak QR materyalleri tek sayfada.
                  Çıktı alıp organizasyon ekibine verebilirsiniz.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                {tarih && <p><strong>Tarih:</strong> {tarih}</p>}
                {davetiye.mekan && <p className="mt-1"><strong>Mekan:</strong> {davetiye.mekan}</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-b border-gray-100 p-5 sm:grid-cols-3 sm:p-6">
            <div className="rounded-2xl bg-gray-50 px-4 py-4">
              <p className="text-2xl font-black tabular-nums">{kartlar.length}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500">Baskı kartı</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-4">
              <p className="text-2xl font-black tabular-nums">{davetiye._count.davetliler}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500">Davetli kaydı</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-4 py-4">
              <p className="text-2xl font-black">{checkInAktif ? "Aktif" : "Kapalı"}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500">QR check-in</p>
            </div>
          </div>

          <div id="qr-kartlari" className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2 print:grid-cols-2">
            {kartlar.map(kart => (
              <article
                key={kart.baslik}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm print:break-inside-avoid print:shadow-none print:border-gray-200"
              >
                <div className={`bg-linear-to-r ${kart.vurgu} px-5 py-5 text-white`}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">{kart.etiket}</p>
                  <h3 className="mt-1 text-2xl font-black">{kart.baslik}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{kart.aciklama}</p>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-[180px_1fr] sm:items-center">
                  <div className="mx-auto rounded-3xl border border-gray-100 bg-white p-3 shadow-sm sm:mx-0">
                    <img
                      src={qrSrc(kart.url)}
                      alt={`${kart.baslik} QR kodu`}
                      className="h-40 w-40 rounded-2xl"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">Kısa Talimat</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      QR kodu okutun, açılan sayfadaki yönergeleri takip edin.
                    </p>
                    <p className="mt-3 truncate rounded-xl bg-gray-50 px-3 py-2 font-mono text-[11px] text-gray-500">
                      {kart.url}
                    </p>
                    <a
                      href={qrSrc(kart.url)}
                      download={kart.dosyaAdi}
                      className="mt-3 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-gray-800 print:hidden"
                    >
                      QR PNG İndir
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4">
                <p className="text-sm font-black text-gray-900">Giriş Ekibi</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {checkInAktif
                    ? "Davetli QR'larını okutmak için check-in ekranını sadece yetkili hesapta açık tutun."
                    : "QR check-in kapalı. Girişte genel davetiye QR'ı kullanılabilir."}
                </p>
                {checkInAktif && (
                  <Link
                    href={`/dashboard/davetiye/${slug}/check-in`}
                    className="mt-3 inline-flex text-xs font-bold text-emerald-700 print:hidden"
                  >
                    Check-in ekranını aç →
                  </Link>
                )}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4">
                <p className="text-sm font-black text-gray-900">Masa Yerleşimi</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {oturmaPlanAktif
                    ? "Masa atamalarını etkinlikten önce son kez kontrol edin."
                    : "Oturma planı kapalı. QR kit yalnızca paylaşım materyali olarak kullanılabilir."}
                </p>
                {oturmaPlanAktif && (
                  <Link
                    href={`/dashboard/davetiye/${slug}/oturma-plani`}
                    className="mt-3 inline-flex text-xs font-bold text-purple-700 print:hidden"
                  >
                    Oturma planını aç →
                  </Link>
                )}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4">
                <p className="text-sm font-black text-gray-900">Gizlilik</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Bu kit kişisel davetli verisi içermez. Kişiye özel QR'lar davetliler sayfasından ayrı yönetilir.
                </p>
                <Link
                  href={`/dashboard/davetiye/${slug}/davetliler`}
                  className="mt-3 inline-flex text-xs font-bold text-gray-700 print:hidden"
                >
                  Davetli linklerini aç →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
