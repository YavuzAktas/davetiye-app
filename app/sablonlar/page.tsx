export default function SablonlarSayfasi() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Şablonlar</h1>
      <p className="text-gray-500 mb-12">
        Yüzlerce hazır şablon arasından kendinize uygun olanı seçin.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {["Düğün", "Nişan", "Doğum Günü", "Sünnet", "Kına Gecesi", "Kurumsal"].map(
          (kategori) => (
            <div
              key={kategori}
              className="border border-gray-100 rounded-2xl p-8 text-center hover:border-purple-200 hover:bg-purple-50 transition-all cursor-pointer"
            >
              <p className="font-medium text-gray-800">{kategori}</p>
              <p className="text-sm text-gray-400 mt-1">Yakında</p>
            </div>
          )
        )}
      </div>
    </div>
  );
  
}