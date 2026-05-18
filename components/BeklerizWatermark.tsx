import Link from "next/link";

export default function BeklerizWatermark() {
  return (
    <div className="w-full flex justify-center py-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:opacity-80"
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
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
