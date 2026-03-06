import { env } from "@my-better-t-app/env/server";

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  timestamp: string;
  footer?: { text: string };
}

interface DiscordWebhookPayload {
  content?: string;
  embeds: DiscordEmbed[];
}

// Couleurs Discord
const COLORS = {
  BLUE: 0x3b82f6, // Info - Vue
  GREEN: 0x10b981, // Succès - Acceptée
  ORANGE: 0xf97316, // Attention - Révision
  RED: 0xef4444, // Urgent - Rappel
};

const DASHBOARD_URL = `${env.APP_URL ?? "https://web-production-7dc7f.up.railway.app"}/dashboard`;

async function sendDiscordNotification(payload: DiscordWebhookPayload) {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("Discord webhook URL not configured, skipping notification");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to send Discord notification:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

export const discordNotificationService = {
  // Notification de vue de proposition
  notifyProposalView: async (
    proposal: any,
    location: { city?: string; country?: string; region?: string }
  ) => {
    const locationText = [location.city, location.region, location.country]
      .filter(Boolean)
      .join(", ") || "Localisation inconnue";

    const fields = [
      {
        name: "Client",
        value: `${proposal.lead?.name || "N/A"}${proposal.lead?.company ? ` (${proposal.lead.company})` : ""}`,
        inline: true,
      },
      {
        name: "Proposition",
        value: proposal.title,
        inline: true,
      },
      {
        name: "Localisation",
        value: locationText,
        inline: false,
      },
      {
        name: "Dashboard",
        value: `[Ouvrir le dashboard](${DASHBOARD_URL})`,
        inline: false,
      },
    ];

    await sendDiscordNotification({
      content: "@everyone",
      embeds: [
        {
          title: "👀 Proposition vue !",
          description: "Un client vient d'ouvrir votre proposition.",
          color: COLORS.BLUE,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "Notification de vue" },
        },
      ],
    });
  },

  // Notification d'acceptation de proposition
  notifyProposalAccepted: async (proposal: any) => {
    const fields = [
      {
        name: "Client",
        value: `${proposal.lead?.name || "N/A"}${proposal.lead?.company ? ` (${proposal.lead.company})` : ""}`,
        inline: true,
      },
      {
        name: "Proposition",
        value: proposal.title,
        inline: true,
      },
      {
        name: "Dashboard",
        value: `[Ouvrir le dashboard](${DASHBOARD_URL})`,
        inline: false,
      },
    ];

    await sendDiscordNotification({
      content: "@everyone",
      embeds: [
        {
          title: "🎉 Proposition acceptée !",
          description: "Félicitations ! Un client a accepté votre proposition.",
          color: COLORS.GREEN,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "Notification d'acceptation" },
        },
      ],
    });
  },

  // Notification de demande de révision
  notifyRevisionRequested: async (proposal: any, message: string) => {
    const fields = [
      {
        name: "Client",
        value: `${proposal.lead?.name || "N/A"}${proposal.lead?.company ? ` (${proposal.lead.company})` : ""}`,
        inline: true,
      },
      {
        name: "Proposition",
        value: proposal.title,
        inline: true,
      },
      {
        name: "Message du client",
        value: message || "Aucun message",
        inline: false,
      },
      {
        name: "Dashboard",
        value: `[Ouvrir le dashboard](${DASHBOARD_URL})`,
        inline: false,
      },
    ];

    await sendDiscordNotification({
      content: "@everyone",
      embeds: [
        {
          title: "💬 Demande de révision",
          description:
            "Un client a demandé des modifications sur votre proposition.",
          color: COLORS.ORANGE,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "Notification de révision" },
        },
      ],
    });
  },

  // Notification de rappel (proposition non ouverte après 3 jours)
  notifyProposalReminder: async (proposal: any) => {
    const fields = [
      {
        name: "Client",
        value: `${proposal.lead?.name || "N/A"}${proposal.lead?.company ? ` (${proposal.lead.company})` : ""}`,
        inline: true,
      },
      {
        name: "Proposition",
        value: proposal.title,
        inline: true,
      },
      {
        name: "Envoyée le",
        value: proposal.sentAt
          ? new Date(proposal.sentAt).toLocaleDateString("fr-FR")
          : "Date inconnue",
        inline: false,
      },
      {
        name: "Dashboard",
        value: `[Ouvrir le dashboard](${DASHBOARD_URL})`,
        inline: false,
      },
    ];

    await sendDiscordNotification({
      content: "@everyone",
      embeds: [
        {
          title: "⚠️ Rappel : Proposition non ouverte",
          description:
            "Cette proposition a été envoyée il y a 3 jours mais n'a pas encore été ouverte par le client.",
          color: COLORS.RED,
          fields,
          timestamp: new Date().toISOString(),
          footer: { text: "Rappel 3 jours" },
        },
      ],
    });
  },
};
