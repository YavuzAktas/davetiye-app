import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Dijital Davetiye Fiyatları",
  description:
    "Bekleriz davetiye bazlı fiyatlandırma: temel dijital davetiye ve seçtiğiniz ek özellikler için tek seferlik ödeme. Plan, abonelik ve otomatik yenileme yok.",
  keywords: [
    "online davetiye fiyat", "dijital davetiye fiyat", "davetiye ücreti",
    "düğün davetiyesi fiyat", "nişan davetiyesi online ücret",
  ],
  alternates: { canonical: "/fiyatlar" },
  openGraph: {
    title: "Dijital Davetiye Fiyatları | Bekleriz",
    description: "Davetiye bazlı ödeme: seçtiğiniz özelliklere göre toplam tutarı canlı görün.",
    url: `${SITE_URL}/fiyatlar`,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Bekleriz abonelik mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayır. Bekleriz'de abonelik veya otomatik yenileme yoktur; her davetiye için seçilen özelliklere göre tek seferlik ödeme alınır.",
      },
    },
    {
      "@type": "Question",
      name: "Ödeme güvenli mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tüm ödemeler iyzico altyapısıyla SSL şifreli bağlantı üzerinden işlenir. Kart bilgileriniz tarafımızca saklanmaz.",
      },
    },
    {
      "@type": "Question",
      name: "İptal edebilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dijital hizmet ödeme sonrası başlatılır; ödeme öncesinde cayma hakkı istisnası ayrıca onaylanır. Hizmetin hiç kullanılmadığı durumlarda destek üzerinden iade değerlendirmesi isteyebilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Fatura alabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ödeme belgesi veya fatura talebi için destek@bekleriz.com adresine yazabilirsiniz. Talebiniz kayıt bilgileriniz ve yürürlükteki mevzuata göre değerlendirilir.",
      },
    },
  ],
};

export default function FiyatlarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
