import prisma from "@my-better-t-app/db";

export const proposalViewRepository = {
  // Créer une nouvelle vue
  create: async (data: {
    proposalId: string;
    ipAddress?: string;
    city?: string;
    country?: string;
    region?: string;
  }) => {
    return await prisma.proposalView.create({
      data,
    });
  },

  // Mettre à jour la durée d'une vue
  updateDuration: async (id: string, duration: number) => {
    return await prisma.proposalView.update({
      where: { id },
      data: { duration },
    });
  },

  // Récupérer toutes les vues d'une proposition
  findByProposalId: async (proposalId: string) => {
    return await prisma.proposalView.findMany({
      where: { proposalId },
      orderBy: { viewedAt: "desc" },
    });
  },
};
