export default function DashboardYukleniyor() {
  return (
    <div className="min-h-screen bg-[#05000d]">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8">

          {/* Top row: avatar + greeting + CTA */}
          <div className="flex items-center justify-between gap-4 mb-10 animate-pulse">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-white/10 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <div className="h-2.5 w-16 bg-white/8 rounded-full" />
                <div className="h-5 w-24 bg-white/15 rounded-full" />
              </div>
            </div>
            <div className="h-9 w-28 bg-purple-600/30 border border-purple-500/20 rounded-xl" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "border-purple-500/20 bg-purple-500/10",
              "border-blue-500/20 bg-blue-500/10",
              "border-amber-500/20 bg-amber-500/10",
              "border-emerald-500/20 bg-emerald-500/10",
            ].map((cls, i) => (
              <div key={i} className={`border ${cls} rounded-2xl p-4 sm:p-5 animate-pulse`}>
                <div className="w-8 h-8 bg-white/10 rounded-lg mb-3" />
                <div className="h-8 w-12 bg-white/15 rounded-full mb-1" />
                <div className="h-2.5 w-20 bg-white/8 rounded-full mt-1" />
                <div className="h-2.5 w-16 bg-white/8 rounded-full mt-1" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-white/8" />
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — davetiye list (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Section header */}
            <div className="flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-white/15 rounded-full" />
                <div className="h-3 w-40 bg-white/8 rounded-full" />
              </div>
              <div className="h-3 w-14 bg-purple-400/30 rounded-full" />
            </div>

            {/* Davetiye card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/8 overflow-hidden animate-pulse"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="h-1 bg-purple-500/30" />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-white/8 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 w-32 bg-white/15 rounded-full" />
                        <div className="flex gap-2">
                          <div className="h-4 w-14 bg-white/8 rounded-full" />
                          <div className="h-4 w-16 bg-white/8 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-36 bg-white/8 rounded-full" />
                      <div className="h-3 w-28 bg-white/8 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-9 bg-white/5 border border-white/8 rounded-xl" />
                      <div className="flex-1 h-9 bg-purple-500/20 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar (1/3) */}
          <div className="space-y-4">

            {/* Hızlı oluştur */}
            <div className="rounded-3xl border border-purple-500/20 p-5 animate-pulse"
              style={{ background: "rgba(124,58,237,0.08)" }}>
              <div className="w-8 h-8 bg-white/10 rounded-lg mb-3" />
              <div className="h-4 w-36 bg-white/15 rounded-full mb-2" />
              <div className="h-3 w-44 bg-white/8 rounded-full mb-4" />
              <div className="h-9 w-32 bg-purple-600/30 rounded-xl" />
            </div>

            {/* Özet */}
            <div className="rounded-3xl border border-white/8 bg-white/3 p-5 animate-pulse">
              <div className="h-2.5 w-20 bg-white/10 rounded-full mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-white/5 rounded-xl" />
                      <div className="h-3 w-20 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-3.5 w-8 bg-white/15 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı erişim */}
            <div className="rounded-3xl border border-white/8 bg-white/3 p-5 animate-pulse">
              <div className="h-2.5 w-20 bg-white/10 rounded-full mb-3" />
              <div className="space-y-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-2.5">
                    <div className="w-8 h-8 bg-white/5 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-white/15 rounded-full" />
                      <div className="h-2.5 w-16 bg-white/8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
