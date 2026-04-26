import Link from "next/link";

export default function OdemeBasarisiz() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-500 mb-8">
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
        </p>
        <Link
          href="/fiyatlar"
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          Tekrar Dene
        </Link>
      </div>
    </div>
  );
}