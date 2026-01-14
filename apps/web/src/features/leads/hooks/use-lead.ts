import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useLead(id: string) {
  return useQuery(trpc.lead.getById.queryOptions({ id }));
}
