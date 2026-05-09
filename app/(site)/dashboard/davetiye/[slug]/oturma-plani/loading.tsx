export default function OturmaPlanYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark hero skeleton */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-purple-700 opacity-20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20">›</span>
            <div className="h-3 w-32 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20">›</span>
            <div className="h-3 w-24 bg-white/10 rounded-full animate-pulse" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shrink-0">
              🪑
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-7 w-44 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 w-56 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stat cards */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 min-w-25 rounded-2xl bg-white border border-gray-100 px-4 py-3 animate-pulse">
              <div className="h-7 w-8 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Atanmamış zone */}
        <div className="mb-6">
          <div className="h-4 w-40 bg-gray-200 rounded-full mb-3 animate-pulse" />
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 min-h-25 animate-pulse" />
        </div>

        {/* Masa grid */}
        <div className="h-4 w-24 bg-gray-200 rounded-full mb-4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white animate-pulse">
              <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full" />
              </div>
              <div className="p-3 space-y-2 min-h-20">
                {i === 1 && <div className="h-10 bg-gray-50 rounded-xl" />}
                {i === 1 && <div className="h-10 bg-gray-50 rounded-xl" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
