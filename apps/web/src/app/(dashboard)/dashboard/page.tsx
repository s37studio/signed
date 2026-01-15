import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth-server";

import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenue, {session.user.name}</p>
      </div>
      <Dashboard session={session} />
    </div>
  );
}
