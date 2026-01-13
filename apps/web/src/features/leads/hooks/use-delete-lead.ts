import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useDeleteLead() {
  return useMutation({
    ...trpc.lead.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "getAll"] });
      toast.success("Lead supprimé !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
