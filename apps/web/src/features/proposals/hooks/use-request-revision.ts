import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

export function useRequestRevision() {
  return useMutation({
    ...trpc.proposal.requestRevision.mutationOptions(),
    onSuccess: () => {
      toast.success("Demande de révision envoyée !");
    },
    onError: (error: any) => {
      toast.error(`Erreur : ${error.message}`);
    },
  });
}
