export default function PartnerPanelYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Dark hero header */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14">

          {/* Eyebrow + title row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Logo circle */}
              <div className="w-14 h-14 bg-white/10 rounded-2xl animate-pulse shrink-0" />
              <div className="space-y-2">
                <div className="h-2.5 w-24 bg-white/15 rounded-full animate-pulse" />
                <div className="h-5 w-40 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
            {/* Status badge */}
            <div className="h-6 w-20 bg-white/10 border border-white/10 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Operasyon özeti — 3 stat kart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
              </div>
              <div className="h-7 w-16 bg-gray-200 rounded-full" />
              <div className="h-2.5 w-32 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>

        {/* Aktivasyon kodları tablosu */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden animate-pulse">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-3 w-32 bg-gray-200 rounded-full" />
              <div className="h-2.5 w-48 bg-gray-100 rounded-full" />
            </div>
            <div className="h-9 w-32 bg-gray-100 rounded-xl" />
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded-full" style={{ width: `${30 + i * 8}%` }} />
                  <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
                </div>
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Panel içerik / abonelik kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 animate-pulse space-y-4">
            <div className="h-3 w-28 bg-gray-200 rounded-full" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                    <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse space-y-4">
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
            <div className="h-11 bg-gray-100 rounded-2xl" />
            <div className="h-11 bg-gray-100 rounded-2xl" />
            <div className="h-px bg-gray-100" />
            <div className="h-9 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
