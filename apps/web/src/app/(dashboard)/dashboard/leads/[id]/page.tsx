"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LeadDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/leads");
  }, [router]);

  return null;
}
