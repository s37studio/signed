"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      window.location.replace("/login");
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-zinc-400 text-sm">Chargement...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 py-4 pr-4 overflow-hidden">
        <div className="h-full w-full bg-[#0C0C0C]/50 rounded-lg border border-zinc-800/10 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
