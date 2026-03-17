"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as string;

  useEffect(() => {
    // Redirect to dashboard - editing is now done via modal
    router.replace("/dashboard");
  }, [router]);

  return null;
}
