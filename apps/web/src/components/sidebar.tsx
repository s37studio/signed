"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  SparklesIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  {
    title: "Activity",
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
    icon: DocumentTextIcon,
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
    <aside className="w-[280px] h-screen bg-[#0E0E10] flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 pb-2">
        <div className="text-zinc-50 font-display select-none text-[16px] tracking-tight">
          S37™ Studio
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-2 pb-6">
        <div className="mb-2">
          <ul className="space-y-0.5 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-colors duration-200 group text-sm font-medium",
                      isActive
                        ? "text-zinc-50 bg-[#0C0C0D]/50"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="size-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-400">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-50 truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {session.user.email}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-zinc-400 hover:text-zinc-50"
              >
                <EllipsisHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#0E0E10] border-zinc-800"
            >
              <DropdownMenuItem
                className="text-red-400 focus:text-red-400 focus:bg-red-900/10"
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.replace("/login");
                      },
                    },
                  })
                }
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
