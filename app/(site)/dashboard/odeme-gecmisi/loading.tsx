export default function OdemeGecmisiYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Dark hero */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-20">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20 text-xs">/</span>
            <div className="h-3 w-24 bg-white/15 rounded-full animate-pulse" />
          </div>

          {/* Title */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3 animate-pulse">
              <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-2xl" />
              <div className="h-7 w-40 bg-white/15 rounded-full" />
            </div>
            <div className="h-3 w-72 bg-white/8 rounded-full animate-pulse ml-13" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/8 border border-white/10 rounded-2xl p-4 sm:p-5 animate-pulse">
                <div className="w-7 h-7 bg-white/10 rounded-lg mb-3" />
                <div className="h-7 w-16 bg-white/15 rounded-full mb-1" />
                <div className="h-2.5 w-20 bg-white/8 rounded-full hidden sm:block mt-1" />
                <div className="h-2.5 w-14 bg-white/8 rounded-full hidden sm:block mt-1" />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Payment cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gray-200 animate-pulse" />
            <div className="p-5 sm:p-6 animate-pulse">

              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-gray-200 rounded-full" />
                    <div className="h-3 w-28 bg-gray-100 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-20 bg-gray-100 rounded-full" />
                  <div className="w-8 h-8 bg-gray-100 rounded-xl" />
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100 space-y-2">
                {[1, 2].map(j => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-4 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-3 w-12 bg-gray-200 rounded-full" />
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
                  <div className="h-6 w-16 bg-gray-300 rounded-full" />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="h-3 w-28 bg-gray-100 rounded-full" />
                <div className="h-3 w-28 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
