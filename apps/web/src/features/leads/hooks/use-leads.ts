import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useLeads() {
  return useQuery(trpc.lead.getAll.queryOptions());
}

export function useLead(id: string) {
  return useQuery(
    trpc.lead.getById.queryOptions({
      id,
    }),
  );
}
