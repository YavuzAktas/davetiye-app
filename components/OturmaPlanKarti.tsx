"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

const DIYET_ETIKET: Record<string, string> = {
  vegan: "🌱",
  vejetaryen: "🥗",
  glutensiz: "🌾",
  laktozsuz: "🥛",
};

type Misafir = { id: string; ad: string; kisiSayisi: number; diyet: string | null };
type Masa = {
  id: string;
  isim: string;
  kapasite: number;
  atamalar: { id: string; rsvp: Misafir }[];
};

interface Props {
  slug: string;
  masalarBaslangic: Masa[];
  atanmamisBaslangic: Misafir[];
}

/* ── Draggable misafir chip ── */
function MisafirChip({
  misafir,
  overlay = false,
  onRemove,
}: {
  misafir: Misafir;
  overlay?: boolean;
  onRemove?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: misafir.id });
  const diyetler = misafir.diyet ? misafir.diyet.split(",") : [];

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      {...(overlay ? {} : { ...attributes, ...listeners })}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging && !overlay
          ? "opacity-30"
          : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm"
      } ${overlay ? "shadow-xl border-purple-300 bg-white rotate-2 scale-105" : ""}`}
    >
      <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700 shrink-0">
        {misafir.ad[0]?.toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{misafir.ad}</p>
        <p className="text-[10px] text-gray-400">{misafir.kisiSayisi} kişi</p>
      </div>
      {diyetler.length > 0 && (
        <div className="flex gap-0.5 shrink-0">
          {diyetler.map(d => (
            <span key={d} className="text-[11px]" title={d}>{DIYET_ETIKET[d] ?? "🍽️"}</span>
          ))}
        </div>
      )}
      {onRemove && !overlay && (
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="ml-1 shrink-0 w-4 h-4 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center text-[11px] leading-none transition-colors"
          title="Misafiri kaldır"
        >
          ×
        </button>
      )}
    </div>
  );
}

/* ── Droppable masa kartı ── */
function MasaKarti({
  masa,
  slug,
  aktifKisiSayisi,
  kapasiteHataId,
  onDelete,
  onEdit,
  onMisafirKaldir,
}: {
  masa: Masa;
  slug: string;
  aktifKisiSayisi: number;
  kapasiteHataId: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string, isim: string, kapasite: number) => void;
  onMisafirKaldir: (rsvpId: string, masaId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: masa.id });
  const [duzenle, setDuzenle] = useState(false);
  const [isimDraft, setIsimDraft] = useState(masa.isim);
  const [kapasiteDraft, setKapasiteDraft] = useState(masa.kapasite);
  const toplamKisi = masa.atamalar.reduce((a, at) => a + at.rsvp.kisiSayisi, 0);
  const doluluk = Math.min((toplamKisi / masa.kapasite) * 100, 100);
  const tasmakUzere = isOver && aktifKisiSayisi > 0 && toplamKisi + aktifKisiSayisi > masa.kapasite;
  const isHataFlash = kapasiteHataId === masa.id;

  const kaydet = async () => {
    await fetch(`/api/dashboard/davetiye/${slug}/masalar/${masa.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isim: isimDraft, kapasite: kapasiteDraft }),
    });
    onEdit(masa.id, isimDraft, kapasiteDraft);
    setDuzenle(false);
  };

  const sil = async () => {
    if (!confirm(`"${masa.isim}" masasını silmek istediğinden emin misin?`)) return;
    await fetch(`/api/dashboard/davetiye/${slug}/masalar/${masa.id}`, { method: "DELETE" });
    onDelete(masa.id);
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 transition-all ${
        tasmakUzere || isHataFlash
          ? "border-red-400 bg-red-50 shadow-lg shadow-red-100"
          : isOver
          ? "border-purple-400 bg-purple-50 shadow-lg shadow-purple-100"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Masa header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        {duzenle ? (
          <div className="flex gap-2 items-center">
            <input
              value={isimDraft}
              onChange={e => setIsimDraft(e.target.value)}
              className="flex-1 text-sm font-semibold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-400"
              onKeyDown={e => e.key === "Enter" && kaydet()}
              autoFocus
            />
            <input
              type="number"
              value={kapasiteDraft}
              onChange={e => setKapasiteDraft(Number(e.target.value))}
              min={1}
              max={50}
              className="w-14 text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-400 text-center"
            />
            <button onClick={kaydet} className="text-xs text-purple-600 font-semibold hover:text-purple-800">✓</button>
            <button onClick={() => setDuzenle(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="flex-1 text-sm font-bold text-gray-800">{masa.isim}</p>
            <span className={`text-[11px] tabular-nums font-medium ${toplamKisi >= masa.kapasite ? "text-red-500" : "text-gray-400"}`}>
              {toplamKisi}/{masa.kapasite}
            </span>
            <button onClick={() => setDuzenle(true)} className="text-gray-300 hover:text-gray-500 transition-colors text-xs">✏️</button>
            <button onClick={sil} className="text-gray-300 hover:text-red-400 transition-colors text-xs">🗑</button>
          </div>
        )}
        {/* Doluluk çubuğu */}
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${doluluk >= 100 ? "bg-red-400" : doluluk >= 75 ? "bg-amber-400" : "bg-emerald-400"}`}
            style={{ width: `${doluluk}%` }}
          />
        </div>
        {tasmakUzere && (
          <p className="text-[11px] text-red-500 font-medium mt-1.5">Kapasite dolu, buraya eklenemiyor</p>
        )}
      </div>

      {/* Misafirler */}
      <div className="p-3 min-h-20 space-y-1.5">
        {masa.atamalar.length === 0 ? (
          <p className="text-[11px] text-gray-300 text-center mt-4 select-none">Misafir bırak</p>
        ) : (
          masa.atamalar.map(at => (
            <MisafirChip
              key={at.rsvp.id}
              misafir={at.rsvp}
              onRemove={() => onMisafirKaldir(at.rsvp.id, masa.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Droppable atanmamış zone ── */
function AtanmamisZone({ misafirler }: { misafirler: Misafir[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: "atanmamis" });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 transition-all p-4 min-h-25 ${
        isOver ? "border-emerald-400 bg-emerald-50" : "border-dashed border-gray-200 bg-gray-50/50"
      }`}
    >
      {misafirler.length === 0 ? (
        <p className="text-xs text-gray-300 text-center mt-6 select-none">Tüm misafirler atandı 🎉</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {misafirler.map(m => <MisafirChip key={m.id} misafir={m} />)}
        </div>
      )}
    </div>
  );
}

/* ── Ana bileşen ── */
export default function OturmaPlanKarti({ slug, masalarBaslangic, atanmamisBaslangic }: Props) {
  const [masalar, setMasalar] = useState<Masa[]>(masalarBaslangic);
  const [atanmamis, setAtanmamis] = useState<Misafir[]>(atanmamisBaslangic);
  const [aktifId, setAktifId] = useState<string | null>(null);
  const [kapasiteHataId, setKapasiteHataId] = useState<string | null>(null);
  const [yeniMasaAcik, setYeniMasaAcik] = useState(false);
  const [yeniIsim, setYeniIsim] = useState("");
  const [yeniKapasite, setYeniKapasite] = useState(8);
  const [ekleniyor, setEkleniyor] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const aktifMisafir = useCallback((): Misafir | undefined => {
    if (!aktifId) return undefined;
    const atanmamisBul = atanmamis.find(m => m.id === aktifId);
    if (atanmamisBul) return atanmamisBul;
    for (const masa of masalar) {
      const atama = masa.atamalar.find(a => a.rsvp.id === aktifId);
      if (atama) return atama.rsvp;
    }
  }, [aktifId, atanmamis, masalar]);

  const onDragStart = ({ active }: DragStartEvent) => setAktifId(active.id as string);

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    setAktifId(null);
    if (!over) return;

    const rsvpId = active.id as string;
    const hedefId = over.id as string;

    const mevcutMasaId = masalar.find(m => m.atamalar.some(a => a.rsvp.id === rsvpId))?.id ?? null;
    if (mevcutMasaId === hedefId || (hedefId === "atanmamis" && mevcutMasaId === null)) return;

    const misafir = aktifMisafir();
    if (!misafir) return;

    // Kapasite kontrolü
    if (hedefId !== "atanmamis") {
      const hedefMasa = masalar.find(m => m.id === hedefId);
      if (hedefMasa) {
        const mevcutKisi = hedefMasa.atamalar.reduce((a, at) => a + at.rsvp.kisiSayisi, 0);
        if (mevcutKisi + misafir.kisiSayisi > hedefMasa.kapasite) {
          setKapasiteHataId(hedefId);
          setTimeout(() => setKapasiteHataId(null), 1800);
          return;
        }
      }
    }

    // Optimistik güncelleme
    setMasalar(prev => prev.map(m => {
      if (m.id === mevcutMasaId) return { ...m, atamalar: m.atamalar.filter(a => a.rsvp.id !== rsvpId) };
      if (m.id === hedefId && hedefId !== "atanmamis") return { ...m, atamalar: [...m.atamalar, { id: `tmp-${rsvpId}`, rsvp: misafir }] };
      return m;
    }));
    if (mevcutMasaId === null) setAtanmamis(prev => prev.filter(m => m.id !== rsvpId));
    if (hedefId === "atanmamis") setAtanmamis(prev => [...prev, misafir]);

    // API
    await fetch(`/api/dashboard/davetiye/${slug}/masalar/atama`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rsvpId, masaId: hedefId === "atanmamis" ? null : hedefId }),
    });
  };

  const misafirKaldir = async (rsvpId: string, masaId: string) => {
    const masa = masalar.find(m => m.id === masaId);
    const atama = masa?.atamalar.find(a => a.rsvp.id === rsvpId);
    if (!atama) return;
    const misafir = atama.rsvp;

    setMasalar(prev => prev.map(m =>
      m.id === masaId ? { ...m, atamalar: m.atamalar.filter(a => a.rsvp.id !== rsvpId) } : m
    ));
    setAtanmamis(prev => [...prev, misafir]);

    await fetch(`/api/dashboard/davetiye/${slug}/masalar/atama`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rsvpId, masaId: null }),
    });
  };

  const masaEkle = async () => {
    if (!yeniIsim.trim()) return;
    setEkleniyor(true);
    const res = await fetch(`/api/dashboard/davetiye/${slug}/masalar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isim: yeniIsim.trim(), kapasite: yeniKapasite }),
    });
    if (res.ok) {
      const yeni = await res.json();
      setMasalar(prev => [...prev, { ...yeni, atamalar: [] }]);
      setYeniIsim("");
      setYeniKapasite(8);
      setYeniMasaAcik(false);
    }
    setEkleniyor(false);
  };

  const masaSil = (id: string) => {
    const masa = masalar.find(m => m.id === id);
    if (masa) setAtanmamis(prev => [...prev, ...masa.atamalar.map(a => a.rsvp)]);
    setMasalar(prev => prev.filter(m => m.id !== id));
  };

  const masaDuzenle = (id: string, isim: string, kapasite: number) => {
    setMasalar(prev => prev.map(m => m.id === id ? { ...m, isim, kapasite } : m));
  };

  const toplamAtanan = masalar.reduce((a, m) => a + m.atamalar.length, 0);
  const toplamKisi = masalar.reduce((a, m) => a + m.atamalar.reduce((b, at) => b + at.rsvp.kisiSayisi, 0), 0);
  const aktifMisafirObj = aktifMisafir();

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {/* Özet */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: "Masa", value: masalar.length, color: "bg-purple-50 text-purple-700" },
          { label: "Atandı", value: toplamAtanan, color: "bg-emerald-50 text-emerald-700" },
          { label: "Atanmadı", value: atanmamis.length, color: "bg-amber-50 text-amber-700" },
          { label: "Toplam Kişi", value: toplamKisi, color: "bg-blue-50 text-blue-700" },
        ].map(s => (
          <div key={s.label} className={`flex-1 min-w-25 rounded-2xl px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs font-medium opacity-70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Atanmamış misafirler */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-gray-700">Atanmamış Misafirler</p>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{atanmamis.length}</span>
        </div>
        <AtanmamisZone misafirler={atanmamis} />
      </div>

      {/* Masa ekle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-700">Masalar</p>
        <button
          onClick={() => setYeniMasaAcik(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Masa Ekle
        </button>
      </div>

      {yeniMasaAcik && (
        <div className="mb-4 flex gap-2 items-center p-3 bg-purple-50 rounded-2xl border border-purple-100">
          <input
            value={yeniIsim}
            onChange={e => setYeniIsim(e.target.value)}
            placeholder="Masa adı (örn: VIP Masa)"
            className="flex-1 text-sm border border-purple-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-400 bg-white"
            onKeyDown={e => e.key === "Enter" && masaEkle()}
            autoFocus
          />
          <input
            type="number"
            value={yeniKapasite}
            onChange={e => setYeniKapasite(Number(e.target.value))}
            min={1}
            max={50}
            className="w-16 text-sm border border-purple-200 rounded-xl px-2 py-2 focus:outline-none focus:border-purple-400 bg-white text-center"
            title="Kapasite"
          />
          <span className="text-xs text-gray-400 shrink-0">kişi</span>
          <button
            onClick={masaEkle}
            disabled={ekleniyor || !yeniIsim.trim()}
            className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            Ekle
          </button>
          <button onClick={() => setYeniMasaAcik(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
      )}

      {/* Masa grid */}
      {masalar.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-4xl mb-3">🪑</p>
          <p className="text-gray-500 font-medium">Henüz masa eklenmedi</p>
          <p className="text-gray-400 text-sm mt-1">Yukarıdaki "+ Masa Ekle" butonuyla başla</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {masalar.map(masa => (
            <MasaKarti
              key={masa.id}
              masa={masa}
              slug={slug}
              aktifKisiSayisi={aktifMisafirObj?.kisiSayisi ?? 0}
              kapasiteHataId={kapasiteHataId}
              onDelete={masaSil}
              onEdit={masaDuzenle}
              onMisafirKaldir={misafirKaldir}
            />
          ))}
        </div>
      )}

      <DragOverlay>
        {aktifId && aktifMisafirObj ? (
          <MisafirChip misafir={aktifMisafirObj} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
