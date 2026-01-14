import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default async function HomePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session && "data" in session && session.data?.user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
