import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function usePublicProposal(token: string, password?: string) {
  return useQuery({
    ...trpc.proposal.getByToken.queryOptions({
      token,
      password: password || undefined,
    }),
    retry: false,
    staleTime: Infinity,
    meta: {
      errorHandler: () => {},
    },
  });
}
