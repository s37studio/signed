import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useCreateProposal() {
  return useMutation({
    ...trpc.proposal.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", "getAll"] });
      toast.success("Proposition créée avec succès !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
