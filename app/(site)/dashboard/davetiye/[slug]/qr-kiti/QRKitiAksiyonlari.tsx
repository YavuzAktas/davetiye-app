"use client";

export default function QRKitiAksiyonlari() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center justify-center rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800"
      >
        Yazdır / PDF Al
      </button>
      <a
        href="#qr-kartlari"
        className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
      >
        Kartları Gör
      </a>
    </div>
  );
}
