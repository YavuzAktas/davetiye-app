import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://davetiye-app.vercel.app";

  return [
    { url: baseUrl,                            lastModified: new Date(), changeFrequency: "weekly",  priority: 1    },
    { url: `${baseUrl}/sablonlar`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8  },
    { url: `${baseUrl}/fiyatlar`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.7  },
    { url: `${baseUrl}/kvkk`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.4  },
    { url: `${baseUrl}/gizlilik`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.4  },
    { url: `${baseUrl}/kullanim-sartlari`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.4  },
    { url: `${baseUrl}/iletisim`,              lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3  },
  ];
}
