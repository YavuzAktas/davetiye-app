import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/giris");
  }

  // KVKK onayını JWT'ye güvenmeden doğrudan DB'den oku
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kvkkOnay: true },
  });

  if (!user?.kvkkOnay) {
    redirect("/kvkk-onay?callbackUrl=/dashboard");
  }

  return <>{children}</>;
}
