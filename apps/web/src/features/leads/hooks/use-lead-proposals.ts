import { useMemo } from "react";

import { useProposals } from "@/features/proposals/hooks/use-proposals";

export function useLeadProposals(leadId: string) {
  const { data: allProposals, isLoading } = useProposals();

  const leadProposals = useMemo((): any[] => {
    const proposals = (allProposals || []) as any[];
    return proposals.filter((p) => p.leadId === leadId);
  }, [allProposals, leadId]);

  const stats = useMemo(() => {
    const proposals = leadProposals as any[];
    return {
      total: proposals.length,
      won: proposals.filter((p) => p.status === "WON").length,
      pending: proposals.filter((p) => p.status === "PENDING").length,
      revision: proposals.filter((p) => p.status === "REVISION").length,
      lost: proposals.filter((p) => p.status === "LOST").length,
    };
  }, [leadProposals]);

  return {
    proposals: leadProposals,
    stats,
    isLoading,
  };
}
