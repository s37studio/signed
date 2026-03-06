import { TRPCError } from "@trpc/server";

import { leadRepository } from "../repositories/lead.repository";

export const leadService = {
  // Récupérer tous les leads
  getAll: async () => {
    return await leadRepository.findAll();
  },

  // Récupérer un lead par ID
  getById: async (id: string) => {
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
    }

    return lead;
  },

  // Créer un lead
  create: async (
    input: {
      name: string;
      email?: string;
      company?: string;
      phone?: string;
    },
    userId: string
  ) => {
    return await leadRepository.create({
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      phone: input.phone || null,
      createdById: userId,
    });
  },

  // Mettre à jour un lead
  update: async (
    id: string,
    input: {
      name?: string;
      email?: string;
      company?: string;
      phone?: string;
    }
  ) => {
    // Préparer les données pour l'update
    const updateData: {
      name?: string;
      email?: string | null;
      company?: string | null;
      phone?: string | null;
    } = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.email !== undefined) {
      updateData.email = input.email || null;
    }
    if (input.company !== undefined) {
      updateData.company = input.company || null;
    }
    if (input.phone !== undefined) {
      updateData.phone = input.phone || null;
    }

    return await leadRepository.update(id, updateData);
  },

  // Supprimer un lead
  delete: async (id: string) => {
    return await leadRepository.delete(id);
  },
};
