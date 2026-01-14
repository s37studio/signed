import { z } from "zod";

import { protectedProcedure, publicProcedure, router } from "../index";
import { proposalViewService } from "../services/proposal-view.service";

export const proposalViewController = router({
  // Tracker une nouvelle vue (public)
  trackView: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Récupérer l'IP depuis les headers
      const forwarded = ctx.request?.headers.get("x-forwarded-for");
      const realIp = ctx.request?.headers.get("x-real-ip");
      const ip = forwarded?.split(",")[0] || realIp || undefined;

      return await proposalViewService.trackView(input.proposalId, ip);
    }),

  // Mettre à jour la durée d'une vue (public)
  updateDuration: publicProcedure
    .input(
      z.object({
        viewId: z.string(),
        duration: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalViewService.updateDuration(
        input.viewId,
        input.duration
      );
    }),

  // Récupérer l'historique des vues (protégé)
  getHistory: protectedProcedure
    .input(
      z.object({
        proposalId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await proposalViewService.getViewHistory(input.proposalId);
    }),
});
