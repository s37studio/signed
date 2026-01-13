import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryClient, trpc } from "@/utils/trpc";

export function useCreateLead() {
  return useMutation({
    ...trpc.lead.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "getAll"] });
      toast.success("Lead créé avec succès !");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
