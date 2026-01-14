import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useProposalViews(proposalId: string) {
  return useQuery({
    ...trpc.proposalView.getHistory.queryOptions({ proposalId }),
    enabled: !!proposalId,
  });
}
