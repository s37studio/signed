import { z } from "zod";
import { ProposalStatus } from "@my-better-t-app/db";

import { protectedProcedure, publicProcedure, router } from "../index";
import { proposalService } from "../services/proposal.service";

export const proposalController = router({
  // Liste toutes les propals
  getAll: protectedProcedure.query(async () => {
    return await proposalService.getAll();
  }),

  // Détail d'une propal
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await proposalService.getById(input.id);
    }),

  // Créer une propal
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2, "Le titre doit faire au moins 2 caractères"),
        templateId: z.string(),
        customData: z.any(),
        password: z.string().optional(),
        leadId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await proposalService.create(input, ctx.session.user.id);
    }),

  // Modifier une propal
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z
          .string()
          .min(2, "Le titre doit faire au moins 2 caractères")
          .optional(),
        customData: z.any().optional(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await proposalService.update(id, data);
    }),

  // Changer le statut manuellement
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "WON", "LOST", "REVISION"]),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.updateStatus(
        input.id,
        input.status as ProposalStatus
      );
    }),

  // Supprimer une propal
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.delete(input.id);
    }),

  // 🔓 ROUTES PUBLIQUES (pas d'authentification)

  // Récupérer une propal par token (page publique)
  getByToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return await proposalService.getByToken(input.token, input.password);
    }),

  // Tracker une vue
  trackView: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.trackView(input.token);
    }),

  // Client valide la propal
  validateProposal: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.validateProposal(input.token);
    }),

  // Client demande une révision
  requestRevision: publicProcedure
    .input(
      z.object({
        token: z.string(),
        message: z
          .string()
          .min(10, "Le message doit faire au moins 10 caractères"),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.requestRevision(input.token, input.message);
    }),
});
