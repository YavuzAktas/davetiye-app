import Link from "next/link";

export default function BeklerizWatermark() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <Link
        href="/"
        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
        style={{
          background: "rgba(8,1,18,0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(139,92,246,0.08)",
          color: "rgba(255,255,255,0.45)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {/* Logo pill */}
        <div
          className="flex items-center justify-center rounded-md shrink-0"
          style={{
            width: 16, height: 16,
            background: "linear-gradient(135deg,#7c3aed,#db2777)",
            boxShadow: "0 1px 6px rgba(124,58,237,0.45)",
          }}
        >
          <span style={{ color: "white", fontSize: 9, fontWeight: 700, lineHeight: 1 }}>B</span>
        </div>
        <span>Bekleriz ile oluşturuldu</span>
      </Link>
    </div>
  );
}
