import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useUpdateProposal() {
  return useMutation({
    ...trpc.proposal.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", "getAll"] });
      toast.success("Proposition mise à jour !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
