import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Davetiye Şablonları | Online ve Dijital Davetiye Tasarımları",
  description:
    "Düğün, nişan, doğum günü, kına ve özel etkinlikler için online davetiye şablonları. Dijital davetiyeni seç, özelleştir, WhatsApp ile paylaş.",
  keywords: [
    "davetiye şablonu", "düğün davetiyesi şablonu", "nişan davetiyesi tasarımı",
    "doğum günü davetiyesi", "dijital davetiye şablon", "kına davetiyesi",
    "online davetiye hazır şablon", "ücretsiz davetiye şablonu",
  ],
  alternates: { canonical: "/sablonlar" },
  openGraph: {
    title: "Davetiye Şablonları | Online ve Dijital Tasarımlar",
    description: "Düğün, nişan, doğum günü ve özel etkinlikler için hazır dijital davetiye şablonları.",
    url: `${SITE_URL}/sablonlar`,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

export default function SablonlarLayout({ children }: { children: React.ReactNode }) {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Davetiye Şablonları",
    url: `${SITE_URL}/sablonlar`,
    description: "Düğün, nişan, doğum günü, kına ve özel etkinlikler için online davetiye şablonları.",
    isPartOf: {
      "@type": "WebSite",
      name: "Bekleriz",
      url: SITE_URL,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Davetiye şablonu nasıl seçilir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Etkinlik türüne, davet tonuna ve ihtiyaç duyduğunuz özelliklere göre düğün, nişan, doğum günü veya diğer kategorilerden şablon seçebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Dijital davetiye şablonları WhatsApp ile paylaşılır mı?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet. Bekleriz'de oluşturulan dijital davetiye şablonları link olarak paylaşılır ve WhatsApp üzerinden gönderilebilir.",
        },
      },
      {
        "@type": "Question",
        name: "Online davetiye şablonları sonradan düzenlenebilir mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Evet. Davetiye bilgilerinizi panelden güncelleyebilir, aynı davetiye linkini kullanmaya devam edebilirsiniz.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
