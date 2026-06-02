"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

type LeadDurum = "yeni" | "gorusuldu" | "teklif_gonderildi" | "kapora_bekliyor" | "kazandi" | "kaybedildi";

type Lead = {
  id: string;
  baslik: string;
  ilgiliKisi: string | null;
  telefon: string | null;
  eposta: string | null;
  etkinlikTuru: string | null;
  etkinlikTarihi: string | null;
  kisiSayisi: number | null;
  kaynak: string | null;
  durum: LeadDurum;
  not: string | null;
  seansBaslangic: string | null;
  seansBitis: string | null;
  sonGorusmeAt: string | null;
  takipAt: string | null;
  teklifGecerliAt: string | null;
  kayipNedeni: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  baslik: string;
  ilgiliKisi: string;
  telefon: string;
  eposta: string;
  etkinlikTuru: string;
  etkinlikTarihi: string;
  kisiSayisi: string;
  kaynak: string;
  durum: LeadDurum;
  not: string;
  seansBaslangic: string;
  seansBitis: string;
  takipAt: string;
  teklifGecerliAt: string;
  kayipNedeni: string;
};

const DURUMLAR: { id: LeadDurum; label: string; renk: string }[] = [
  { id: "yeni",               label: "Yeni",       renk: "bg-sky-50 text-sky-700 border-sky-100"       },
  { id: "gorusuldu",          label: "Görüşüldü",  renk: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { id: "teklif_gonderildi",  label: "Teklif",     renk: "bg-purple-50 text-purple-700 border-purple-100" },
  { id: "kapora_bekliyor",    label: "Kapora",     renk: "bg-amber-50 text-amber-700 border-amber-100"   },
  { id: "kazandi",            label: "Kazandı",    renk: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { id: "kaybedildi",         label: "Kaybedildi", renk: "bg-gray-50 text-gray-500 border-gray-100"     },
];

const BOS_FORM: FormState = {
  baslik: "", ilgiliKisi: "", telefon: "", eposta: "",
  etkinlikTuru: "", etkinlikTarihi: "", kisiSayisi: "",
  kaynak: "", durum: "yeni", not: "",
  seansBaslangic: "", seansBitis: "",
  takipAt: "", teklifGecerliAt: "", kayipNedeni: "",
};

function tarihKisa(d: string | null) {
  if (!d) return "Tarih yok";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

function inputTarihi(d: string | null) { return d ? d.slice(0, 10) : ""; }

function gunFarki(d: string | null) {
  if (!d) return null;
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const hedef = new Date(d);
  hedef.setHours(0, 0, 0, 0);
  if (Number.isNaN(hedef.getTime())) return null;
  return Math.round((hedef.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
}

function takipEtiketi(d: string | null) {
  const fark = gunFarki(d);
  if (fark === null) return null;
  if (fark < 0) return { metin: `Takip ${Math.abs(fark)} gün gecikti`, renk: "bg-red-50 text-red-700 border-red-100" };
  if (fark === 0) return { metin: "Takip bugün", renk: "bg-amber-50 text-amber-700 border-amber-100" };
  return { metin: `Takip: ${tarihKisa(d)}`, renk: "bg-emerald-50 text-emerald-700 border-emerald-100" };
}

function teklifEtiketi(d: string | null) {
  const fark = gunFarki(d);
  if (fark === null) return null;
  if (fark < 0) return { metin: "Teklif süresi geçti", renk: "bg-red-50 text-red-700 border-red-100" };
  if (fark === 0) return { metin: "Teklif bugün bitiyor", renk: "bg-purple-50 text-purple-700 border-purple-100" };
  return { metin: `Teklif geçerli: ${tarihKisa(d)}`, renk: "bg-purple-50 text-purple-700 border-purple-100" };
}

function leadFormu(l: Lead): FormState {
  return {
    baslik: l.baslik, ilgiliKisi: l.ilgiliKisi ?? "", telefon: l.telefon ?? "",
    eposta: l.eposta ?? "", etkinlikTuru: l.etkinlikTuru ?? "",
    etkinlikTarihi: inputTarihi(l.etkinlikTarihi),
    kisiSayisi: l.kisiSayisi ? String(l.kisiSayisi) : "",
    kaynak: l.kaynak ?? "", durum: l.durum, not: l.not ?? "",
    seansBaslangic: l.seansBaslangic ?? "", seansBitis: l.seansBitis ?? "",
    takipAt: inputTarihi(l.takipAt),
    teklifGecerliAt: inputTarihi(l.teklifGecerliAt),
    kayipNedeni: l.kayipNedeni ?? "",
  };
}

function payloadHazirla(f: FormState) {
  return {
    baslik: f.baslik, ilgiliKisi: f.ilgiliKisi, telefon: f.telefon,
    eposta: f.eposta, etkinlikTuru: f.etkinlikTuru, etkinlikTarihi: f.etkinlikTarihi,
    kisiSayisi: f.kisiSayisi ? Number(f.kisiSayisi) : null,
    kaynak: f.kaynak, durum: f.durum, not: f.not,
    seansBaslangic: f.seansBaslangic || null,
    seansBitis: f.seansBitis || null,
    takipAt: f.takipAt || null,
    teklifGecerliAt: f.teklifGecerliAt || null,
    kayipNedeni: f.durum === "kaybedildi" ? f.kayipNedeni : "",
  };
}

/* ── Grip icon ─────────────────────────────────────────────── */
function GripIkon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-gray-300" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5.5" cy="4"  r="1.3" /><circle cx="10.5" cy="4"  r="1.3" />
      <circle cx="5.5" cy="8"  r="1.3" /><circle cx="10.5" cy="8"  r="1.3" />
      <circle cx="5.5" cy="12" r="1.3" /><circle cx="10.5" cy="12" r="1.3" />
    </svg>
  );
}

function seansSaati(baslangic: string | null, bitis: string | null) {
  if (!baslangic) return "Tüm gün";
  return bitis ? `${baslangic} – ${bitis}` : `${baslangic}'den itibaren`;
}

/* ── Shared card body (reused in DraggableKart and DragOverlay) ─ */
function KartDetay({ lead }: { lead: Lead }) {
  const takip = takipEtiketi(lead.takipAt);
  const teklif = teklifEtiketi(lead.teklifGecerliAt);

  return (
    <div className="mt-1.5 space-y-1 text-xs font-semibold text-gray-500">
      {lead.ilgiliKisi && <p>{lead.ilgiliKisi}</p>}
      <p>{lead.etkinlikTuru || "Etkinlik türü yok"} · {tarihKisa(lead.etkinlikTarihi)}</p>
      {lead.etkinlikTarihi && (
        <p className="font-bold text-gray-600">
          🕐 {seansSaati(lead.seansBaslangic, lead.seansBitis)}
        </p>
      )}
      {lead.kisiSayisi && <p>{lead.kisiSayisi} kişi</p>}
      {lead.kaynak && <p>Kaynak: {lead.kaynak}</p>}
      {(takip || teklif) && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {takip && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${takip.renk}`}>{takip.metin}</span>}
          {teklif && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${teklif.renk}`}>{teklif.metin}</span>}
        </div>
      )}
      {lead.durum === "kaybedildi" && lead.kayipNedeni && (
        <p className="rounded-xl bg-gray-50 p-2 text-[11px] leading-relaxed text-gray-500">
          Kayıp nedeni: {lead.kayipNedeni}
        </p>
      )}
    </div>
  );
}

/* ── Draggable card ─────────────────────────────────────────── */
function DraggableKart({
  lead,
  onDuzenle,
  onSil,
  onDurumDegistir,
}: {
  lead: Lead;
  onDuzenle: (lead: Lead) => void;
  onSil: (lead: Lead) => void;
  onDurumDegistir: (lead: Lead, durum: LeadDurum) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });

  return (
    <article
      ref={setNodeRef}
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-opacity ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        className="flex cursor-grab items-start gap-1.5 px-3 pt-3 pb-2 active:cursor-grabbing"
      >
        <GripIkon />
        <p className="line-clamp-2 text-sm font-black leading-tight text-gray-950">{lead.baslik}</p>
      </div>

      <div className="px-3 pb-3">
        <KartDetay lead={lead} />

        {lead.not && (
          <p className="mt-2 line-clamp-3 rounded-xl bg-gray-50 p-2 text-xs leading-relaxed text-gray-500">
            {lead.not}
          </p>
        )}

        <div className="mt-3 space-y-2">
          <select
            value={lead.durum}
            onChange={e => onDurumDegistir(lead, e.target.value as LeadDurum)}
            className="w-full rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-bold text-gray-700 outline-none focus:border-purple-300"
          >
            {DURUMLAR.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => onDuzenle(lead)}
              className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-1.5 text-xs font-black text-gray-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
            >
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Düzenle
            </button>
            <button
              type="button"
              onClick={() => onSil(lead)}
              className="flex w-8 shrink-0 items-center justify-center rounded-xl border border-red-100 py-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Droppable column ───────────────────────────────────────── */
function DroppableKolon({
  id, label, renk, count, children,
}: {
  id: string; label: string; renk: string; count: number; children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border p-3 transition-colors ${
        isOver ? "border-purple-300 bg-purple-50/50" : "border-gray-100 bg-gray-50"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${renk}`}>{label}</span>
        <span className="text-xs font-black text-gray-400">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function PartnerLeadCRM({ leadler: baslangicLeadler }: { leadler: Lead[] }) {
  const router = useRouter();
  const [leadler, setLeadler]           = useState<Lead[]>(baslangicLeadler);
  const [form, setForm]                 = useState<FormState>(BOS_FORM);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [hata, setHata]                 = useState("");
  const [bilgi, setBilgi]               = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [formAcik, setFormAcik]         = useState(false);
  const [notKapatildi, setNotKapatildi] = useState(false);
  const [aktifLead, setAktifLead]       = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  useEffect(() => {
    if (localStorage.getItem("crm-not-kapatildi") === "1") setNotKapatildi(true);
  }, []);

  useEffect(() => { setLeadler(baslangicLeadler); }, [baslangicLeadler]);

  const notiKapat = () => { setNotKapatildi(true); localStorage.setItem("crm-not-kapatildi", "1"); };

  const ozet = useMemo(() => ({
    toplam:    leadler.length,
    aktif:     leadler.filter(l => !["kazandi", "kaybedildi"].includes(l.durum)).length,
    teklif:    leadler.filter(l => ["teklif_gonderildi", "kapora_bekliyor"].includes(l.durum)).length,
    kazanilan: leadler.filter(l => l.durum === "kazandi").length,
  }), [leadler]);

  const kolonlar = useMemo(
    () => DURUMLAR.map(d => ({ ...d, leadler: leadler.filter(l => l.durum === d.id) })),
    [leadler],
  );

  const guncelle = <K extends keyof FormState>(alan: K, deger: FormState[K]) =>
    setForm(prev => ({ ...prev, [alan]: deger }));

  const formuTemizle = () => { setForm(BOS_FORM); setDuzenlenenId(null); setHata(""); setFormAcik(false); };

  const duzenlemeBaslat = (lead: Lead) => {
    setDuzenlenenId(lead.id); setForm(leadFormu(lead)); setHata(""); setBilgi(""); setFormAcik(true);
  };

  const kaydet = async () => {
    setHata(""); setBilgi("");
    if (form.baslik.trim().length < 2) { setHata("Lead başlığı en az 2 karakter olmalı."); return; }
    setKaydediliyor(true);
    try {
      const res = await fetch("/api/partner/leadler", {
        method: duzenlenenId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duzenlenenId ? { id: duzenlenenId, ...payloadHazirla(form) } : payloadHazirla(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Lead kaydedilemedi.");
      setLeadler(prev => {
        const lead = data.lead as Lead;
        return [lead, ...prev.filter(l => l.id !== lead.id)]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
      setBilgi(duzenlenenId ? "Lead güncellendi." : "Yeni lead eklendi.");
      formuTemizle();
      router.refresh();
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Lead kaydedilemedi.");
    } finally {
      setKaydediliyor(false);
    }
  };

  const durumDegistir = async (lead: Lead, durum: LeadDurum) => {
    setLeadler(prev => prev.map(l => l.id === lead.id ? { ...l, durum } : l));
    try {
      const res = await fetch("/api/partner/leadler", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, durum }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Durum güncellenemedi.");
      setLeadler(prev => prev.map(l => l.id === lead.id ? data.lead : l));
      router.refresh();
    } catch (err) {
      setLeadler(prev => prev.map(l => l.id === lead.id ? { ...l, durum: lead.durum } : l));
      setHata(err instanceof Error ? err.message : "Durum güncellenemedi.");
    }
  };

  const sil = async (lead: Lead) => {
    if (!confirm(`${lead.baslik} kaydı silinsin mi?`)) return;
    setHata(""); setBilgi("");
    try {
      const res = await fetch("/api/partner/leadler", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.hata || "Lead silinemedi.");
      setLeadler(prev => prev.filter(l => l.id !== lead.id));
      if (duzenlenenId === lead.id) formuTemizle();
      setBilgi("Lead silindi.");
      router.refresh();
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Lead silinemedi.");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leadler.find(l => l.id === event.active.id);
    setAktifLead(lead ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setAktifLead(null);
    const { active, over } = event;
    if (!over) return;
    const lead = leadler.find(l => l.id === active.id);
    if (!lead || lead.durum === (over.id as string)) return;
    durumDegistir(lead, over.id as LeadDurum);
  };

  const formGorunur = formAcik || duzenlenenId !== null;

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-500">Lead CRM</p>
          <h2 className="mt-2 text-2xl font-black text-gray-950">Müşteri adaylarını takip et</h2>
        </div>
        <button
          type="button"
          onClick={() => formGorunur ? formuTemizle() : (setForm(BOS_FORM), setDuzenlenenId(null), setFormAcik(true))}
          className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition-all ${
            formGorunur
              ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              : "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-200 hover:opacity-90"
          }`}
        >
          {formGorunur ? "Vazgeç" : "+ Müşteri ekle"}
        </button>
      </div>

      {/* Özet */}
      {leadler.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Toplam lead",   value: ozet.toplam    },
            { label: "Aktif takip",   value: ozet.aktif     },
            { label: "Teklif süreci", value: ozet.teklif    },
            { label: "Kazanılan",     value: ozet.kazanilan },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-2xl font-black text-gray-950">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Güvenli kullanım notu */}
      {!notKapatildi && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/60 p-4 text-sm text-purple-900">
          <p className="flex-1 leading-relaxed">
            <span className="font-black">Güvenli kullanım: </span>
            Bu alan satış takibi içindir. TCKN, sağlık bilgisi veya ödeme kartı verisi kaydetmeyin.
          </p>
          <button type="button" onClick={notiKapat}
            className="mt-0.5 shrink-0 rounded-lg px-2 py-1 text-xs font-black text-purple-500 hover:bg-purple-100">
            Kapat
          </button>
        </div>
      )}

      {/* Form */}
      {formGorunur && (
        <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <p className="font-black text-gray-950">{duzenlenenId ? "Lead düzenle" : "Yeni lead"}</p>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Lead başlığı</span>
              <input value={form.baslik} onChange={e => guncelle("baslik", e.target.value)}
                placeholder="Örn. Haziran düğünü - Salon A" maxLength={120}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">İlgili kişi</span>
                <input value={form.ilgiliKisi} onChange={e => guncelle("ilgiliKisi", e.target.value)}
                  placeholder="Opsiyonel" maxLength={120}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Durum</span>
                <select value={form.durum} onChange={e => guncelle("durum", e.target.value as LeadDurum)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100">
                  {DURUMLAR.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Telefon</span>
                <input value={form.telefon} onChange={e => guncelle("telefon", e.target.value)}
                  placeholder="+90..." maxLength={30}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">E-posta</span>
                <input value={form.eposta} onChange={e => guncelle("eposta", e.target.value)}
                  placeholder="Opsiyonel" maxLength={160}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Etkinlik tarihi</span>
                <input type="date" value={form.etkinlikTarihi} onChange={e => guncelle("etkinlikTarihi", e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Kişi sayısı</span>
                <input type="number" value={form.kisiSayisi} onChange={e => guncelle("kisiSayisi", e.target.value)}
                  placeholder="250" min={1} max={10000}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
            </div>

            {/* Seans saatleri */}
            {form.etkinlikTarihi && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5">
                <div className="mb-2.5 flex items-start gap-2">
                  <span className="mt-0.5 text-base leading-none">🕐</span>
                  <div>
                    <p className="text-xs font-black text-gray-800">Seans saatleri <span className="font-semibold text-gray-400">(opsiyonel)</span></p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                      Boş bırakırsanız tüm gün kapalı sayılır. Aynı güne birden fazla seans ekleyecekseniz her seansı ayrı lead olarak girin — çakışma kontrolü saate göre yapılır.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="text-[11px] font-bold text-gray-500">Başlangıç</span>
                    <input
                      type="time"
                      value={form.seansBaslangic}
                      onChange={e => guncelle("seansBaslangic", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-gray-500">Bitiş</span>
                    <input
                      type="time"
                      value={form.seansBitis}
                      onChange={e => guncelle("seansBitis", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                    />
                  </label>
                </div>
                {form.seansBaslangic && !form.seansBitis && (
                  <p className="mt-2 text-[11px] font-semibold text-amber-600">Bitiş saati girilmezse çakışma tespiti için tüm gün kapalı sayılır.</p>
                )}
                {form.seansBaslangic && form.seansBitis && form.seansBitis <= form.seansBaslangic && (
                  <p className="mt-2 text-[11px] font-semibold text-red-600">Bitiş saati başlangıç saatinden büyük olmalı.</p>
                )}
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Sonraki takip tarihi</span>
                <input type="date" value={form.takipAt} onChange={e => guncelle("takipAt", e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
                <span className="mt-1 block text-[11px] font-semibold text-gray-400">Arama veya WhatsApp dönüşünü planlamak için.</span>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Teklif geçerlilik tarihi</span>
                <input type="date" value={form.teklifGecerliAt} onChange={e => guncelle("teklifGecerliAt", e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
                <span className="mt-1 block text-[11px] font-semibold text-gray-400">Fiyat veya kapsamın ne zamana kadar geçerli olduğunu belirtir.</span>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Etkinlik türü</span>
                <input value={form.etkinlikTuru} onChange={e => guncelle("etkinlikTuru", e.target.value)}
                  placeholder="Düğün, nişan..." maxLength={60}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Kaynak</span>
                <input value={form.kaynak} onChange={e => guncelle("kaynak", e.target.value)}
                  placeholder="Instagram, referans..." maxLength={60}
                  className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-gray-500">Kısa not</span>
              <textarea value={form.not} onChange={e => guncelle("not", e.target.value)} rows={3}
                placeholder="Örn. 300 kişilik organizasyon, canlı duvar ilgisini çekti." maxLength={500}
                className="mt-1 min-h-24 w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
              <span className="mt-1 block text-right text-[11px] font-semibold text-gray-400">{form.not.length}/500</span>
            </label>
            {form.durum === "kaybedildi" && (
              <label className="block">
                <span className="text-xs font-bold text-gray-500">Kayıp nedeni</span>
                <textarea value={form.kayipNedeni} onChange={e => guncelle("kayipNedeni", e.target.value)} rows={2}
                  placeholder="Örn. Bütçe uygun değil, tarih dolu, rakip teklifi seçildi." maxLength={240}
                  className="mt-1 min-h-20 w-full resize-none rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100" />
                <span className="mt-1 block text-right text-[11px] font-semibold text-gray-400">{form.kayipNedeni.length}/240</span>
              </label>
            )}
            {hata && <p className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{hata}</p>}
            {bilgi && <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">{bilgi}</p>}
            <button type="button" onClick={kaydet} disabled={kaydediliyor}
              className="w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-purple-200 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {kaydediliyor ? "Kaydediliyor..." : duzenlenenId ? "Lead'i güncelle" : "Lead ekle"}
            </button>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {leadler.length === 0 && !formGorunur && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">👥</div>
          <h3 className="text-base font-black text-gray-900">Henüz müşteri adayı yok</h3>
          <p className="mt-2 text-sm text-gray-500">Görüştüğünüz salonu veya organizasyonu ekleyerek takip etmeye başlayın.</p>
          <button type="button"
            onClick={() => { setForm(BOS_FORM); setDuzenlenenId(null); setFormAcik(true); }}
            className="mt-5 rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-black text-white shadow-sm shadow-purple-200 transition-opacity hover:opacity-90">
            İlk müşteriyi ekle
          </button>
        </div>
      )}

      {/* Kanban */}
      {leadler.length > 0 && (
        <div className="mt-5 overflow-x-auto pb-2">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid min-w-230 grid-cols-6 gap-3">
              {kolonlar.map(kolon => (
                <DroppableKolon
                  key={kolon.id}
                  id={kolon.id}
                  label={kolon.label}
                  renk={kolon.renk}
                  count={kolon.leadler.length}
                >
                  {kolon.leadler.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-3 text-xs font-semibold leading-relaxed text-gray-400">
                      Bu aşamada lead yok.
                    </div>
                  ) : (
                    kolon.leadler.map(lead => (
                      <DraggableKart
                        key={lead.id}
                        lead={lead}
                        onDuzenle={duzenlemeBaslat}
                        onSil={sil}
                        onDurumDegistir={durumDegistir}
                      />
                    ))
                  )}
                </DroppableKolon>
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {aktifLead ? (
                <article className="w-48 rotate-1 overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-2xl shadow-purple-200/60">
                  <div className="flex items-start gap-1.5 px-3 pt-3 pb-2">
                    <GripIkon />
                    <p className="line-clamp-2 text-sm font-black leading-tight text-gray-950">{aktifLead.baslik}</p>
                  </div>
                  <div className="px-3 pb-3">
                    <KartDetay lead={aktifLead} />
                  </div>
                </article>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </section>
  );
}
