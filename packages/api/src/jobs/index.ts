import cron from "node-cron";

import { checkProposalReminders } from "./proposal-reminder.job";

/**
 * Démarre tous les jobs planifiés
 */
export function startScheduler() {
  console.log("Starting scheduler for background jobs...");

  // Job de rappel des propositions - Tous les jours à 10h (timezone du serveur)
  cron.schedule("0 10 * * *", async () => {
    await checkProposalReminders();
  });

  console.log("✓ Scheduler started. Jobs configured:");
  console.log("  - Proposal reminders: daily at 10:00 AM");
}
