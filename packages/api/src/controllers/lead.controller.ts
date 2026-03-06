import { z } from "zod";

import { orgProcedure, router } from "../index";
import { leadService } from "../services/lead.service";

export const leadController = router({
  getAll: orgProcedure.query(async ({ ctx }) => {
    return await leadService.getAll(ctx.organizationId);
  }),

  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await leadService.getById(input.id, ctx.organizationId);
    }),

  create: orgProcedure
    .input(
      z.object({
        name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
        email: z.string().email("Email invalide").optional().or(z.literal("")),
        company: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await leadService.create(input, ctx.session.user.id, ctx.organizationId);
    }),

  update: orgProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2, "Le nom doit faire au moins 2 caractères").optional(),
        email: z.string().email("Email invalide").optional().or(z.literal("")),
        company: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return await leadService.update(id, ctx.organizationId, data);
    }),

  delete: orgProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await leadService.delete(input.id, ctx.organizationId);
    }),
});
