import prisma, { ProposalStatus } from "@my-better-t-app/db";
import { TRPCError } from "@trpc/server";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

import { proposalRepository } from "../repositories/proposal.repository";
import { generateProposalSlug, generateShortToken } from "../utils/slug";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(hash: string, password: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return key === derivedKey.toString("hex");
}

export const proposalService = {
  getAll: async (organizationId: string) => {
    return await proposalRepository.findAll(organizationId);
  },

  getById: async (id: string, organizationId: string) => {
    const proposal = await proposalRepository.findById(id, organizationId);
    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }
    return proposal;
  },

  getByToken: async (slugOrToken: string, password?: string) => {
    let proposal = await proposalRepository.findBySlug(slugOrToken);
    if (!proposal) {
      proposal = await proposalRepository.findByToken(slugOrToken);
    }
    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    if (proposal.password) {
      if (!password) {
        return { requiresPassword: true, token: proposal.token };
      }
      const isValid = await verifyPassword(proposal.password, password);
      if (!isValid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid password" });
      }
    }

    return proposal;
  },

  create: async (
    input: {
      title: string;
      templateId: string;
      customData: any;
      price: number;
      password?: string;
      leadId: string;
    },
    userId: string,
    organizationId: string
  ) => {
    const lead = await prisma.lead.findFirst({
      where: { id: input.leadId, organizationId },
      select: { name: true, company: true },
    });

    if (!lead) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
    }

    const slug = generateProposalSlug(lead);
    const token = generateShortToken();
    const hashedPassword = input.password ? await hashPassword(input.password) : null;

    return await proposalRepository.create({
      title: input.title,
      templateId: input.templateId,
      customData: input.customData,
      price: input.price,
      password: hashedPassword,
      token,
      slug,
      leadId: input.leadId,
      createdById: userId,
      organizationId,
      sentAt: new Date(),
    });
  },

  update: async (
    id: string,
    organizationId: string,
    input: { title?: string; customData?: any; price?: number; password?: string }
  ) => {
    const updateData: {
      title?: string;
      customData?: any;
      price?: number;
      password?: string | null;
    } = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.customData !== undefined) updateData.customData = input.customData;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.password !== undefined) {
      updateData.password = input.password ? await hashPassword(input.password) : null;
    }

    return await proposalRepository.update(id, organizationId, updateData);
  },

  updateStatus: async (id: string, status: ProposalStatus) => {
    return await proposalRepository.updateStatus(id, status);
  },

  validateProposal: async (token: string) => {
    const proposal = await proposalRepository.findByToken(token);
    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    if (!proposal.sentAt) {
      await proposalRepository.markAsSent(proposal.id);
    }

    const updatedProposal = await proposalRepository.updateStatus(proposal.id, "WON");

    const { discordNotificationService } = await import("./discord-notification.service");
    await discordNotificationService.notifyProposalAccepted(proposal);

    return updatedProposal;
  },

  requestRevision: async (token: string, message: string) => {
    const proposal = await proposalRepository.findByToken(token);
    if (!proposal) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Proposal not found" });
    }

    const updatedProposal = await proposalRepository.updateStatus(proposal.id, "REVISION", message);

    const { discordNotificationService } = await import("./discord-notification.service");
    await discordNotificationService.notifyRevisionRequested(proposal, message);

    return updatedProposal;
  },

  delete: async (id: string, organizationId: string) => {
    return await proposalRepository.delete(id, organizationId);
  },
};
