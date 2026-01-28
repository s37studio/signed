import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Skeleton className={collapsed ? "h-8 w-8 rounded-full" : "h-9 w-24"} />
    );
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline" size={collapsed ? "icon" : "default"}>
          {collapsed ? "In" : "Sign In"}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={
              collapsed
                ? "h-10 w-10 rounded-full p-0 hover:bg-zinc-900"
                : "w-full justify-start px-3 py-2 h-auto text-zinc-50 hover:bg-zinc-900"
            }
          >
            {collapsed ? (
              <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-medium">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium truncate">
                  {session.user.name}
                </span>
              </div>
            )}
          </Button>
        }
      />
      <DropdownMenuContent
        className="bg-zinc-900 border-zinc-800 w-56"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-zinc-400">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-50">
            {session.user.email}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="focus:bg-red-900/20 focus:text-red-400"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
