import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* Hafif arka plan gradyanı */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse at 50% 0%,#F3E8FF 0%,#FDF2F8 35%,#fff 70%)" }}/>

      {/* Nokta doku */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:"radial-gradient(circle,#E9D5FF 1px,transparent 1px)", backgroundSize:"32px 32px", opacity:0.5 }}/>

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Numara */}
        <p className="font-black leading-none select-none"
          style={{
            fontSize:"clamp(8rem,25vw,14rem)",
            background:"linear-gradient(135deg,#7C3AED 0%,#A855F7 50%,#EC4899 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            letterSpacing:"-0.04em",
            filter:"drop-shadow(0 8px 40px rgba(124,58,237,0.2))",
          }}>
          404
        </p>

        {/* Zarf ikonuSerif */}
        <div className="animate-float -mt-4 mb-8">
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
            <rect x="2" y="10" width="60" height="36" rx="5" fill="white" stroke="#E9D5FF" strokeWidth="1.5"/>
            <path d="M2 10 L32 30 L62 10" stroke="#D8B4FE" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            <path d="M2 10 L32 2 L62 10" fill="#F3E8FF" stroke="#D8B4FE" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 46 L24 28" stroke="#EDE9FE" strokeWidth="1.2"/>
            <path d="M62 46 L40 28" stroke="#EDE9FE" strokeWidth="1.2"/>
          </svg>
        </div>

        {/* Başlık */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Sayfa bulunamadı
        </h1>

        {/* Alt yazı */}
        <p className="text-gray-400 text-base mb-10 max-w-sm leading-relaxed">
          Bu sayfanın daveti iptal edilmiş. Sizi doğru adrese götürelim.
        </p>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href="/"
            className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-white text-center transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-200"
            style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)" }}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/sablonlar"
            className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-gray-600 text-center border border-gray-200 bg-white hover:bg-gray-50 transition-all">
            Şablonlara Bak
          </Link>
        </div>

      </div>
    </div>
  );
}
