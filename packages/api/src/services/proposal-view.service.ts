import prisma from "@my-better-t-app/db";
import { proposalViewRepository } from "../repositories/proposal-view.repository";

// API gratuite pour géolocalisation IP (1500 req/jour)
async function getLocationFromIP(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = (await response.json()) as {
      status: string;
      city?: string;
      country?: string;
      regionName?: string;
    };

    if (data.status === "success") {
      return {
        city: data.city,
        country: data.country,
        region: data.regionName,
      };
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }

  return {
    city: undefined,
    country: undefined,
    region: undefined,
  };
}

export const proposalViewService = {
  // Créer une nouvelle vue avec géolocalisation
  trackView: async (proposalId: string, ipAddress?: string) => {
    let location: {
      city?: string;
      country?: string;
      region?: string;
    } = {
      city: undefined,
      country: undefined,
      region: undefined,
    };

    // Géolocaliser l'IP si fournie
    if (ipAddress && ipAddress !== "127.0.0.1" && ipAddress !== "::1") {
      location = await getLocationFromIP(ipAddress);
    }

    // Créer la vue
    const view = await proposalViewRepository.create({
      proposalId,
      ipAddress,
      ...location,
    });

    // Mettre à jour openedAt/lastOpenedAt
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { lead: { select: { id: true, name: true, email: true, company: true } } },
    });
    if (proposal) {
      const updateData: { lastOpenedAt: Date; openedAt?: Date } = {
        lastOpenedAt: new Date(),
      };

      if (!proposal.openedAt) {
        updateData.openedAt = new Date();
        const { discordNotificationService } = await import("./discord-notification.service");
        await discordNotificationService.notifyProposalView(proposal, location);
      }

      await prisma.proposal.update({ where: { id: proposalId }, data: updateData });
    }

    return view;
  },

  // Mettre à jour la durée
  updateDuration: async (viewId: string, duration: number) => {
    return await proposalViewRepository.updateDuration(viewId, duration);
  },

  // Récupérer l'historique des vues
  getViewHistory: async (proposalId: string) => {
    return await proposalViewRepository.findByProposalId(proposalId);
  },
};
