export default function DavetlilerYukleniyor() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky header skeleton */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-36 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-14 bg-gray-100 rounded-xl animate-pulse sm:hidden" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Tab bar skeleton */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 animate-pulse">
          {[40, 32, 28].map((w, i) => (
            <div key={i} className={`flex-1 h-9 rounded-xl ${i === 0 ? "bg-gray-200" : "bg-gray-100"}`} />
          ))}
        </div>

        {/* Form alanı skeleton */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 space-y-3 animate-pulse">
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
          <div className="h-11 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-11 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-11 bg-gray-200 rounded-xl" />
        </div>

        {/* Davetli listesi skeleton */}
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 animate-pulse">
            <div className="h-3 w-28 bg-gray-100 rounded-full" />
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 animate-pulse">
              <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded-full" style={{ width: `${48 + i * 12}%` }} />
                <div className="h-3 w-24 bg-gray-100 rounded-full" />
              </div>
              <div className="h-7 w-16 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
