export default function AlbumYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark hero skeleton */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20">›</span>
            <div className="h-3 w-28 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20">›</span>
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
          </div>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/5 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-56 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 w-40 bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-28 bg-white/10 rounded-xl animate-pulse hidden sm:block" />
          </div>
        </div>
        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Content skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Stat kartlar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="h-6 w-6 bg-gray-100 rounded mb-3" />
              <div className="h-8 w-10 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-24 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* İki kolon liste */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(col => (
            <div key={col} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 rounded-2xl border border-gray-100 animate-pulse">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-gray-100 rounded" />
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                      <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
