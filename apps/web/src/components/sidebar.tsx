"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Palette } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import UserMenu from "./user-menu";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    title: "Propositions",
    href: "/dashboard/proposals",
    icon: FileText,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: Palette,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <aside className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* User section at top */}
      <div className="p-4 border-b border-zinc-800">
        <UserMenu />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-800 text-zinc-50"
                      : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
