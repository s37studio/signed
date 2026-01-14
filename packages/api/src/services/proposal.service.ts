import { ProposalStatus } from "@my-better-t-app/db";
import { randomBytes, randomUUID, scrypt } from "crypto";
import { promisify } from "util";

import { proposalRepository } from "../repositories/proposal.repository";

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
      throw new Error("Proposal not found");
    }

    return proposal;
  },

  // Récupérer une propal par token (avec vérification password)
  getByToken: async (token: string, password?: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new Error("Proposal not found");
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
        throw new Error("Invalid password");
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
    // Générer un token unique (UUID natif Node.js)
    const token = randomUUID().replace(/-/g, "");

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
      leadId: input.leadId,
      createdById: userId,
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

  // Tracker une vue
  trackView: async (token: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    const isFirstView = !proposal.openedAt;

    return await proposalRepository.trackView(proposal.id, isFirstView);
  },

  // Client valide la propal (bouton "Valider")
  validateProposal: async (token: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    // Marquer comme envoyée si pas déjà fait
    if (!proposal.sentAt) {
      await proposalRepository.markAsSent(proposal.id);
    }

    // Changer le statut en WON
    return await proposalRepository.updateStatus(proposal.id, "WON");
  },

  // Client demande une révision
  requestRevision: async (token: string, message: string) => {
    const proposal = await proposalRepository.findByToken(token);

    if (!proposal) {
      throw new Error("Proposal not found");
    }

    // Changer le statut en REVISION avec le message du client
    return await proposalRepository.updateStatus(
      proposal.id,
      "REVISION",
      message
    );
  },

  // Supprimer une propal
  delete: async (id: string) => {
    return await proposalRepository.delete(id);
  },
};
