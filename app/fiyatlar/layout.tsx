import type { Metadata } from "next";

const SITE_URL = "https://davetiye-app.vercel.app";

export const metadata: Metadata = {
  title: "Fiyatlar ve Planlar",
  description:
    "Bekleriz ücretsiz, Standart (₺299) ve Premium (₺599) planlarını karşılaştır. Tek seferlik ödeme, abonelik yok. Dijital davetiye oluşturmak için en uygun fiyat.",
  keywords: [
    "online davetiye fiyat", "dijital davetiye plan", "davetiye ücretsiz",
    "düğün davetiyesi fiyat", "nişan davetiyesi online ücret",
  ],
  alternates: { canonical: "/fiyatlar" },
  openGraph: {
    title: "Fiyatlar ve Planlar | Bekleriz",
    description: "Ücretsiz başla, ihtiyacına göre yükselt. Tek seferlik ödeme, abonelik yok.",
    url: `${SITE_URL}/fiyatlar`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Ücretsiz plan ne kadar süre kullanılabilir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ücretsiz plan süresiz kullanılabilir. Daha fazla özellik için istediğiniz zaman yükseltebilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Ödeme güvenli mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tüm ödemeler iyzico altyapısıyla SSL şifreli bağlantı üzerinden işlenir. Kart bilgileriniz güvende.",
      },
    },
    {
      "@type": "Question",
      name: "İptal edebilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tek seferlik ödeme olduğu için abonelik veya otomatik yenileme yoktur. Dijital hizmet satın alma anında başladığından cayma hakkı uygulanmaz.",
      },
    },
    {
      "@type": "Question",
      name: "Fatura alabilir miyim?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ödeme belgesi için destek@bekleriz.com adresine e-posta atmanız yeterlidir; en geç 2 iş günü içinde iletilir.",
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
