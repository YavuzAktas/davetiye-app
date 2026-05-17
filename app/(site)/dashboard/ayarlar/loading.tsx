export default function AyarlarYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Dark hero */}
      <div className="relative bg-[#080112] overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-3 w-20 bg-white/10 rounded-full animate-pulse" />
            <span className="text-white/20 text-xs">›</span>
            <div className="h-3 w-14 bg-white/15 rounded-full animate-pulse" />
          </div>

          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-3xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-48 bg-white/15 rounded-full animate-pulse" />
              <div className="h-3.5 w-36 bg-white/8 rounded-full animate-pulse" />
              <div className="flex gap-3">
                <div className="h-6 w-28 bg-white/8 border border-white/10 rounded-full animate-pulse" />
                <div className="h-6 w-36 bg-white/8 border border-white/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-10 bg-linear-to-b from-transparent to-gray-50 pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — 2/3 */}
          <div className="lg:col-span-2 space-y-5">

            {/* Profil bilgileri */}
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b border-gray-50 animate-pulse">
                <div className="h-3 w-28 bg-gray-200 rounded-full" />
                <div className="h-2.5 w-40 bg-gray-100 rounded-full mt-1.5" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                      <div className="h-3.5 bg-gray-200 rounded-full" style={{ width: `${40 + i * 10}%` }} />
                    </div>
                    <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* İstatistikler */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 animate-pulse">
              <div className="h-3 w-32 bg-gray-200 rounded-full mb-5" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-11 h-11 bg-gray-100 rounded-2xl" />
                    <div className="h-6 w-10 bg-gray-200 rounded-full" />
                    <div className="h-2.5 w-14 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — 1/3 */}
          <div className="space-y-4">

            {/* Referral widget */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse space-y-4">
              <div className="h-3 w-28 bg-gray-200 rounded-full" />
              <div className="h-11 bg-gray-100 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-14 bg-gray-100 rounded-2xl" />
                <div className="h-14 bg-gray-100 rounded-2xl" />
              </div>
              <div className="h-9 bg-gray-100 rounded-xl" />
            </div>

            {/* Ayarlar actions */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse space-y-3">
              <div className="h-3 w-20 bg-gray-200 rounded-full mb-4" />
              {[1, 2].map(i => (
                <div key={i} className="h-11 bg-gray-100 rounded-xl" />
              ))}
            </div>

            {/* Hızlı erişim */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 animate-pulse space-y-1.5">
              <div className="h-3 w-20 bg-gray-200 rounded-full mb-3" />
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 p-2.5">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                    <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
