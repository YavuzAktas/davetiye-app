export type DavetiyeOzellik = "album" | "aniDefteri" | "sesliAni" | "canliDuvar" | "oturmaPlan" | "muzik";

type DavetiyeOzellikKaynak = {
  odemeDurumu?: string | null;
  albumAktif?: boolean | null;
  aniDefteriAktif?: boolean | null;
  sesliAniAktif?: boolean | null;
  canliDuvarAktif?: boolean | null;
  oturmaPlanAktif?: boolean | null;
  muzik?: string | null;
};

const OZELLIK_FLAG: Record<DavetiyeOzellik, keyof DavetiyeOzellikKaynak | null> = {
  album: "albumAktif",
  aniDefteri: "aniDefteriAktif",
  sesliAni: "sesliAniAktif",
  canliDuvar: "canliDuvarAktif",
  oturmaPlan: "oturmaPlanAktif",
  muzik: "muzik",
};

export function davetiyeOzelligiAktif(davetiye: DavetiyeOzellikKaynak, ozellik: DavetiyeOzellik): boolean {
  const flag = OZELLIK_FLAG[ozellik];
  const flagAktif = flag ? Boolean(davetiye[flag]) : true;
  return flagAktif && davetiye.odemeDurumu === "odendi";
}
