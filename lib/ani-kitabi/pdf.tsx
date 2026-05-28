import path from "path";
import {
  Document, Page, Text, View, Image, StyleSheet, Font,
} from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    { src: path.resolve(process.cwd(), "public/fonts/NotoSans-Regular.ttf"), fontWeight: "normal" },
    { src: path.resolve(process.cwd(), "public/fonts/NotoSans-Bold.ttf"),    fontWeight: "bold"   },
  ],
});

/* ─── Types ─── */
export type AniKitabiVeri = {
  baslik:      string;
  kisi1:       string | null;
  kisi2:       string | null;
  tarih:       string | null;
  mekan:       string | null;
  etkinlikTur: string;
  renk:        string;
  fotolar: {
    id: string; yukleyenAd: string;
    dosyaUrl: string; imageData: string | null; createdAt: string;
  }[];
  anilar: { id: string; yazarAd: string; icerik: string; createdAt: string }[];
  sesliAnilar: { id: string; adSoyad: string; sure: number; createdAt: string }[];
};

/* ─── Helpers ─── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function darken(hex: string, t: number): string {
  const [r,g,b] = hexToRgb(hex);
  return `#${[r,g,b].map(c => Math.max(0, Math.round(c*(1-t))).toString(16).padStart(2,"0")).join("")}`;
}
function lighten(hex: string, t: number): string {
  const [r,g,b] = hexToRgb(hex);
  return `#${[r,g,b].map(c => Math.min(255,Math.round(c+(255-c)*t)).toString(16).padStart(2,"0")).join("")}`;
}
function tarih(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric" });
}
function sure(sn: number) {
  const m = Math.floor(sn/60), s = sn%60;
  return m > 0 ? `${m}d ${s}s` : `${s}s`;
}
function chunks<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i+n));
  return out;
}

const F = "NotoSans";

/* ─── Styles ─── */
// A4: 595 × 842 pt
const S = StyleSheet.create({
  // ── Cover ──────────────────────────────────────────────
  cover: { fontFamily: F, position: "relative" },
  coverBg:      { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  coverDark:    { position: "absolute", top: 0, left: 0, right: 0, height: 180 },
  coverBorder:  { position: "absolute", top: 18, left: 18, right: 18, bottom: 18, borderWidth: 0.5, borderColor: "rgba(255,255,255,0.14)" },
  coverTopLine: { position: "absolute", top: 0, left: 0, right: 0, height: 3 },

  coverBody:      { paddingTop: 96, paddingHorizontal: 50, alignItems: "center" },
  coverEyebrow:   { fontSize: 7, letterSpacing: 4, color: "rgba(255,255,255,0.42)", textTransform: "uppercase", marginBottom: 22 },
  coverKisi1:     { fontSize: 22, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
  coverAmpersand: { fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center", marginVertical: 4 },
  coverKisi2:     { fontSize: 22, fontWeight: "bold", color: "#ffffff", textAlign: "center" },
  coverTitleOnly: { fontSize: 26, fontWeight: "bold", color: "#ffffff", textAlign: "center", lineHeight: 1.22 },
  coverRule:      { width: 28, height: 1, backgroundColor: "rgba(255,255,255,0.25)", marginVertical: 18 },
  coverMeta:      { fontSize: 9, color: "rgba(255,255,255,0.50)", textAlign: "center", marginBottom: 4 },

  coverStats:     { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 44, paddingTop: 24, borderTopWidth: 0.5, borderTopColor: "rgba(255,255,255,0.12)" },
  coverStatBlock: { alignItems: "center", paddingHorizontal: 28 },
  coverStatNum:   { fontSize: 22, fontWeight: "bold", color: "#ffffff" },
  coverStatLbl:   { fontSize: 7, color: "rgba(255,255,255,0.38)", textTransform: "uppercase", marginTop: 3 },
  coverStatSep:   { width: 0.5, height: 22, backgroundColor: "rgba(255,255,255,0.13)" },

  coverBranding: { position: "absolute", bottom: 24, left: 0, right: 0, fontSize: 7, color: "rgba(255,255,255,0.25)", letterSpacing: 2.5, textTransform: "uppercase", textAlign: "center" },

  // ── Content page ───────────────────────────────────────
  page: { fontFamily: F, backgroundColor: "#ffffff" },

  phRow:  { paddingHorizontal: 36, paddingTop: 20, paddingBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  phSec:  { fontSize: 6.5, textTransform: "uppercase" },
  phNum:  { fontSize: 7, color: "#c8c8d8" },
  phLine: { marginHorizontal: 36, height: 0.5, backgroundColor: "#eeeff4" },

  // Section badge — replaces full SectionIntro page
  badge:       { marginHorizontal: 28, marginTop: 11, marginBottom: 6, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  badgeLbl:    { fontSize: 7.5, fontWeight: "bold", textTransform: "uppercase" },
  badgeCount:  { fontSize: 7, opacity: 0.48 },
  badgeAccent: { position: "absolute", top: 0, left: 0, bottom: 0, width: 3 },

  // ── Photo ──────────────────────────────────────────────
  photoWrap:   { marginHorizontal: 28, marginTop: 8, borderWidth: 1 },
  photoImgFirst: { width: "100%", height: 570, objectFit: "contain" },
  photoImgRest:  { width: "100%", height: 628, objectFit: "contain" },
  photoPlaceholder: { width: "100%", alignItems: "center", justifyContent: "center" },
  photoCap:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 12, paddingVertical: 9, borderTopWidth: 0.5 },
  photoName:   { fontSize: 8, fontWeight: "bold", letterSpacing: 0.4 },
  photoDate:   { fontSize: 7.5, color: "#b8b8cc" },

  // ── Memories ───────────────────────────────────────────
  aniBody:        { paddingHorizontal: 44, paddingTop: 4 },
  aniItem:        { paddingVertical: 20 },
  aniItemBorder:  { paddingVertical: 20, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f6" },
  aniQuote:       { fontSize: 44, fontWeight: "bold", lineHeight: 1, marginBottom: -4 },
  aniText:        { fontSize: 10.5, color: "#242436", lineHeight: 1.72 },
  aniFooter:      { flexDirection: "row", alignItems: "center", marginTop: 10 },
  aniLine:        { flex: 1, height: 0.5, marginRight: 8 },
  aniAuthor:      { fontSize: 7.5, fontWeight: "bold", textTransform: "uppercase" },
  aniDate:        { fontSize: 7, color: "#b8b8cc", textAlign: "right", marginTop: 2 },

  // ── Voice ──────────────────────────────────────────────
  voiceBody: { paddingHorizontal: 44, paddingTop: 4 },
  voiceNote: { fontSize: 8.5, color: "#a8a8b8", lineHeight: 1.5, marginBottom: 18 },
  voiceRow:  { flexDirection: "row", alignItems: "center", paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: "#f2f2f8" },
  voiceIdx:  { fontSize: 8, color: "#d0d0e0", width: 22, fontWeight: "bold" },
  voiceDot:  { width: 5, height: 5, borderRadius: 3, marginRight: 10 },
  voiceName: { flex: 1, fontSize: 10, fontWeight: "bold", color: "#1a1a2c" },
  voiceDur:  { fontSize: 8.5, color: "#8888a0", marginRight: 12 },
  voiceDate: { fontSize: 7.5, color: "#c8c8d8" },
});

/* ─── Page Header ─── */
function PageHdr({ section, n, renk }: { section: string; n: number; renk: string }) {
  return (
    <>
      <View style={S.phRow}>
        <Text style={[S.phSec, { color: renk }]}>{section}</Text>
        <Text style={S.phNum}>{n}</Text>
      </View>
      <View style={S.phLine} />
    </>
  );
}

/* ─── Section Badge (replaces full intro page) ─── */
function SectionBadge({ label, count, renk }: { label: string; count: string; renk: string }) {
  return (
    <View style={[S.badge, { backgroundColor: lighten(renk, 0.93) }]}>
      <View style={[S.badgeAccent, { backgroundColor: renk }]} />
      <Text style={[S.badgeLbl, { color: renk, marginLeft: 8 }]}>{label}</Text>
      <Text style={[S.badgeCount, { color: renk }]}>{count}</Text>
    </View>
  );
}

/* ─── Cover ─── */
function Kapak({ v }: { v: AniKitabiVeri }) {
  const bg  = v.renk;
  const bg2 = darken(v.renk, 0.18);

  const hasBothKisi = v.kisi1 && v.kisi2;

  const statlar = [
    v.fotolar.length > 0    && { n: v.fotolar.length,     l: "Fotoğraf"  },
    v.anilar.length > 0     && { n: v.anilar.length,      l: "Anı"       },
    v.sesliAnilar.length > 0 && { n: v.sesliAnilar.length, l: "Ses Kaydı" },
  ].filter(Boolean) as { n: number; l: string }[];

  return (
    <Page size="A4" style={S.cover}>
      {/* Full-page colored background */}
      <View style={[S.coverBg, { backgroundColor: bg }]} />
      {/* Darker top strip for depth */}
      <View style={[S.coverDark, { backgroundColor: bg2 }]} />
      {/* Top accent line (lighter) */}
      <View style={[S.coverTopLine, { backgroundColor: lighten(bg, 0.22) }]} />
      {/* Inner border */}
      <View style={S.coverBorder} />

      {/* Content */}
      <View style={S.coverBody}>
        <Text style={S.coverEyebrow}>Anı Kitabı</Text>
        <View style={S.coverRule} />

        {hasBothKisi ? (
          <>
            <Text style={S.coverKisi1}>{v.kisi1}</Text>
            <Text style={S.coverAmpersand}>&amp;</Text>
            <Text style={S.coverKisi2}>{v.kisi2}</Text>
          </>
        ) : (
          <Text style={S.coverTitleOnly}>{v.baslik}</Text>
        )}

        <View style={S.coverRule} />

        {v.tarih && <Text style={S.coverMeta}>{tarih(v.tarih)}</Text>}
        {v.mekan  && <Text style={S.coverMeta}>{v.mekan}</Text>}

        {statlar.length > 0 && (
          <View style={S.coverStats}>
            {statlar.map((st, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                {i > 0 && <View style={S.coverStatSep} />}
                <View style={S.coverStatBlock}>
                  <Text style={S.coverStatNum}>{st.n}</Text>
                  <Text style={S.coverStatLbl}>{st.l}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <Text style={S.coverBranding}>bekleriz.com</Text>
    </Page>
  );
}

/* ─── Single Photo Page ─── */
function FotoSayfasi({ foto, renk, pageN, isFirst, totalFotos }: {
  foto: AniKitabiVeri["fotolar"][0]; renk: string; pageN: number; isFirst: boolean; totalFotos: number;
}) {
  const imgStyle = isFirst ? S.photoImgFirst : S.photoImgRest;
  const placeholderH = isFirst ? 570 : 628;

  return (
    <Page size="A4" style={S.page}>
      <PageHdr section={isFirst ? "Fotoğraflar" : foto.yukleyenAd} n={pageN} renk={renk} />
      {isFirst && (
        <SectionBadge
          label="Fotoğraflar"
          count={`${totalFotos} fotoğraf`}
          renk={renk}
        />
      )}
      <View style={[S.photoWrap, { borderColor: renk + "28" }]}>
        {foto.imageData ? (
          <Image src={foto.imageData} style={imgStyle} />
        ) : (
          <View style={[S.photoPlaceholder, { height: placeholderH, backgroundColor: lighten(renk, 0.92) }]}>
            <Text style={{ fontSize: 9, color: renk + "70" }}>Fotoğraf yüklenemedi</Text>
          </View>
        )}
        <View style={[S.photoCap, { borderTopColor: renk + "20" }]}>
          <Text style={[S.photoName, { color: renk }]}>{foto.yukleyenAd}</Text>
          <Text style={S.photoDate}>{tarih(foto.createdAt)}</Text>
        </View>
      </View>
    </Page>
  );
}

/* ─── Memories Page ─── */
function AnilarSayfasi({ anilar, renk, pageN, isFirst, totalAnilar }: {
  anilar: AniKitabiVeri["anilar"]; renk: string; pageN: number; isFirst: boolean; totalAnilar: number;
}) {
  return (
    <Page size="A4" style={S.page}>
      <PageHdr section="Yazılı Anılar" n={pageN} renk={renk} />
      {isFirst && (
        <SectionBadge
          label="Yazılı Anılar"
          count={`${totalAnilar} anı`}
          renk={renk}
        />
      )}
      <View style={S.aniBody}>
        {anilar.map((a, i) => (
          <View key={a.id} style={i < anilar.length - 1 ? S.aniItemBorder : S.aniItem}>
            <Text style={[S.aniQuote, { color: renk + "55" }]}>&ldquo;</Text>
            <Text style={S.aniText}>{a.icerik}</Text>
            <View style={S.aniFooter}>
              <View style={[S.aniLine, { backgroundColor: renk + "35" }]} />
              <Text style={[S.aniAuthor, { color: renk }]}>{a.yazarAd}</Text>
            </View>
            <Text style={S.aniDate}>{tarih(a.createdAt)}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

/* ─── Voice Page ─── */
function SesliAnilarSayfasi({ sesliAnilar, renk, pageN }: {
  sesliAnilar: AniKitabiVeri["sesliAnilar"]; renk: string; pageN: number;
}) {
  return (
    <Page size="A4" style={S.page}>
      <PageHdr section="Sesli Anılar" n={pageN} renk={renk} />
      <SectionBadge
        label="Sesli Anılar"
        count={`${sesliAnilar.length} kayıt`}
        renk={renk}
      />
      <View style={S.voiceBody}>
        <Text style={S.voiceNote}>
          Sesli anıları dinlemek için davetiye sayfanızı ziyaret edin.
        </Text>
        {sesliAnilar.map((s, i) => (
          <View key={s.id} style={S.voiceRow}>
            <Text style={S.voiceIdx}>{String(i + 1).padStart(2, "0")}</Text>
            <View style={[S.voiceDot, { backgroundColor: renk }]} />
            <Text style={S.voiceName}>{s.adSoyad}</Text>
            <Text style={S.voiceDur}>{sure(s.sure)}</Text>
            <Text style={S.voiceDate}>{tarih(s.createdAt)}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

/* ─── Document ─── */
export function AniKitabiPDF({ v }: { v: AniKitabiVeri }) {
  const aniChunks = chunks(v.anilar, 3);

  let pageCounter = 1;
  const pn = () => pageCounter++;

  return (
    <Document title={`${v.baslik} — Anı Kitabı`} author="Bekleriz" subject="Etkinlik Anı Kitabı">
      <Kapak v={v} />

      {v.fotolar.map((f, i) => (
        <FotoSayfasi
          key={f.id}
          foto={f}
          renk={v.renk}
          pageN={pn()}
          isFirst={i === 0}
          totalFotos={v.fotolar.length}
        />
      ))}

      {aniChunks.map((grp, i) => (
        <AnilarSayfasi
          key={i}
          anilar={grp}
          renk={v.renk}
          pageN={pn()}
          isFirst={i === 0}
          totalAnilar={v.anilar.length}
        />
      ))}

      {v.sesliAnilar.length > 0 && (
        <SesliAnilarSayfasi sesliAnilar={v.sesliAnilar} renk={v.renk} pageN={pn()} />
      )}
    </Document>
  );
}
