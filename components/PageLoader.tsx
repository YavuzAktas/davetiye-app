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
      <div className="w-5 h-5 rounded-full border-2 border-purple-100 border-t-purple-500 animate-spin" />
      <p className="text-[13px] font-medium text-gray-400">Yükleniyor…</p>
    </div>
  );

  if (inline) {
    return <div className="flex items-center justify-center py-8">{inner}</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {inner}
    </div>
  );
}
