import { z } from "zod";
import { ProposalStatus } from "@my-better-t-app/db";

import { orgProcedure, publicProcedure, router } from "../index";
import { proposalService } from "../services/proposal.service";

export const proposalController = router({
  getAll: orgProcedure.query(async ({ ctx }) => {
    return await proposalService.getAll(ctx.organizationId);
  }),

  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await proposalService.getById(input.id, ctx.organizationId);
    }),

  create: orgProcedure
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
      return await proposalService.create(input, ctx.session.user.id, ctx.organizationId);
    }),

  update: orgProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2, "Le titre doit faire au moins 2 caractères").optional(),
        customData: z.any().optional(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await proposalService.update(id, ctx.organizationId, data);
    }),

  updateStatus: orgProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "WON", "LOST", "REVISION"]),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.updateStatus(input.id, input.status as ProposalStatus);
    }),

  delete: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await proposalService.delete(input.id, ctx.organizationId);
    }),

  // Routes publiques

  getByToken: publicProcedure
    .input(z.object({ token: z.string(), password: z.string().optional() }))
    .query(async ({ input }) => {
      return await proposalService.getByToken(input.token, input.password);
    }),

  validateProposal: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      return await proposalService.validateProposal(input.token);
    }),

  requestRevision: publicProcedure
    .input(
      z.object({
        token: z.string(),
        message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
      })
    )
    .mutation(async ({ input }) => {
      return await proposalService.requestRevision(input.token, input.message);
    }),
});
