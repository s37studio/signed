import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useProposals() {
  return useQuery(trpc.proposal.getAll.queryOptions());
}

export function useProposal(id: string) {
  return useQuery(
    trpc.proposal.getById.queryOptions({
      id,
    }),
  );
}
