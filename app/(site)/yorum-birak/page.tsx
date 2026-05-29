import YorumFormu from "@/components/YorumFormu";

export const metadata = {
  title: "Deneyimini Paylaş — Bekleriz",
  description: "Bekleriz ile davetiye oluşturdunuz mu? Deneyiminizi diğer kullanıcılarla paylaşın.",
  robots: "noindex",
};

export default function YorumBirakPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">✍️</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deneyimini paylaş</h1>
          <p className="text-gray-500 text-sm">
            Yorumun onaylandıktan sonra ana sayfada yayınlanır ve diğer çiftlere yol gösterir.
          </p>
        </div>
        <YorumFormu />
      </div>
    </main>
  );
}
