import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DAVETIYE_FIYAT_KALEMLERI, tutarMetni } from "@/lib/davetiye-fiyatlandirma";
import { getSiteUrl } from "@/lib/site-url";
import { SABLONLAR } from "@/lib/sablonlar";
import { PREMIUM, SABLON_ETIKETLER } from "@/lib/sablon-meta";

const SITE_URL = getSiteUrl();

const KATEGORI_ADI: Record<string, string> = {
  dugun: "düğün",
  nisan: "nişan",
  dogumgunu: "doğum günü",
  sunnet: "sünnet",
  kina: "kına",
  kurumsal: "kurumsal etkinlik",
  diger: "özel etkinlik",
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

function sablonBul(id: string) {
  return SABLONLAR.find(sablon => sablon.id === id) ?? null;
}

function sablonAnahtarKelimeleri(sablon: NonNullable<ReturnType<typeof sablonBul>>) {
  const kategori = KATEGORI_ADI[sablon.kategori] ?? "davetiye";
  const etiketler = SABLON_ETIKETLER[sablon.id] ?? [];

  return [
    `${sablon.isim.toLocaleLowerCase("tr-TR")} davetiye`,
    `${sablon.isim.toLocaleLowerCase("tr-TR")} davetiyesi`,
    `${sablon.isim.toLocaleLowerCase("tr-TR")} davetiye şablonu`,
    `${kategori} davetiyesi şablonu`,
    `dijital ${kategori} davetiyesi`,
    `online ${kategori} davetiyesi`,
    ...etiketler.map(etiket => `${etiket.toLocaleLowerCase("tr-TR")} ${kategori} davetiyesi`),
    "online davetiye şablonu",
    "whatsapp davetiye",
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sablon = sablonBul(id);
  if (!sablon) return { title: "Şablon Bulunamadı", robots: { index: false, follow: false } };

  const kategori = KATEGORI_ADI[sablon.kategori] ?? "davetiye";
  const premium = PREMIUM.has(sablon.id);
  const title = `${sablon.isim} Davetiye Şablonu`;
  const description = `${sablon.isim} ${kategori} davetiyesi şablonunu online önizleyin. WhatsApp ile paylaşılabilir dijital davetiye, RSVP takip, konum, müzik ve yönetim paneliyle hazırlanır.`;
  const url = `${SITE_URL}/sablonlar/${sablon.id}`;

  return {
    title,
    description,
    keywords: sablonAnahtarKelimeleri(sablon),
    alternates: { canonical: `/sablonlar/${sablon.id}` },
    openGraph: {
      title: `${sablon.isim} Dijital Davetiye Şablonu | Bekleriz`,
      description,
      url,
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${sablon.isim} Davetiye Şablonu | Bekleriz`,
      description,
    },
    robots: { index: true, follow: true },
    other: premium ? { "bekleriz:sablon-tier": "premium" } : undefined,
  };
}

export default async function SablonDetayLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const sablon = sablonBul(id);
  if (!sablon) notFound();

  const kategori = KATEGORI_ADI[sablon.kategori] ?? "davetiye";
  const premium = PREMIUM.has(sablon.id);
  const url = `${SITE_URL}/sablonlar/${sablon.id}`;
  const description = `${sablon.isim} ${kategori} davetiyesi şablonu; online önizleme, WhatsApp paylaşımı, RSVP takip, konum ve yönetim paneliyle kullanılabilir.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Davetiye Şablonları", item: `${SITE_URL}/sablonlar` },
      { "@type": "ListItem", position: 3, name: sablon.isim, item: url },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${sablon.isim} Davetiye Şablonu`,
    description,
    category: `${kategori} davetiye şablonu`,
    brand: { "@type": "Brand", name: "Bekleriz" },
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: premium ? DAVETIYE_FIYAT_KALEMLERI.temel.tutar + DAVETIYE_FIYAT_KALEMLERI.luksSablon.tutar : DAVETIYE_FIYAT_KALEMLERI.temel.tutar,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Davet tipi", value: kategori },
      { "@type": "PropertyValue", name: "Teslimat", value: "Dijital link" },
      { "@type": "PropertyValue", name: "Başlangıç fiyatı", value: tutarMetni(DAVETIYE_FIYAT_KALEMLERI.temel.tutar) },
      ...(premium ? [{ "@type": "PropertyValue", name: "Lüks şablon ek ücreti", value: tutarMetni(DAVETIYE_FIYAT_KALEMLERI.luksSablon.tutar) }] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      {children}
    </>
  );
}
