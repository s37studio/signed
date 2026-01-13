import prisma, { ProposalStatus } from "@my-better-t-app/db";

export const proposalRepository = {
  // Récupérer toutes les propals
  findAll: async () => {
    return await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Récupérer une propal par ID
  findById: async (id: string) => {
    return await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  // Récupérer une propal par token
  findByToken: async (token: string) => {
    return await prisma.proposal.findUnique({
      where: { token },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });
  },

  // Créer une propal
  create: async (data: {
    title: string;
    templateId: string;
    customData: any;
    password: string | null;
    token: string;
    leadId: string;
    createdById: string;
  }) => {
    return await prisma.proposal.create({
      data,
    });
  },

  // Mettre à jour une propal
  update: async (
    id: string,
    data: {
      title?: string;
      customData?: any;
      password?: string | null;
    }
  ) => {
    return await prisma.proposal.update({
      where: { id },
      data,
    });
  },

  // Mettre à jour le statut
  updateStatus: async (id: string, status: ProposalStatus, revisionMessage?: string) => {
    return await prisma.proposal.update({
      where: { id },
      data: { 
        status,
        ...(revisionMessage !== undefined && { revisionMessage }),
      },
    });
  },

  // Tracker une vue
  trackView: async (id: string, isFirstView: boolean) => {
    return await prisma.proposal.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
        lastOpenedAt: new Date(),
        ...(isFirstView && { openedAt: new Date() }),
      },
    });
  },

  // Marquer comme envoyée
  markAsSent: async (id: string) => {
    return await prisma.proposal.update({
      where: { id },
      data: { sentAt: new Date() },
    });
  },

  // Supprimer une propal
  delete: async (id: string) => {
    return await prisma.proposal.delete({
      where: { id },
    });
  },
};
