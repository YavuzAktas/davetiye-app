import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function OdemeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
