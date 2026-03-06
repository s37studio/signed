import { z } from "zod";
import prisma from "@my-better-t-app/db";
import { TRPCError } from "@trpc/server";

import { orgProcedure, protectedProcedure, router } from "../index";

export const organizationController = router({
  // Récupère l'org active de l'user (avec ses membres)
  getCurrent: orgProcedure.query(async ({ ctx }) => {
    const org = await prisma.organization.findUnique({
      where: { id: ctx.organizationId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        invitations: {
          where: { status: "pending" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!org) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
    }

    return org;
  }),

  // Vérifie si l'user a une org active
  hasOrganization: protectedProcedure.query(async ({ ctx }) => {
    const membership = await prisma.member.findFirst({
      where: { userId: ctx.session.user.id },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
      },
    });
    return membership ?? null;
  }),

  // Retirer un membre (owner/admin seulement)
  removeMember: orgProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'user est owner ou admin
      const currentMember = await prisma.member.findFirst({
        where: { userId: ctx.session.user.id, organizationId: ctx.organizationId },
      });

      if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      // Ne pas pouvoir se retirer soi-même si owner
      const targetMember = await prisma.member.findFirst({
        where: { id: input.memberId, organizationId: ctx.organizationId },
      });

      if (!targetMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      if (targetMember.role === "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot remove the owner" });
      }

      return await prisma.member.delete({ where: { id: input.memberId } });
    }),

  // Changer le rôle d'un membre (owner seulement)
  updateMemberRole: orgProcedure
    .input(z.object({ memberId: z.string(), role: z.enum(["admin", "member"]) }))
    .mutation(async ({ input, ctx }) => {
      const currentMember = await prisma.member.findFirst({
        where: { userId: ctx.session.user.id, organizationId: ctx.organizationId },
      });

      if (!currentMember || currentMember.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the owner can change roles" });
      }

      const targetMember = await prisma.member.findFirst({
        where: { id: input.memberId, organizationId: ctx.organizationId },
      });

      if (!targetMember) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      if (targetMember.role === "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot change owner role" });
      }

      return await prisma.member.update({
        where: { id: input.memberId },
        data: { role: input.role },
      });
    }),

  // Annuler une invitation
  cancelInvitation: orgProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const currentMember = await prisma.member.findFirst({
        where: { userId: ctx.session.user.id, organizationId: ctx.organizationId },
      });

      if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      return await prisma.invitation.update({
        where: { id: input.invitationId, organizationId: ctx.organizationId },
        data: { status: "canceled" },
      });
    }),
});
