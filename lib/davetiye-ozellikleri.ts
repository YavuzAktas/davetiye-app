import { planOzellikVar } from "@/lib/planlar";

export type DavetiyeOzellik = "album" | "sesliAni" | "canliDuvar" | "oturmaPlan" | "muzik";

type DavetiyeOzellikKaynak = {
  odemeDurumu?: string | null;
  albumAktif?: boolean | null;
  sesliAniAktif?: boolean | null;
  canliDuvarAktif?: boolean | null;
  oturmaPlanAktif?: boolean | null;
  muzik?: string | null;
  user?: { plan?: string | null } | null;
};

const OZELLIK_FLAG: Record<DavetiyeOzellik, keyof DavetiyeOzellikKaynak | null> = {
  album: "albumAktif",
  sesliAni: "sesliAniAktif",
  canliDuvar: "canliDuvarAktif",
  oturmaPlan: "oturmaPlanAktif",
  muzik: "muzik",
};

export function davetiyeOzelligiAktif(davetiye: DavetiyeOzellikKaynak, ozellik: DavetiyeOzellik): boolean {
  const flag = OZELLIK_FLAG[ozellik];
  const davetiyeSecimi = flag ? Boolean(davetiye[flag]) : true;
  if (!davetiyeSecimi) return false;

  if (davetiye.odemeDurumu === "odendi") return true;

  // Geriye dönük uyumluluk: Yeni sipariş modelinden önce açılmış davetiyelerde,
  // eski plan hakkını geçici olarak korur. Yeni davetiyeler ödeme sonrası "odendi" olur.
  if (davetiye.odemeDurumu === "ucretsiz" && davetiye.user?.plan) {
    return planOzellikVar(davetiye.user.plan, ozellik);
  }

  return false;
}
