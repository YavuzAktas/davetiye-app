import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Davetim platformu iletişim bilgileri ve destek kanalları.",
};

const KANALLAR = [
  {
    icon: "✉️",
    baslik: "Genel Destek",
    aciklama: "Ürün, teknik sorunlar ve genel sorularınız için",
    deger: "destek@davetim.com",
    href: "mailto:destek@davetim.com",
    sure: "1–2 iş günü içinde yanıt",
  },
  {
    icon: "⚖️",
    baslik: "KVKK Başvuruları",
    aciklama: "Kişisel veri erişim, düzeltme ve silme talepleri",
    deger: "kvkk@davetim.com",
    href: "mailto:kvkk@davetim.com",
    sure: "5 iş günü içinde yanıt (yasal yükümlülük)",
  },
  {
    icon: "🏛️",
    baslik: "Hukuki Bildirimler",
    aciklama: "Resmi tebligat ve hukuki yazışmalar için",
    deger: "hukuk@davetim.com",
    href: "mailto:hukuk@davetim.com",
    sure: "5 iş günü içinde yanıt",
  },
];

export default function IletisimSayfasi() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Üst bant */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-purple-500 mb-2">
          İletişim
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bize Ulaşın</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Her türlü soru, öneri ve talepleriniz için aşağıdaki kanallardan bize yazabilirsiniz.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

        {/* İletişim kanalları */}
        {KANALLAR.map((k) => (
          <a
            key={k.baslik}
            href={k.href}
            className="flex items-start gap-5 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-100 transition-all group"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:bg-purple-100 transition-colors">
              {k.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 mb-0.5">{k.baslik}</p>
              <p className="text-sm text-gray-400 mb-2">{k.aciklama}</p>
              <p className="text-sm font-medium text-purple-600">{k.deger}</p>
              <p className="text-xs text-gray-300 mt-1">{k.sure}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}

        {/* Hizmet sağlayıcı bilgileri — 6563 E-Ticaret Kanunu m.3 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-4">
            Hizmet Sağlayıcı Bilgileri
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <span className="text-gray-400 w-28 shrink-0">Ticaret Unvanı</span>
              <span className="text-gray-700 font-medium">Davetim</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-28 shrink-0">Faaliyet Ülkesi</span>
              <span className="text-gray-700">Türkiye</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-28 shrink-0">Web Sitesi</span>
              <span className="text-gray-700">davetim.com</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-400 w-28 shrink-0">E-posta</span>
              <a href="mailto:destek@davetim.com" className="text-purple-600 hover:underline">destek@davetim.com</a>
            </div>
          </div>
        </div>

        {/* Alt linkler */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-400 mb-3">İlgili belgeler</p>
          <div className="flex justify-center gap-4 flex-wrap text-sm">
            <Link href="/kvkk" className="text-purple-600 hover:underline">KVKK Aydınlatma Metni</Link>
            <Link href="/gizlilik" className="text-purple-600 hover:underline">Gizlilik Politikası</Link>
            <Link href="/kullanim-sartlari" className="text-purple-600 hover:underline">Kullanım Şartları</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
