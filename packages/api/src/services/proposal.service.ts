import prisma, { ProposalStatus } from "@my-better-t-app/db";
import { TRPCError } from "@trpc/server";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

import { proposalRepository } from "../repositories/proposal.repository";
import { generateProposalSlug, generateShortToken } from "../utils/slug";

const scryptAsync = promisify(scrypt);

// Helper pour hasher le password (même système que Better Auth)
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

// Helper pour vérifier le password
async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return key === derivedKey.toString("hex");
}

export const proposalService = {
  // Récupérer toutes les propals
  getAll: async () => {
    return await proposalRepository.findAll();
  },

  // Récupérer une propal par ID
  getById: async (id: string) => {
    const proposal = await proposalRepository.findById(id);

    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    return proposal;
  },

  // Récupérer une propal par slug ou token (rétrocompatibilité)
  getByToken: async (slugOrToken: string, password?: string) => {
    // Essayer d'abord par slug
    let proposal = await proposalRepository.findBySlug(slugOrToken);

    // Si pas trouvé, essayer par token (ancien système)
    if (!proposal) {
      proposal = await proposalRepository.findByToken(slugOrToken);
    }

    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    if (proposal.password) {
      if (!password) {
        return {
          requiresPassword: true,
          token: proposal.token,
        };
      }

      const isValid = await verifyPassword(proposal.password, password);
      if (!isValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid password" });
      }
    }

    return proposal;
  },

  // Créer une propal
  create: async (
    input: {
      title: string;
      templateId: string;
      customData: any;
      password?: string;
      leadId: string;
    },
    userId: string
  ) => {
    // Récupérer le lead pour générer le slug
    const lead = await prisma.lead.findUnique({
      where: { id: input.leadId },
      select: { name: true, company: true },
    });

    if (!lead) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
    }

    // Générer slug + token court
    const slug = generateProposalSlug(lead);
    const token = generateShortToken();

    // Hasher le password si présent
    const hashedPassword = input.password
      ? await hashPassword(input.password)
      : null;

    return await proposalRepository.create({
      title: input.title,
      templateId: input.templateId,
      customData: input.customData,
      password: hashedPassword,
      token,
      slug,
      leadId: input.leadId,
      createdById: userId,
      sentAt: new Date(), // Marquer comme envoyée immédiatement
    });
  },

  // Mettre à jour une propal
  update: async (
    id: string,
    input: {
      title?: string;
      customData?: any;
      password?: string;
    }
  ) => {
    const updateData: {
      title?: string;
      customData?: any;
      password?: string | null;
    } = {};

    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    if (input.customData !== undefined) {
      updateData.customData = input.customData;
    }
    if (input.password !== undefined) {
      updateData.password = input.password
        ? await hashPassword(input.password)
        : null;
    }

    return await proposalRepository.update(id, updateData);
  },

  // Mettre à jour le statut manuellement
  updateStatus: async (id: string, status: ProposalStatus) => {
    return await proposalRepository.updateStatus(id, status);
  },

  // Client valide la propal (bouton "Valider")
  validateProposal: async (token: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    // Marquer comme envoyée si pas déjà fait
    if (!proposal.sentAt) {
      await proposalRepository.markAsSent(proposal.id);
    }

    // Changer le statut en WON
    const updatedProposal = await proposalRepository.updateStatus(
      proposal.id,
      "WON"
    );

    // Notification Discord
    const { discordNotificationService } = await import(
      "./discord-notification.service"
    );
    await discordNotificationService.notifyProposalAccepted(proposal);

    return updatedProposal;
  },

  // Client demande une révision
  requestRevision: async (token: string, message: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    // Changer le statut en REVISION avec le message du client
    const updatedProposal = await proposalRepository.updateStatus(
      proposal.id,
      "REVISION",
      message
    );

    // Notification Discord
    const { discordNotificationService } = await import(
      "./discord-notification.service"
    );
    await discordNotificationService.notifyRevisionRequested(proposal, message);

    return updatedProposal;
  },

  // Supprimer une propal
  delete: async (id: string) => {
    return await proposalRepository.delete(id);
  },
};
