import { useMutation } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useTrackView() {
  return useMutation({
    ...trpc.proposal.trackView.mutationOptions(),
  });
}
