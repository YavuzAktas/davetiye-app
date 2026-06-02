import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const SITE_URL = getSiteUrl();

const PAKETLER = [
  {
    ad: "Dijital Davetiye Teslimi",
    aciklama: "Müşteriye özel davetiye linki, WhatsApp paylaşımı ve RSVP takibi.",
    maddeler: ["Dijital davetiye", "WhatsApp paylaşım linki", "RSVP takip paneli", "Genel QR kod"],
  },
  {
    ad: "Salon Operasyon Paketi",
    aciklama: "Etkinlik günü giriş, masa ve salon ekranı akışını düzenleyen QR araçları.",
    maddeler: ["QR check-in", "Masa ve pano QR kiti", "Personel giriş ekranı", "Davetli durum takibi"],
  },
  {
    ad: "Anı & Sosyal İçerik Paketi",
    aciklama: "Misafirlerden fotoğraf, yazılı anı ve sesli anı toplama deneyimi.",
    maddeler: ["Fotoğraf albümü", "Canlı duvar", "Anı defteri", "Etkinlik sonrası anı arşivi"],
  },
] as const;

const SUREC = [
  ["1", "Paket belirlenir", "Firma, etkinliğiniz için uygun dijital hizmet kapsamını seçer."],
  ["2", "Aktivasyon linki gelir", "Size özel bağlantıyla DavetRota hesabınızda davetiyenizi hazırlarsınız."],
  ["3", "Davet ve QR akışı başlar", "Davetiye, LCV/RSVP, QR ve anı araçları tek panelden yönetilir."],
] as const;

function temizTelefon(telefon: string | null) {
  if (!telefon) return null;
  const temiz = telefon.replace(/[^\d+]/g, "");
  if (!temiz) return null;
  if (temiz.startsWith("+")) return temiz;
  if (temiz.startsWith("90")) return `+${temiz}`;
  if (temiz.startsWith("0")) return `+9${temiz}`;
  return temiz;
}

function whatsappLink(telefon: string | null, firmaAdi: string) {
  const temiz = temizTelefon(telefon);
  if (!temiz) return null;
  const numara = temiz.replace(/[^\d]/g, "");
  const mesaj = `Merhaba, ${firmaAdi} dijital davetiye ve QR hizmet paketleri hakkında bilgi almak istiyorum.`;
  return `https://wa.me/${numara}?text=${encodeURIComponent(mesaj)}`;
}

function renkGecerliMi(renk: string | null) {
  return /^#[0-9a-f]{6}$/i.test(renk ?? "");
}

async function partnerGetir(id: string) {
  return prisma.partner.findFirst({
    where: { id, durum: "aktif" },
    select: {
      id: true,
      firmaAdi: true,
      logoUrl: true,
      markaRenk: true,
      markaSlogani: true,
      destekTelefonu: true,
      instagramUrl: true,
      createdAt: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const partner = await partnerGetir(id);
  if (!partner) return { title: "Partner Bulunamadı", robots: { index: false, follow: false } };

  const title = `${partner.firmaAdi} Dijital Davetiye ve QR Hizmetleri`;
  const description = `${partner.firmaAdi} tarafından sunulan dijital davetiye, LCV/RSVP, QR check-in ve anı toplama hizmetlerini inceleyin.`;

  return {
    title,
    description,
    alternates: { canonical: `/partner/portal/${partner.id}` },
    openGraph: {
      title: `${title} | DavetRota`,
      description,
      url: `${SITE_URL}/partner/portal/${partner.id}`,
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PartnerPortalPage({ params }: PageProps) {
  const { id } = await params;
  const partner = await partnerGetir(id);
  if (!partner) notFound();

  const renk = renkGecerliMi(partner.markaRenk) ? partner.markaRenk! : "#7c3aed";
  const whatsapp = whatsappLink(partner.destekTelefonu, partner.firmaAdi);
  const portalUrl = `${SITE_URL}/partner/portal/${partner.id}`;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: partner.firmaAdi,
    url: portalUrl,
    logo: partner.logoUrl ?? `${SITE_URL}/opengraph-image`,
    sameAs: partner.instagramUrl ? [partner.instagramUrl] : undefined,
    telephone: partner.destekTelefonu ?? undefined,
    description: partner.markaSlogani ?? "Dijital davetiye, QR check-in ve etkinlik günü anı deneyimleri.",
    serviceType: "Dijital davetiye ve etkinlik operasyon hizmetleri",
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />

      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 20% 20%, ${renk} 0%, transparent 38%), radial-gradient(circle at 80% 70%, #db2777 0%, transparent 35%)` }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <Link href="/" className="mb-10 inline-flex text-xs font-bold text-white/50 transition-colors hover:text-white">
            DavetRota
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-6 flex items-center gap-4">
                {partner.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logoUrl}
                    alt={`${partner.firmaAdi} logosu`}
                    className="h-16 w-16 rounded-3xl border border-white/10 bg-white object-contain p-2 shadow-lg"
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-lg"
                    style={{ backgroundColor: renk }}
                  >
                    {partner.firmaAdi.slice(0, 1).toLocaleUpperCase("tr-TR")}
                  </div>
                )}
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/45">DavetRota Partneri</p>
                  <h1 className="mt-1 text-3xl font-black leading-tight sm:text-5xl">{partner.firmaAdi}</h1>
                </div>
              </div>

              <p className="max-w-2xl text-lg font-semibold leading-relaxed text-white/70">
                {partner.markaSlogani || "Dijital davetiye, QR giriş ve etkinlik günü anı deneyimlerini müşterilerine tek akışta sunar."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-6 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
                  >
                    WhatsApp ile Bilgi Al
                  </a>
                )}
                {partner.instagramUrl && (
                  <a
                    href={partner.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-white/15"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Müşteri avantajı</p>
              <div className="mt-4 space-y-3">
                {[
                  "Uygulama indirmeden açılan davetiye linki",
                  "LCV/RSVP yanıtlarını tek panelde takip",
                  "QR check-in ve masa/pano QR çıktıları",
                  "Fotoğraf, yazılı anı ve canlı duvar deneyimi",
                ].map(madde => (
                  <div key={madde} className="flex gap-3 rounded-2xl bg-white/8 p-3 text-sm font-semibold text-white/75">
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: renk }} />
                    {madde}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6">
        <BilgiKarti baslik="Dijital hizmet" deger="Davetiye + QR" />
        <BilgiKarti baslik="Teslim akışı" deger="Aktivasyon linki" />
        <BilgiKarti baslik="DavetRota durumu" deger="Onaylı partner" />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Hizmet paketleri</p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">Etkinliğiniz için sunulabilecek dijital deneyimler</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            Paket kapsamı ve fiyatlandırma partner firma tarafından belirlenir. Davetli listesi, RSVP yanıtları ve anı içerikleri müşterinin kendi DavetRota hesabında yönetilir.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PAKETLER.map(paket => (
            <article key={paket.ad} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: renk }} />
              <h3 className="mt-4 text-lg font-black text-gray-950">{paket.ad}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{paket.aciklama}</p>
              <div className="mt-4 space-y-2">
                {paket.maddeler.map(madde => (
                  <p key={madde} className="text-xs font-bold leading-relaxed text-gray-600">
                    ✓ {madde}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Nasıl çalışır?</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">Müşteri kendi hesabında yönetir</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Partner firma dijital hizmeti sunar; davetli ve anı verileri müşterinin kendi hesabında kalır. Bu yapı kişisel veri minimizasyonu için özellikle korunur.
              </p>
            </div>
            <div className="grid gap-3">
              {SUREC.map(([no, baslik, aciklama]) => (
                <div key={no} className="flex gap-3 rounded-2xl bg-gray-50 p-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                    style={{ backgroundColor: renk }}
                  >
                    {no}
                  </span>
                  <div>
                    <p className="text-sm font-black text-gray-950">{baslik}</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-purple-100 bg-purple-50 p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-xl font-black text-purple-950">Bu dijital hizmeti etkinliğinizde kullanmak ister misiniz?</h2>
              <p className="mt-2 text-sm leading-relaxed text-purple-800/70">
                {partner.firmaAdi} ile iletişime geçerek davetiye, QR ve anı paketi kapsamını netleştirebilirsiniz.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-purple-700 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-purple-800"
                >
                  WhatsApp ile Yaz
                </a>
              )}
              <Link
                href="/partner"
                className="inline-flex items-center justify-center rounded-2xl border border-purple-200 bg-white px-5 py-3 text-sm font-black text-purple-700 transition-colors hover:bg-purple-100"
              >
                Partner Programı
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BilgiKarti({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">{baslik}</p>
      <p className="mt-2 text-lg font-black text-gray-950">{deger}</p>
    </div>
  );
}
