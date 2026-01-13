import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useUpdateLead() {
  return useMutation({
    ...trpc.lead.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead"] });
      toast.success("Lead modifié avec succès !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
