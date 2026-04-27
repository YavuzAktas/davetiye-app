export const PLAN_LIMITLER = {
  free: {
    isim: "Ücretsiz",
    davetiyeLimit: 1,
    davetliLimit: 50,
    ozellikler: ["Temel şablonlar", "RSVP takibi", "WhatsApp paylaşım"],
  },
  standart: {
    isim: "Standart",
    davetiyeLimit: 5,
    davetliLimit: 200,
    ozellikler: ["Tüm şablonlar", "RSVP takibi", "WhatsApp paylaşım", "QR kod", "Özel renk & font"],
  },
  premium: {
    isim: "Premium",
    davetiyeLimit: 999,
    davetliLimit: 999,
    ozellikler: ["Sınırsız davetiye", "Sınırsız davetli", "Müzik ekleme", "Detaylı analitik", "Öncelikli destek"],
  },
};

export type PlanTipi = keyof typeof PLAN_LIMITLER;