import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";
import { SABLONLAR } from "@/lib/sablonlar";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const sablonSayfalari: MetadataRoute.Sitemap = SABLONLAR.map(sablon => ({
    url: `${baseUrl}/sablonlar/${sablon.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: sablon.kategori === "dugun" || sablon.kategori === "nisan" ? 0.72 : 0.6,
  }));

  return [
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${baseUrl}/dijital-davetiye`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/online-davetiye`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/whatsapp-davetiye`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ucretsiz-davetiye`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/dugun-davetiyesi`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/nisan-davetiyesi`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sablonlar`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    ...sablonSayfalari,
    { url: `${baseUrl}/blog`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/fiyatlar`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/partner`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/partner/basvuru`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.55 },
    ...blogPosts,
    { url: `${baseUrl}/kvkk`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/gizlilik`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/kullanim-sartlari`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/on-bilgilendirme`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.35 },
    { url: `${baseUrl}/mesafeli-satis-sozlesmesi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.35 },
    { url: `${baseUrl}/iletisim`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
