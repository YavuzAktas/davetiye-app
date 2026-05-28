import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* ── Türkçe karakter desteği — dosyadan okur, network gerekmez ── */
Font.register({
  family: "NotoSans",
  fonts: [
    { src: path.resolve(process.cwd(), "public/fonts/NotoSans-Regular.ttf"), fontWeight: "normal" },
    { src: path.resolve(process.cwd(), "public/fonts/NotoSans-Bold.ttf"),    fontWeight: "bold"   },
  ],
});

export type AniKitabiVeri = {
  baslik: string;
  kisi1: string | null;
  kisi2: string | null;
  tarih: string | null;
  mekan: string | null;
  etkinlikTur: string;
  renk: string;
  fotolar: { id: string; yukleyenAd: string; dosyaUrl: string; createdAt: string }[];
  anilar: { id: string; yazarAd: string; icerik: string; createdAt: string }[];
  sesliAnilar: { id: string; adSoyad: string; sure: number; createdAt: string }[];
};

const CHUNK = 6; // photos per page (2 cols × 3 rows)
const ANILER_PER_PAGE = 3;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lightBg(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => Math.round(c * 0.15 + 255 * 0.85);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function sureyiMetne(sn: number): string {
  const d = Math.floor(sn / 60);
  const s = sn % 60;
  return d > 0 ? `${d}d ${s}s` : `${s}s`;
}

function tarihFormatla(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const S = StyleSheet.create({
  /* Layout */
  page: { fontFamily: "NotoSans", padding: 0 },
  pageContent: { fontFamily: "NotoSans", padding: 40, backgroundColor: "#ffffff" },

  /* Cover */
  coverPage: { fontFamily: "NotoSans", padding: 0 },
  coverTop: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 48 },
  coverBottom: { paddingHorizontal: 48, paddingBottom: 32, alignItems: "center" },

  coverLabel: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 32,
    opacity: 0.65,
  },
  coverTitle: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 1.2,
    marginBottom: 8,
  },
  coverNames: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.85,
  },
  coverDivider: { width: 60, height: 2, marginVertical: 20, opacity: 0.4 },
  coverDetail: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 4,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  coverBranding: { fontSize: 8, opacity: 0.35, letterSpacing: 2, textTransform: "uppercase" },

  /* Section header */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  sectionCount: { fontSize: 10, color: "#9ca3af", marginLeft: 8, marginTop: 3 },
  sectionLine: { flex: 1, height: 1, marginLeft: 12, backgroundColor: "#f3f4f6" },

  /* Photos */
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  photoCell: { width: "47.5%", marginBottom: 4 },
  photoImg: { width: "100%", height: 140, objectFit: "cover", borderRadius: 6 },
  photoCaption: { fontSize: 8, color: "#6b7280", marginTop: 4 },
  photoDate: { fontSize: 7, color: "#9ca3af", marginTop: 1 },

  /* Memories */
  memoryCard: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeft: "3px solid #e5e7eb",
  },
  memoryAuthor: { fontSize: 9, fontWeight: "bold", color: "#374151", marginBottom: 6 },
  memoryText: { fontSize: 10, color: "#4b5563", lineHeight: 1.55 },
  memoryDate: { fontSize: 7, color: "#9ca3af", marginTop: 6 },

  /* Voice */
  voiceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottom: "1px solid #f3f4f6",
  },
  voiceDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  voiceName: { flex: 1, fontSize: 10, color: "#374151", fontWeight: "bold" },
  voiceDur: { fontSize: 9, color: "#9ca3af" },
  voiceDate: { fontSize: 8, color: "#d1d5db", marginLeft: 10 },
});

/* ── Kapak Sayfası ── */
function Kapak({ v }: { v: AniKitabiVeri }) {
  const bg = v.renk;
  const light = lightBg(v.renk);

  return (
    <Page size="A4" style={S.coverPage}>
      {/* Renkli üst alan */}
      <View style={{ backgroundColor: bg, flex: 1, alignItems: "center", justifyContent: "center", padding: 48 }}>
        {/* Dekoratif iç çerçeve */}
        <View style={{ position: "absolute", top: 20, left: 20, right: 20, bottom: 20, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 4 }} />

        <Text style={[S.coverLabel, { color: "#ffffff" }]}>Anı Kitabı</Text>

        <Text style={[S.coverTitle, { color: "#ffffff" }]}>{v.baslik}</Text>

        {(v.kisi1 || v.kisi2) && (
          <Text style={[S.coverNames, { color: "#ffffff" }]}>
            {[v.kisi1, v.kisi2].filter(Boolean).join(" & ")}
          </Text>
        )}

        <View style={[S.coverDivider, { backgroundColor: "#ffffff" }]} />

        {v.tarih && (
          <Text style={[S.coverDetail, { color: "#ffffff" }]}>
            {tarihFormatla(v.tarih)}
          </Text>
        )}
        {v.mekan && (
          <Text style={[S.coverDetail, { color: "#ffffff" }]}>{v.mekan}</Text>
        )}

        {/* İstatistikler */}
        <View style={{ flexDirection: "row", gap: 24, marginTop: 32 }}>
          {v.fotolar.length > 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffffff" }}>{v.fotolar.length}</Text>
              <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>FOTOĞRAF</Text>
            </View>
          )}
          {v.anilar.length > 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffffff" }}>{v.anilar.length}</Text>
              <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>ANI</Text>
            </View>
          )}
          {v.sesliAnilar.length > 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffffff" }}>{v.sesliAnilar.length}</Text>
              <Text style={{ fontSize: 7, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>SESLİ ANI</Text>
            </View>
          )}
        </View>
      </View>

      {/* Beyaz alt şerit */}
      <View style={{ backgroundColor: "#ffffff", paddingVertical: 16, paddingHorizontal: 48, alignItems: "center" }}>
        <Text style={[S.coverBranding, { color: "#9ca3af" }]}>bekleriz.com</Text>
      </View>
    </Page>
  );
}

/* ── Fotoğraf Sayfaları ── */
function FotografSayfasi({ fotolar, renk, sayfa, toplam }: {
  fotolar: AniKitabiVeri["fotolar"];
  renk: string;
  sayfa: number;
  toplam: number;
}) {
  return (
    <Page size="A4" style={S.pageContent}>
      {/* Header */}
      <View style={S.sectionHeader}>
        <View style={{ width: 3, height: 20, backgroundColor: renk, borderRadius: 2, marginRight: 10 }} />
        <Text style={S.sectionTitle}>Fotoğraflar</Text>
        <Text style={S.sectionCount}>{toplam} fotoğraf</Text>
        <View style={S.sectionLine} />
        <Text style={{ fontSize: 8, color: "#d1d5db" }}>{sayfa}</Text>
      </View>

      {/* Grid */}
      <View style={S.photoGrid}>
        {fotolar.map((f) => (
          <View key={f.id} style={S.photoCell}>
            <Image src={f.dosyaUrl} style={S.photoImg} />
            <Text style={S.photoCaption}>{f.yukleyenAd}</Text>
            <Text style={S.photoDate}>{tarihFormatla(f.createdAt)}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

/* ── Anı Sayfası ── */
function AniSayfasi({ anilar, renk, sayfa, toplam }: {
  anilar: AniKitabiVeri["anilar"];
  renk: string;
  sayfa: number;
  toplam: number;
}) {
  return (
    <Page size="A4" style={S.pageContent}>
      <View style={S.sectionHeader}>
        <View style={{ width: 3, height: 20, backgroundColor: renk, borderRadius: 2, marginRight: 10 }} />
        <Text style={S.sectionTitle}>Yazılı Anılar</Text>
        <Text style={S.sectionCount}>{toplam} anı</Text>
        <View style={S.sectionLine} />
        <Text style={{ fontSize: 8, color: "#d1d5db" }}>{sayfa}</Text>
      </View>

      {anilar.map((a) => (
        <View key={a.id} style={[S.memoryCard, { borderLeftColor: renk }]}>
          <Text style={[S.memoryAuthor, { color: renk }]}>{a.yazarAd}</Text>
          <Text style={S.memoryText}>{a.icerik}</Text>
          <Text style={S.memoryDate}>{tarihFormatla(a.createdAt)}</Text>
        </View>
      ))}
    </Page>
  );
}

/* ── Sesli Anı Sayfası ── */
function SesliAniSayfasi({ sesliAnilar, renk }: { sesliAnilar: AniKitabiVeri["sesliAnilar"]; renk: string }) {
  return (
    <Page size="A4" style={S.pageContent}>
      <View style={S.sectionHeader}>
        <View style={{ width: 3, height: 20, backgroundColor: renk, borderRadius: 2, marginRight: 10 }} />
        <Text style={S.sectionTitle}>Sesli Anılar</Text>
        <Text style={S.sectionCount}>{sesliAnilar.length} ses kaydı</Text>
        <View style={S.sectionLine} />
      </View>

      <Text style={{ fontSize: 9, color: "#9ca3af", marginBottom: 16 }}>
        Sesli anıları dinlemek için davetiye sayfanızı ziyaret edin.
      </Text>

      {sesliAnilar.map((s, i) => (
        <View key={s.id} style={S.voiceRow}>
          <View style={[S.voiceDot, { backgroundColor: renk }]} />
          <Text style={{ fontSize: 9, color: "#9ca3af", marginRight: 10 }}>{i + 1}.</Text>
          <Text style={S.voiceName}>{s.adSoyad}</Text>
          <Text style={S.voiceDur}>{sureyiMetne(s.sure)}</Text>
          <Text style={S.voiceDate}>{tarihFormatla(s.createdAt)}</Text>
        </View>
      ))}
    </Page>
  );
}

/* ── Ana Döküman ── */
export function AniKitabiPDF({ v }: { v: AniKitabiVeri }) {
  const fotografChunks = chunk(v.fotolar, CHUNK);
  const aniChunks = chunk(v.anilar, ANILER_PER_PAGE);

  return (
    <Document
      title={`${v.baslik} — Anı Kitabı`}
      author="Bekleriz"
      subject="Etkinlik Anı Kitabı"
    >
      <Kapak v={v} />

      {fotografChunks.map((grp, i) => (
        <FotografSayfasi
          key={`foto-${i}`}
          fotolar={grp}
          renk={v.renk}
          sayfa={i + 1}
          toplam={v.fotolar.length}
        />
      ))}

      {aniChunks.map((grp, i) => (
        <AniSayfasi
          key={`ani-${i}`}
          anilar={grp}
          renk={v.renk}
          sayfa={i + 1}
          toplam={v.anilar.length}
        />
      ))}

      {v.sesliAnilar.length > 0 && (
        <SesliAniSayfasi sesliAnilar={v.sesliAnilar} renk={v.renk} />
      )}
    </Document>
  );
}
