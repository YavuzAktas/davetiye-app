"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function SessionSync({ dbPlan }: { dbPlan: string }) {
  const { data: session, update } = useSession();
  useEffect(() => {
    if (session?.user && (session.user as any).plan !== dbPlan) {
      update();
    }
  }, []);
  return null;
}
