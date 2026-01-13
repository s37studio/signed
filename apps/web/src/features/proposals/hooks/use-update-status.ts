import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useUpdateStatus() {
  return useMutation({
    ...trpc.proposal.updateStatus.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", "getAll"] });
      toast.success("Statut mis à jour !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
