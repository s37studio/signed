"use client";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-xl font-bold">
            Signed
          </Link>
          {/* Afficher les liens de navigation uniquement si l'utilisateur est connecté */}
          {session?.user && (
            <>
              <Link href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/leads" className="text-sm hover:underline">
                Leads
              </Link>
              <Link href="/dashboard" className="text-sm hover:underline">
                Propositions
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
