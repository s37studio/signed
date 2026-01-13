import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useDeleteProposal() {
  return useMutation({
    ...trpc.proposal.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", "getAll"] });
      toast.success("Proposition supprimée !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
