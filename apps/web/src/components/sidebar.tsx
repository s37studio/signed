"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Squares2X2Icon,
  UsersIcon,
  SwatchIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import UserMenu from "./user-menu";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Squares2X2Icon,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: UsersIcon,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: SwatchIcon,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
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
        <ul className="space-y-2 flex flex-col items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href as any}
                  className={cn(
                    "flex items-center justify-center p-3 rounded-full transition-colors duration-200 group relative z-10",
                    isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-50",
                  )}
                  title={item.title}
                >
                  <Icon className="h-[18px] w-[18px]" />

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-[#0C0C0D] rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-zinc-50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-zinc-800">
                    {item.title}
                  </div>
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
