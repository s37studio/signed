import { TRPCError } from "@trpc/server";

import { leadRepository } from "../repositories/lead.repository";

export const leadService = {
  getAll: async (organizationId: string) => {
    return await leadRepository.findAll(organizationId);
  },

  getById: async (id: string, organizationId: string) => {
    const lead = await leadRepository.findById(id, organizationId);
    if (!lead) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
    }
    return lead;
  },

  create: async (
    input: { name: string; email?: string; company?: string; phone?: string },
    userId: string,
    organizationId: string
  ) => {
    return await leadRepository.create({
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      phone: input.phone || null,
      createdById: userId,
      organizationId,
    });
  },

  update: async (
    id: string,
    organizationId: string,
    input: { name?: string; email?: string; company?: string; phone?: string }
  ) => {
    const updateData: {
      name?: string;
      email?: string | null;
      company?: string | null;
      phone?: string | null;
    } = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email || null;
    if (input.company !== undefined) updateData.company = input.company || null;
    if (input.phone !== undefined) updateData.phone = input.phone || null;

    return await leadRepository.update(id, organizationId, updateData);
  },

  delete: async (id: string, organizationId: string) => {
    return await leadRepository.delete(id, organizationId);
  },
};
