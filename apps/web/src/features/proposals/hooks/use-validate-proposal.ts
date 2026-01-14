import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

export function useValidateProposal() {
  return useMutation({
    ...trpc.proposal.validateProposal.mutationOptions(),
    onSuccess: () => {
      toast.success("Proposition acceptée ! Merci 🎉");
    },
    onError: (error: any) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
}
