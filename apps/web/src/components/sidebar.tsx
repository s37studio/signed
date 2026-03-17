"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  UsersIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon,
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
    href: "/dashboard" as const,
    icon: Squares2X2Icon,
  },
  {
    title: "Leads",
    href: "/dashboard/leads" as const,
    icon: UsersIcon,
  },
  {
    title: "Templates",
    href: "/dashboard/templates" as const,
    icon: DocumentTextIcon,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings" as const,
    icon: Cog6ToothIcon,
  },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!session?.user) {
    return null;
  }

  return (
    <aside
      className={cn(
        "h-screen bg-black flex flex-col shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      {/* User profile */}
      <div
        className={cn(
          "space-y-4",
          isCollapsed ? "flex justify-center px-0 py-4 pb-2" : "pt-4 px-2 pb-2",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 px-2 pt-2 rounded-lg transition-colors cursor-pointer",
                  "text-zinc-400",
                  isCollapsed && "justify-center px-0",
                )}
              />
            }
          >
            <img
              src="https://www.tapback.co/api/avatar.webp"
              alt={session.user.name ?? "Avatar"}
              className={cn(
                "rounded-full object-cover shrink-0",
                isCollapsed ? "size-6" : "size-8",
              )}
            />
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-zinc-50 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
              </>
            )}
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

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-2 pb-6 flex flex-col justify-between">
        <div className="mb-2">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2.5 rounded-[12px] transition-colors duration-200 group text-sm font-medium",
                      isActive
                        ? "text-zinc-50 bg-[#0C0C0C]/50"
                        : "text-zinc-400 hover:text-white",
                      isCollapsed && "justify-center px-2",
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Collapse Toggle */}
        <div className="px-2 mt-auto space-y-0.5">
          <button
            className={cn(
              "flex items-center gap-3 px-2 py-2.5 rounded-[12px] transition-colors duration-200 group text-sm font-medium text-zinc-400 hover:text-white w-full",
              isCollapsed && "justify-center px-2",
            )}
            title={isCollapsed ? "Notifications" : undefined}
          >
            <BellIcon className="size-4 shrink-0" />
            {!isCollapsed && <span>Notifications</span>}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex items-center gap-3 px-2 py-2.5 rounded-[12px] transition-colors duration-200 group text-sm font-medium text-zinc-400 hover:text-white w-full",
              isCollapsed && "justify-center px-2",
            )}
          >
            {isCollapsed ? (
              <i className="ri-side-bar-fill text-base shrink-0 leading-none rotate-180" />
            ) : (
              <i className="ri-side-bar-fill text-base shrink-0 leading-none" />
            )}
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
