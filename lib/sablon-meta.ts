export const DEMO_URLS: Record<string, string> = {
  "nisan-luks":      "/davetiye/ornek-nisan",
  "dugun-luks":      "/davetiye/ornek-dugun",
  "dogumgunu-luks":  "/davetiye/ornek-dogumgunu",
  "vintage-nisan":   "/davetiye/ornek-vintage-nisan",
};

export const PREMIUM = new Set(["nisan-luks", "dugun-luks", "dogumgunu-luks", "vintage-nisan"]);

export const KAT_EMOJI: Record<string, string> = {
  dugun: "💍", nisan: "💌", dogumgunu: "🎂", sunnet: "⭐", kina: "🕯️", kurumsal: "💼", diger: "🎉",
};

export const SABLON_ETIKETLER: Record<string, string[]> = {
  "vintage-nisan":       ["Lüks", "Romantik"],
  "nisan-luks":          ["Lüks", "En Çok Seçilen"],
  "dugun-luks":          ["Lüks", "Minimal"],
  "dogumgunu-luks":      ["Lüks"],
  "klasik-dugun":        ["En Çok Seçilen", "Minimal"],
  "romantik-dugun":      ["Romantik", "En Çok Seçilen"],
  "altin-dugun":         ["Lüks"],
  "modern-dugun":        ["Minimal"],
  "bahar-dugun":         ["Romantik"],
  "mavi-dugun":          ["Minimal"],
  "gul-dugun":           ["Romantik"],
  "modern-nisan":        ["Minimal"],
  "romantik-nisan":      ["Romantik"],
  "altin-nisan":         ["Lüks"],
  "mor-nisan":           ["Minimal"],
  "eglenceli-dogumgunu": ["Eğlenceli", "En Çok Seçilen"],
  "sade-dogumgunu":      ["Minimal"],
  "cocuk-dogumgunu":     ["Eğlenceli"],
  "pembe-dogumgunu":     ["Romantik"],
  "mavi-dogumgunu":      ["Minimal"],
  "altin-dogumgunu":     ["Lüks"],
  "geleneksel-sunnet":   ["En Çok Seçilen"],
  "modern-sunnet":       ["Minimal"],
  "altin-sunnet":        ["Lüks"],
  "yildiz-sunnet":       ["Eğlenceli"],
  "geleneksel-kina":     ["En Çok Seçilen", "Romantik"],
  "modern-kina":         ["Minimal"],
  "altin-kina":          ["Lüks"],
  "kurumsal-toplanti":   ["Minimal", "En Çok Seçilen"],
  "kurumsal-etkinlik":   ["Minimal"],
  "kurumsal-kutlama":    ["Lüks"],
  "mezuniyet":           ["En Çok Seçilen"],
  "yildonumu":           ["Romantik"],
  "bebek-partisi":       ["Eğlenceli"],
};

export const ETIKET_STILI: Record<string, { bg: string; color: string; border: string }> = {
  "En Çok Seçilen": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  "Lüks":           { bg: "#faf5ff", color: "#9333ea", border: "#e9d5ff" },
  "Minimal":        { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Romantik":       { bg: "#fdf2f8", color: "#db2777", border: "#fbcfe8" },
  "Eğlenceli":      { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

export const PREMIUM_OZELLIKLER: Record<string, { icon: string; baslik: string; aciklama: string }[]> = {
  "vintage-nisan": [
    { icon: "🌿", baslik: "Botanik Mum Mühürü",   aciklama: "Dokunulunca açılan mum mühürlü kapak animasyonu" },
    { icon: "🎬", baslik: "Video Açılış Sahnesi", aciklama: "Mühür açılışına eşlik eden video; isimleri overlay'de sunar" },
    { icon: "🎵", baslik: "Arka Plan Müziği",      aciklama: "Video bitiminde otomatik başlayan altın müzik çalar" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",      aciklama: "Nişana kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",   aciklama: "Google Maps bağlantılı mekan kartı" },
    { icon: "📷", baslik: "Polaroid Galeri",       aciklama: "3 fotoğraf vintage polaroid çerçevesinde sergilenir" },
    { icon: "👗", baslik: "Dress Code Bölümü",     aciklama: "Renk paletiyle kıyafet kodu sahnesi" },
    { icon: "✅", baslik: "RSVP + Şarkı Dileği",  aciklama: "Katılım bildirimi ve müzik isteği formu" },
  ],
  "nisan-luks": [
    { icon: "🌹", baslik: "Gül Mühürlü Kapak",    aciklama: "Dokunulunca açılan zarif kapak animasyonu" },
    { icon: "💛", baslik: "Altın & Bordo Tema",    aciklama: "El işi özel renk paleti ve tipografi" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",      aciklama: "Nişana kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",   aciklama: "Google Maps bağlantılı mekan kartı" },
    { icon: "📷", baslik: "Polaroid Galeri",       aciklama: "Fotoğraflar vintage polaroid tarzında" },
    { icon: "✅", baslik: "RSVP + Şarkı Dileği",  aciklama: "Kişi sayısı, katılım ve müzik isteği" },
  ],
  "dugun-luks": [
    { icon: "💍", baslik: "Yüzük Mühürlü Kapak",  aciklama: "Yüzük ikonlu özel açılış animasyonu" },
    { icon: "✨", baslik: "Lacivert & Altın Tema", aciklama: "Elmas köşeli çerçeve, ince altın detaylar" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",      aciklama: "Düğüne kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",   aciklama: "Google Maps bağlantılı mekan kartı" },
  ],
  "dogumgunu-luks": [
    { icon: "🎂", baslik: "Pasta Mühürlü Kapak",  aciklama: "Pasta ikonlu dokunmatik açılış animasyonu" },
    { icon: "⭐", baslik: "Mor & Altın Tema",      aciklama: "Yıldız köşeli çerçeve, doğum günü atmosferi" },
    { icon: "⏱️", baslik: "Canlı Geri Sayım",      aciklama: "Partiye kalan süreyi saniye saniye gösterir" },
    { icon: "📍", baslik: "Harita Entegrasyonu",   aciklama: "Google Maps bağlantılı mekan kartı" },
  ],
};

export const STD_OZELLIK_LISTESI = [
  { ikon: "✅", baslik: "RSVP Katılım Bildirimi",  aciklama: "Misafirler kaç kişiyle geleceklerini kolayca bildirir" },
  { ikon: "📍", baslik: "Konum & Google Harita",   aciklama: "Tıklanabilir harita ile konumu anında gösterin" },
  { ikon: "⏱️", baslik: "Canlı Geri Sayım",         aciklama: "Etkinliğe kalan süreyi saniye saniye sayar" },
  { ikon: "🎵", baslik: "Arka Plan Müziği",          aciklama: "Davetiyeye otomatik çalan müzik ekleyin" },
  { ikon: "📱", baslik: "WhatsApp ile Paylaşım",     aciklama: "Tek link ile tüm misafirlere anında gönderin" },
  { ikon: "📊", baslik: "Katılım Takibi",            aciklama: "Kim geliyor — dashboard'dan gerçek zamanlı izleyin" },
];
