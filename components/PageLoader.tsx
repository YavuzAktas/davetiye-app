type Props = { inline?: boolean };

export default function PageLoader({ inline = false }: Props) {
  const inner = (
    <div className="flex flex-col items-center gap-5">
      {!inline && (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
          <span className="text-white text-base font-bold">B</span>
        </div>
      )}
      <div className={`rounded-full border-2 animate-spin ${
        inline
          ? "w-5 h-5 border-gray-200 border-t-purple-500"
          : "w-6 h-6 border-white/10 border-t-purple-400"
      }`} />
      <p className={`text-[13px] font-medium ${inline ? "text-gray-400" : "text-white/30"}`}>
        Yükleniyor…
      </p>
    </div>
  );

  if (inline) {
    return <div className="flex items-center justify-center py-8">{inner}</div>;
  }

  return (
    <div className="min-h-screen bg-[#05000d] flex items-center justify-center">
      {inner}
    </div>
  );
}
