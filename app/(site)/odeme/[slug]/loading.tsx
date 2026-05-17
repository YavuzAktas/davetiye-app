export default function OdemeYukleniyor() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(148deg, #05000d 0%, #0c0120 55%, #07000f 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "relative", zIndex: 2, padding: "28px 20px 64px" }}>

        {/* Header */}
        <div style={{
          maxWidth: 1040, margin: "0 auto 44px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="w-9 h-9 bg-purple-600/40 rounded-xl" />
            <div className="h-5 w-20 bg-white/15 rounded-full" />
          </div>
          <div className="h-4 w-28 bg-white/10 rounded-full animate-pulse" />
        </div>

        {/* Two-panel grid */}
        <div style={{
          maxWidth: 1040, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 24, alignItems: "start",
        }}>

          {/* Left: invitation summary */}
          <div className="animate-pulse" style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 28, padding: "36px 32px",
          }}>
            {/* Template badge */}
            <div className="h-7 w-40 bg-white/8 border border-white/10 rounded-full mb-7" />

            {/* Title */}
            <div className="space-y-2 mb-8">
              <div className="h-10 w-3/4 bg-white/15 rounded-xl" />
              <div className="h-10 w-1/2 bg-white/10 rounded-xl" />
              <div className="h-4 w-72 bg-white/8 rounded-full mt-3" />
            </div>

            {/* Date/venue block */}
            <div className="mb-7 space-y-4 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 bg-white/8 rounded-xl shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-10 bg-white/8 rounded-full" />
                    <div className="h-4 w-36 bg-white/15 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Price items */}
            <div className="h-3 w-20 bg-white/10 rounded-full mb-3" />
            <div className="space-y-2 mb-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 bg-white/10 rounded" />
                    <div className="h-3 w-32 bg-white/15 rounded-full" />
                  </div>
                  <div className="h-3 w-14 bg-white/15 rounded-full" />
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="h-4 w-16 bg-white/15 rounded-full" />
              <div className="h-8 w-24 bg-white/20 rounded-xl" />
            </div>
          </div>

          {/* Right: billing form */}
          <div className="animate-pulse" style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 28, padding: "36px 32px",
          }}>
            <div className="h-3 w-24 bg-purple-400/20 rounded-full mb-2" />
            <div className="h-7 w-40 bg-white/15 rounded-full mb-2" />
            <div className="h-3.5 w-64 bg-white/8 rounded-full mb-7" />

            {/* Form fields */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-3 w-24 bg-white/15 rounded-full mb-2" />
                  <div className="h-12 bg-white/8 border border-white/10 rounded-xl" />
                </div>
              ))}
              <div className="h-14 bg-purple-600/30 border border-purple-500/20 rounded-xl mt-2" />
            </div>

            {/* Trust signals */}
            <div className="flex justify-center gap-5 mt-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-3 w-16 bg-white/8 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
