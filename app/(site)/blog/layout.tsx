import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "Davetiye Blogu | Online ve Dijital Davetiye Rehberleri",
  description:
    "Online davetiye hazırlama, dijital davetiye fiyatları, WhatsApp davetiye gönderimi ve düğün davetiye sözleri için pratik rehberler.",
  keywords: [
    "davetiye blog", "online davetiye rehberi", "dijital davetiye nasıl yapılır",
    "whatsapp davetiye", "düğün davetiye sözleri", "davetiye ipuçları",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Davetiye Blogu | Online ve Dijital Davetiye Rehberleri",
    description: "Online davetiye hazırlama, WhatsApp davetiye gönderimi ve davetiye sözleri için pratik rehberler.",
    url: `${SITE_URL}/blog`,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "DavetRota Davetiye Blogu",
    url: `${SITE_URL}/blog`,
    description: "Online davetiye, dijital davetiye, WhatsApp davetiye ve düğün davetiyesi rehberleri.",
    publisher: {
      "@type": "Organization",
      name: "DavetRota",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {children}
    </>
  );
}
