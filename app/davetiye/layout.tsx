import { Providers } from "@/app/providers";

export default function DavetiyeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}