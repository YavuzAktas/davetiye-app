import Link from "next/link";

/* ── Açık zarf SVG ── */
function EnvelopeOpen() {
  return (
    <svg width="72" height="60" viewBox="0 0 72 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Zarf gövdesi */}
      <rect x="4" y="20" width="64" height="36" rx="4" fill="white" stroke="#E9D5FF" strokeWidth="1.5"/>
      {/* Zarf iç gölge */}
      <rect x="4" y="20" width="64" height="36" rx="4" fill="url(#envGrad)" opacity="0.4"/>
      {/* Sol üçgen */}
      <path d="M4 20 L36 42 L4 56" stroke="#E9D5FF" strokeWidth="1.5" fill="none"/>
      {/* Sağ üçgen */}
      <path d="M68 20 L36 42 L68 56" stroke="#E9D5FF" strokeWidth="1.5" fill="none"/>
      {/* Üst kapak (açık) */}
      <path d="M4 20 L36 4 L68 20" fill="white" stroke="#D8B4FE" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Mühür izi (soluk) */}
      <circle cx="36" cy="14" r="5" fill="none" stroke="#DDD6FE" strokeWidth="1" strokeDasharray="2 2"/>
      {/* Soru işareti içeride */}
      <text x="36" y="42" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontFamily="serif" fontStyle="italic">?</text>
      <defs>
        <linearGradient id="envGrad" x1="4" y1="20" x2="68" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E8FF"/>
          <stop offset="1" stopColor="#FCE7F3"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Dekoratif nokta ── */
function Dot({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-full ${className ?? ""}`} style={style} />
  );
}

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden bg-white">

      {/* Arka plan doku */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:"radial-gradient(circle,#F3E8FF 1px,transparent 1px)", backgroundSize:"28px 28px", opacity:0.55 }}/>

      {/* Gradient blob — sol üst */}
      <div className="absolute -top-32 -left-32 w-120 h-120 rounded-full pointer-events-none animate-blob-1"
        style={{ background:"radial-gradient(circle,#EDE9FE 0%,transparent 65%)", filter:"blur(60px)", opacity:0.7 }}/>

      {/* Gradient blob — sağ alt */}
      <div className="absolute -bottom-32 -right-32 w-100 h-100 rounded-full pointer-events-none animate-blob-2"
        style={{ background:"radial-gradient(circle,#FCE7F3 0%,transparent 65%)", filter:"blur(72px)", opacity:0.6 }}/>

      {/* Yüzen noktalar */}
      <Dot className="animate-float w-2 h-2 bg-purple-300" style={{ top:"18%", left:"14%", animationDelay:"0s" }}/>
      <Dot className="animate-float w-1.5 h-1.5 bg-pink-300" style={{ top:"28%", right:"12%", animationDelay:"1.2s" }}/>
      <Dot className="animate-float w-2.5 h-2.5 bg-violet-200" style={{ bottom:"22%", left:"18%", animationDelay:"0.6s" }}/>
      <Dot className="animate-float w-1.5 h-1.5 bg-pink-200" style={{ bottom:"30%", right:"16%", animationDelay:"1.8s" }}/>
      <Dot className="animate-float w-2 h-2 bg-purple-200" style={{ top:"50%", left:"6%",  animationDelay:"0.9s" }}/>
      <Dot className="animate-float w-1.5 h-1.5 bg-violet-300" style={{ top:"60%", right:"8%", animationDelay:"2.1s" }}/>

      {/* İçerik */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        {/* 404 büyük numara */}
        <div className="relative mb-2 select-none" style={{ lineHeight:1 }}>
          <span
            className="font-black"
            style={{
              fontSize:"clamp(7rem,22vw,11rem)",
              background:"linear-gradient(135deg,#7C3AED 0%,#A855F7 45%,#EC4899 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              letterSpacing:"-0.04em",
            }}>
            404
          </span>
          {/* Hafif gölge katmanı */}
          <span
            className="absolute inset-0 font-black pointer-events-none select-none"
            aria-hidden
            style={{
              fontSize:"clamp(7rem,22vw,11rem)",
              background:"linear-gradient(135deg,#7C3AED 0%,#A855F7 45%,#EC4899 100%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              letterSpacing:"-0.04em",
              filter:"blur(32px)",
              opacity:0.25,
              transform:"translateY(8px)",
            }}>
            404
          </span>
        </div>

        {/* Zarf */}
        <div className="animate-float mb-6" style={{ animationDelay:"0.4s" }}>
          <EnvelopeOpen />
        </div>

        {/* Başlık */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Bu sayfa davete gelmedi
        </h1>

        {/* Açıklama */}
        <p className="text-gray-400 text-base mb-10 leading-relaxed max-w-sm"
          style={{ fontFamily:"var(--font-cormorant),serif", fontSize:17 }}>
          Aradığınız sayfa kaybolmuş, silinmiş ya da hiç var olmamış olabilir.
          Merak etmeyin, sizi doğru yere götürelim.
        </p>

        {/* CTA butonları */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link href="/"
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-white text-center transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-200"
            style={{ background:"linear-gradient(135deg,#7C3AED,#EC4899)" }}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/sablonlar"
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-gray-700 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all">
            Şablonlara Bak
          </Link>
        </div>

      </div>
    </div>
  );
}
