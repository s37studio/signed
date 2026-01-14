import prisma from "@my-better-t-app/db";

export const leadRepository = {
  // Récupérer tous les leads
  findAll: async () => {
    return await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });
  },

  // Récupérer un lead par ID
  findById: async (id: string) => {
    return await prisma.lead.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        proposals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            status: true,
            templateId: true,
            token: true,
            createdAt: true,
            sentAt: true,
            openedAt: true,
            lastOpenedAt: true,
            viewCount: true,
            revisionMessage: true,
          },
        },
      },
    });
  },

  // Créer un lead
  create: async (data: {
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
    createdById: string;
  }) => {
    return await prisma.lead.create({
      data,
    });
  },

  // Mettre à jour un lead
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string | null;
      company?: string | null;
      phone?: string | null;
    }
  ) => {
    return await prisma.lead.update({
      where: { id },
      data,
    });
  },

  // Supprimer un lead
  delete: async (id: string) => {
    return await prisma.lead.delete({
      where: { id },
    });
  },
};
