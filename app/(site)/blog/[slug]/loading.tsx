export default function BlogYazisiYukleniyor() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* Dark hero */}
      <div style={{
        background: "linear-gradient(145deg,#06000f 0%,#0d0120 60%,#080014 100%)",
        padding: "48px 24px 56px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-7 animate-pulse">
            <div className="h-3 w-16 bg-white/10 rounded-full" />
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>›</span>
            <div className="h-3 w-10 bg-white/10 rounded-full" />
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>›</span>
            <div className="h-3 w-20 bg-white/15 rounded-full" />
          </div>

          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-5 animate-pulse">
            <div className="h-6 w-16 bg-purple-500/20 border border-purple-400/20 rounded-full" />
            <div className="h-3 w-14 bg-white/10 rounded-full" />
            <div className="h-3 w-3 bg-white/10 rounded-full" />
            <div className="h-3 w-20 bg-white/10 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-3 mb-5 animate-pulse">
            <div className="h-9 w-full bg-white/15 rounded-xl" />
            <div className="h-9 w-4/5 bg-white/12 rounded-xl" />
          </div>

          {/* Description */}
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-full bg-white/8 rounded-full" />
            <div className="h-4 w-3/4 bg-white/8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Article content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="space-y-4 animate-pulse">
          {/* Paragraph blocks */}
          {[85, 90, 75, 95, 60, 88, 70, 92, 65, 80].map((w, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded-full" style={{ width: `${w}%` }} />
          ))}

          {/* h2 */}
          <div className="h-6 w-48 bg-gray-200 rounded-full mt-8" />

          {[82, 90, 68, 85, 72].map((w, i) => (
            <div key={`b${i}`} className="h-4 bg-gray-100 rounded-full" style={{ width: `${w}%` }} />
          ))}

          {/* h2 */}
          <div className="h-6 w-56 bg-gray-200 rounded-full mt-8" />

          {[88, 75, 92, 60, 78].map((w, i) => (
            <div key={`c${i}`} className="h-4 bg-gray-100 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-10 pt-8 border-t border-gray-100 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 w-20 bg-gray-100 border border-gray-200 rounded-full" />
          ))}
        </div>

        {/* CTA block */}
        <div className="mt-14 rounded-3xl border border-purple-100 p-10 text-center space-y-4 animate-pulse"
          style={{ background: "linear-gradient(135deg,#f5f3ff 0%,#fdf2f8 100%)" }}>
          <div className="h-6 w-48 bg-purple-200/60 rounded-full mx-auto" />
          <div className="h-4 w-64 bg-purple-100 rounded-full mx-auto" />
          <div className="flex gap-3 justify-center pt-2">
            <div className="h-11 w-36 bg-purple-300/40 rounded-xl" />
            <div className="h-11 w-28 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
