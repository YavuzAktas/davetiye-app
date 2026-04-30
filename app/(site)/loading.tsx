export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-100 rounded-full" />
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute inset-0" />
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-medium text-sm">Yükleniyor</p>
          <p className="text-gray-400 text-xs mt-0.5">Lütfen bekleyin...</p>
        </div>
      </div>
    </div>
  );
}