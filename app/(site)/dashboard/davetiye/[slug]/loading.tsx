export default function DavetiyeDetayYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Dark hero */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 animate-pulse">
            <div className="h-3 w-20 bg-white/10 rounded-full" />
            <span className="text-white/20 text-xs">›</span>
            <div className="h-3 w-32 bg-white/15 rounded-full" />
          </div>

          {/* Icon + title row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/8 border border-white/10 rounded-3xl shrink-0" />
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/10 rounded-full" />
                <div className="h-6 w-20 bg-white/8 rounded-full" />
              </div>
              <div className="h-8 w-64 bg-white/15 rounded-full" />
              <div className="flex gap-4">
                <div className="h-3 w-28 bg-white/8 rounded-full" />
                <div className="h-3 w-36 bg-white/8 rounded-full" />
              </div>
            </div>
            <div className="h-10 w-32 bg-white/10 border border-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3" />
              <div className="h-7 w-12 bg-gray-200 rounded-full mb-1" />
              <div className="h-3.5 w-20 bg-gray-200 rounded-full mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left — 3/5 */}
          <div className="lg:col-span-3 space-y-6">

            {/* Share card */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between animate-pulse">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 bg-gray-200 rounded-full" />
                  <div className="h-2.5 w-36 bg-gray-100 rounded-full" />
                </div>
                <div className="h-8 w-28 bg-gray-100 rounded-xl" />
              </div>
              <div className="p-6 flex flex-col sm:flex-row gap-6 animate-pulse">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-34 h-34 bg-gray-100 rounded-2xl p-3">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="h-3 w-16 bg-gray-100 rounded-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded-full" />
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
                      <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                    <div className="flex gap-2">
                      <div className="h-10 w-28 bg-gray-100 rounded-xl" />
                      <div className="h-10 w-28 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP list */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 animate-pulse">
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0 animate-pulse">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded-full" style={{ width: `${40 + i * 12}%` }} />
                    <div className="h-3 w-20 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-6 w-16 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right — 2/5 */}
          <div className="lg:col-span-2 space-y-4">

            {/* Info card */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 animate-pulse space-y-4">
              <div className="h-3 w-24 bg-gray-200 rounded-full" />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-xl shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-12 bg-gray-200 rounded-full" />
                    <div className="h-3.5 w-28 bg-gray-300 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded-full mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-xl" />
                      <div className="h-3.5 w-20 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-3 w-3 bg-gray-100 rounded" />
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
