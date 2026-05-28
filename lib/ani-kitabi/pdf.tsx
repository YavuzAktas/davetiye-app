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
  const d = (c: number) => Math.max(0, Math.round(c * (1-t)));
  const x = (c: number) => d(c).toString(16).padStart(2,"0");
  return `#${x(r)}${x(g)}${x(b)}`;
}
function lighten(hex: string, t: number): string {
  const [r,g,b] = hexToRgb(hex);
  const l = (c: number) => Math.min(255, Math.round(c + (255-c)*t));
  const x = (c: number) => l(c).toString(16).padStart(2,"0");
  return `#${x(r)}${x(g)}${x(b)}`;
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

/* ─── Styles ─── */
const F = "NotoSans";

const S = StyleSheet.create({
  /* shared */
  page:    { fontFamily: F, backgroundColor: "#ffffff" },
  flex:    { display:"flex", flexDirection:"row", alignItems:"center" },

  /* page header bar */
  pageHeader: {
    paddingHorizontal: 40, paddingTop: 28, paddingBottom: 14,
    display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between",
  },
  pageHeaderTitle: { fontSize: 7, color: "#c4c4cc", letterSpacing: 1.5, textTransform:"uppercase" },
  pageHeaderPage:  { fontSize: 7, color: "#c4c4cc", letterSpacing: 1 },
  pageHeaderLine:  { marginHorizontal: 40, height: 0.5, backgroundColor: "#ebebf0" },

  /* cover */
  cover: { fontFamily: F, backgroundColor: "#ffffff" },
  coverColorStrip: { position:"absolute", top:0, left:0, right:0, height:440 },
  coverInnerBorder: {
    position:"absolute", top:20, left:20, right:20, bottom:20,
    borderWidth:0.5, borderColor:"rgba(255,255,255,0.22)",
  },
  coverBody: { paddingTop: 80, alignItems:"center" },
  coverEyebrow: { fontSize:7, letterSpacing:4, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", marginBottom:16 },
  coverNames: { fontSize:38, fontWeight:"bold", color:"#ffffff", textAlign:"center", lineHeight:1.15 },
  coverTitle: { fontSize:22, color:"rgba(255,255,255,0.8)", textAlign:"center", marginTop:6, lineHeight:1.3 },
  coverOrnament: { width:40, height:1.5, marginVertical:20, backgroundColor:"rgba(255,255,255,0.4)" },
  coverMeta: { fontSize:9, color:"rgba(255,255,255,0.65)", textAlign:"center", marginBottom:4, letterSpacing:0.5 },
  coverStatsRow: {
    flexDirection:"row", gap:32, marginTop:32, marginBottom:0,
    paddingHorizontal:40, alignItems:"center", justifyContent:"center",
  },
  coverStatBox: { alignItems:"center" },
  coverStatNum: { fontSize:28, fontWeight:"bold", color:"#ffffff", lineHeight:1 },
  coverStatLabel: { fontSize:6.5, letterSpacing:2.5, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", marginTop:4 },
  coverStatDivider: { width:0.5, height:32, backgroundColor:"rgba(255,255,255,0.2)" },
  coverWhiteStrip: { paddingVertical:18, paddingHorizontal:40, alignItems:"center" },
  coverBranding: { fontSize:7, color:"#c4c4cc", letterSpacing:2, textTransform:"uppercase" },

  /* section intro */
  sectionPage: { fontFamily:F, backgroundColor:"#ffffff", position:"relative" },
  sectionAccentStrip: { position:"absolute", top:0, left:0, bottom:0, width:5 },
  sectionGhostNum: { fontSize:120, fontWeight:"bold", color:"#f5f5f7", position:"absolute", bottom:48, right:48 },
  sectionContent: { paddingTop:180, paddingHorizontal:60 },
  sectionLabel: { fontSize:7, letterSpacing:3.5, textTransform:"uppercase", marginBottom:12 },
  sectionHeading: { fontSize:32, fontWeight:"bold", color:"#1a1a2e", lineHeight:1.2, marginBottom:12 },
  sectionSub: { fontSize:10, color:"#8888a0", lineHeight:1.6 },

  /* photo */
  photoBody: { paddingHorizontal:40, paddingTop:12 },
  photoFrame: { borderWidth:1, padding:8, backgroundColor:"#fff" },
  photoImage: { width:"100%", height:380, objectFit:"cover" },
  photoCaption: { paddingTop:10, paddingBottom:4, flexDirection:"row", alignItems:"center", justifyContent:"space-between" },
  photoName: { fontSize:9, fontWeight:"bold", color:"#1a1a2e", letterSpacing:0.8 },
  photoDate: { fontSize:8, color:"#a0a0b0" },

  /* memories */
  aniBody: { paddingHorizontal:48, paddingTop:12 },
  aniCard: { marginBottom:28, paddingBottom:28 },
  aniCardBorder: { marginBottom:28, paddingBottom:28, borderBottomWidth:0.5, borderBottomColor:"#ebebf0" },
  aniQuote: { fontSize:48, lineHeight:1, marginBottom:-8, fontWeight:"bold" },
  aniText: { fontSize:10.5, color:"#2a2a3e", lineHeight:1.65 },
  aniAuthorRow: { flexDirection:"row", alignItems:"center", marginTop:12 },
  aniAuthorLine: { flex:1, height:0.5, marginRight:10 },
  aniAuthorName: { fontSize:8, fontWeight:"bold", letterSpacing:1.2, textTransform:"uppercase" },
  aniDate: { fontSize:7.5, color:"#b0b0c0", marginTop:3, textAlign:"right" },

  /* voice */
  voiceBody: { paddingHorizontal:48, paddingTop:12 },
  voiceNote: { fontSize:9, color:"#a0a0b0", marginBottom:24, lineHeight:1.5 },
  voiceRow: {
    flexDirection:"row", alignItems:"center",
    paddingVertical:12, borderBottomWidth:0.5, borderBottomColor:"#f0f0f5",
  },
  voiceIndex: { fontSize:9, color:"#c0c0d0", width:24 },
  voiceName: { flex:1, fontSize:10, fontWeight:"bold", color:"#1a1a2e" },
  voiceDur: { fontSize:9, color:"#8888a0", marginRight:16 },
  voiceDate: { fontSize:8, color:"#c0c0d0" },
  voiceDot: { width:6, height:6, borderRadius:3, marginRight:10 },
});

/* ─── Shared Page Header ─── */
function PageHdr({ title, n }: { title: string; n: number }) {
  return (
    <>
      <View style={S.pageHeader}>
        <Text style={S.pageHeaderTitle}>{title}</Text>
        <Text style={S.pageHeaderPage}>{n}</Text>
      </View>
      <View style={S.pageHeaderLine} />
    </>
  );
}

/* ─── Cover Page ─── */
function Kapak({ v }: { v: AniKitabiVeri }) {
  const bg  = v.renk;
  const bg2 = darken(v.renk, 0.15);
  const hasNames = v.kisi1 || v.kisi2;
  const names = [v.kisi1, v.kisi2].filter(Boolean).join(" & ");

  const statlar = [
    v.fotolar.length > 0   && { n: v.fotolar.length,    l: "Fotoğraf"  },
    v.anilar.length > 0    && { n: v.anilar.length,      l: "Anı"       },
    v.sesliAnilar.length>0 && { n: v.sesliAnilar.length, l: "Ses Kaydı" },
  ].filter(Boolean) as { n: number; l: string }[];

  return (
    <Page size="A4" style={S.cover}>
      {/* Renkli üst alan */}
      <View style={[S.coverColorStrip, { backgroundColor: bg }]} />
      {/* İkinci ton şerit (üst 120px) */}
      <View style={{ position:"absolute", top:0, left:0, right:0, height:120, backgroundColor: bg2 }} />
      {/* İnce iç çerçeve */}
      <View style={S.coverInnerBorder} />

      {/* İçerik */}
      <View style={S.coverBody}>
        <Text style={S.coverEyebrow}>Anı Kitabı</Text>
        <View style={S.coverOrnament} />

        {hasNames
          ? <Text style={S.coverNames}>{names}</Text>
          : <Text style={S.coverNames}>{v.baslik}</Text>
        }
        {hasNames && (
          <Text style={S.coverTitle}>{v.baslik}</Text>
        )}

        <View style={S.coverOrnament} />

        {v.tarih && <Text style={S.coverMeta}>{tarih(v.tarih)}</Text>}
        {v.mekan  && <Text style={S.coverMeta}>{v.mekan}</Text>}

        {/* Stats */}
        {statlar.length > 0 && (
          <View style={S.coverStatsRow}>
            {statlar.map((st, i) => (
              <View key={i} style={{ flexDirection:"row", alignItems:"center" }}>
                {i > 0 && <View style={S.coverStatDivider} />}
                <View style={[S.coverStatBox, i > 0 ? { marginLeft:32 } : {}]}>
                  <Text style={S.coverStatNum}>{st.n}</Text>
                  <Text style={S.coverStatLabel}>{st.l}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Alt beyaz şerit */}
      <View style={{ position:"absolute", bottom:0, left:0, right:0, height:60, backgroundColor:"#ffffff" }}>
        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
          <Text style={S.coverBranding}>bekleriz.com</Text>
        </View>
      </View>
    </Page>
  );
}

/* ─── Section Intro Page ─── */
function SectionIntro({ renk, num, label, heading, sub }: {
  renk: string; num: string; label: string; heading: string; sub: string;
}) {
  return (
    <Page size="A4" style={S.sectionPage}>
      <View style={[S.sectionAccentStrip, { backgroundColor: renk }]} />
      <Text style={[S.sectionGhostNum, { color: lighten(renk, 0.92) }]}>{num}</Text>
      <View style={S.sectionContent}>
        <Text style={[S.sectionLabel, { color: renk }]}>{label}</Text>
        <Text style={S.sectionHeading}>{heading}</Text>
        <Text style={S.sectionSub}>{sub}</Text>
      </View>
    </Page>
  );
}

/* ─── Single Photo Page ─── */
function FotoSayfasi({ foto, renk, pageN }: {
  foto: AniKitabiVeri["fotolar"][0]; renk: string; pageN: number;
}) {
  return (
    <Page size="A4" style={S.page}>
      <PageHdr title={foto.yukleyenAd.toUpperCase()} n={pageN} />
      <View style={S.photoBody}>
        <View style={[S.photoFrame, { borderColor: renk + "30" }]}>
          {foto.imageData ? (
            <Image src={foto.imageData} style={S.photoImage} />
          ) : (
            <View style={[S.photoImage, { backgroundColor: lighten(renk, 0.9), alignItems:"center", justifyContent:"center" }]}>
              <Text style={{ fontSize:10, color: renk + "80" }}>Fotoğraf yüklenemedi</Text>
            </View>
          )}
          <View style={[S.photoCaption, { borderTopWidth:0.5, borderTopColor: renk + "20" }]}>
            <Text style={[S.photoName, { color: renk }]}>{foto.yukleyenAd}</Text>
            <Text style={S.photoDate}>{tarih(foto.createdAt)}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}

/* ─── Memories Page ─── */
function AnilarSayfasi({ anilar, renk, pageN, totalAnilar }: {
  anilar: AniKitabiVeri["anilar"]; renk: string; pageN: number; totalAnilar: number;
}) {
  return (
    <Page size="A4" style={S.page}>
      <PageHdr title={`YAZILI ANILAR — ${totalAnilar} ANI`} n={pageN} />
      <View style={S.aniBody}>
        {anilar.map((a, i) => (
          <View key={a.id} style={i < anilar.length-1 ? S.aniCardBorder : S.aniCard}>
            <Text style={[S.aniQuote, { color: renk + "60" }]}>&ldquo;</Text>
            <Text style={S.aniText}>{a.icerik}</Text>
            <View style={S.aniAuthorRow}>
              <View style={[S.aniAuthorLine, { backgroundColor: renk + "40" }]} />
              <Text style={[S.aniAuthorName, { color: renk }]}>{a.yazarAd}</Text>
            </View>
            <Text style={S.aniDate}>{tarih(a.createdAt)}</Text>
          </View>
        ))}
      </View>
    </Page>
  );
}

/* ─── Voice Memories Page ─── */
function SesliAnilarSayfasi({ sesliAnilar, renk, pageN }: {
  sesliAnilar: AniKitabiVeri["sesliAnilar"]; renk: string; pageN: number;
}) {
  return (
    <Page size="A4" style={S.page}>
      <PageHdr title={`SESLİ ANILAR — ${sesliAnilar.length} KAYIT`} n={pageN} />
      <View style={S.voiceBody}>
        <Text style={S.voiceNote}>
          Sesli anıları dinlemek için davetiye sayfanızı ziyaret edin.
        </Text>
        {sesliAnilar.map((s, i) => (
          <View key={s.id} style={S.voiceRow}>
            <Text style={S.voiceIndex}>{String(i+1).padStart(2,"0")}</Text>
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

/* ─── Main Document ─── */
export function AniKitabiPDF({ v }: { v: AniKitabiVeri }) {
  const fotoChunks = v.fotolar; // 1 per page
  const aniChunks  = chunks(v.anilar, 3);

  let pageCounter = 1;
  const pn = () => pageCounter++;

  return (
    <Document title={`${v.baslik} — Anı Kitabı`} author="Bekleriz" subject="Etkinlik Anı Kitabı">
      {/* 1. Kapak */}
      <Kapak v={v} />

      {/* 2. Fotoğraflar */}
      {v.fotolar.length > 0 && (
        <>
          <SectionIntro
            renk={v.renk}
            num="01"
            label="Bölüm 01"
            heading="Fotoğraflar"
            sub={`Misafirlerinizin paylaştığı ${v.fotolar.length} fotoğraf.`}
          />
          {fotoChunks.map((f) => (
            <FotoSayfasi key={f.id} foto={f} renk={v.renk} pageN={pn()} />
          ))}
        </>
      )}

      {/* 3. Yazılı Anılar */}
      {v.anilar.length > 0 && (
        <>
          <SectionIntro
            renk={v.renk}
            num="02"
            label="Bölüm 02"
            heading="Yazılı Anılar"
            sub={`Misafirlerinizin bıraktığı ${v.anilar.length} anı.`}
          />
          {aniChunks.map((grp, i) => (
            <AnilarSayfasi key={i} anilar={grp} renk={v.renk} pageN={pn()} totalAnilar={v.anilar.length} />
          ))}
        </>
      )}

      {/* 4. Sesli Anılar */}
      {v.sesliAnilar.length > 0 && (
        <>
          <SectionIntro
            renk={v.renk}
            num="03"
            label="Bölüm 03"
            heading="Sesli Anılar"
            sub={`Misafirlerinizin kaydettiği ${v.sesliAnilar.length} ses mesajı.`}
          />
          <SesliAnilarSayfasi sesliAnilar={v.sesliAnilar} renk={v.renk} pageN={pn()} />
        </>
      )}
    </Document>
  );
}
