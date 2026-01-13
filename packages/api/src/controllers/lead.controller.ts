import { z } from "zod";

import { protectedProcedure, router } from "../index";
import { leadService } from "../services/lead.service";

export const leadController = router({
  // Liste tous les leads
  getAll: protectedProcedure.query(async () => {
    return await leadService.getAll();
  }),

  // Détail d'un lead avec ses propals
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await leadService.getById(input.id);
    }),

  // Créer un lead
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
        email: z.string().email("Email invalide").optional().or(z.literal("")),
        company: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await leadService.create(input, ctx.session.user.id);
    }),

  // Modifier un lead
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z
          .string()
          .min(2, "Le nom doit faire au moins 2 caractères")
          .optional(),
        email: z.string().email("Email invalide").optional().or(z.literal("")),
        company: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await leadService.update(id, data);
    }),

  // Supprimer un lead
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await leadService.delete(input.id);
    }),
});
