import prisma from "@my-better-t-app/db";

import { discordNotificationService } from "../services/discord-notification.service";

/**
 * Job qui vérifie les propositions envoyées il y a 3 jours et jamais ouvertes
 * Envoie une notification Discord pour chacune
 */
export async function checkProposalReminders() {
  console.log("Running daily proposal reminder check...");

  try {
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Début et fin de la journée il y a 3 jours
    const startOfDay = new Date(threeDaysAgo);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(threeDaysAgo);
    endOfDay.setHours(23, 59, 59, 999);

    // Propositions envoyées il y a exactement 3 jours, jamais ouvertes, statut PENDING
    const proposals = await prisma.proposal.findMany({
      where: {
        sentAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        openedAt: null,
        status: "PENDING",
      },
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

    console.log(
      `Found ${proposals.length} proposals sent 3 days ago and not yet opened`
    );

    for (const proposal of proposals) {
      console.log(`Sending reminder for proposal ${proposal.id}`);
      await discordNotificationService.notifyProposalReminder(proposal);
    }

    return {
      success: true,
      processedCount: proposals.length,
    };
  } catch (error) {
    console.error("Error running proposal reminder check:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
