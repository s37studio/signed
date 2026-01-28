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
    <aside className="w-20 h-screen bg-[#0E0E10] flex flex-col items-center py-6">
      {/* Navigation */}
      <nav className="flex-1 flex flex-col justify-center w-full">
        <ul className="space-y-6 flex flex-col items-center">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href as any}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-xl transition-all duration-200 group relative",
                    isActive
                      ? "bg-zinc-50 text-zinc-950"
                      : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900",
                  )}
                  title={item.title}
                >
                  <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                  {isActive && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-zinc-50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-zinc-800">
                      {item.title}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section at bottom */}
      <div className="mt-auto">
        <UserMenu collapsed />
      </div>
    </aside>
  );
}
