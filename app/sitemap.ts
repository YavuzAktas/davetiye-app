import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${baseUrl}/dijital-davetiye`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/online-davetiye`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/dugun-davetiyesi`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/nisan-davetiyesi`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sablonlar`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/blog`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/fiyatlar`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...blogPosts,
    { url: `${baseUrl}/kvkk`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/gizlilik`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/kullanim-sartlari`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/iletisim`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
