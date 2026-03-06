import prisma, { ProposalStatus } from "@my-better-t-app/db";

export const proposalRepository = {
  findAll: async (organizationId: string) => {
    return await prisma.proposal.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        lead: {
          select: { id: true, name: true, email: true, company: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { views: true } },
      },
    });
  },

  findById: async (id: string, organizationId: string) => {
    return await prisma.proposal.findFirst({
      where: { id, organizationId },
      include: {
        lead: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  findByToken: async (token: string) => {
    return await prisma.proposal.findUnique({
      where: { token },
      include: {
        lead: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });
  },

  findBySlug: async (slug: string) => {
    return await prisma.proposal.findFirst({
      where: { slug },
      include: {
        lead: {
          select: { id: true, name: true, email: true, company: true },
        },
      },
    });
  },

  create: async (data: {
    title: string;
    templateId: string;
    customData: any;
    password: string | null;
    token: string;
    slug: string;
    leadId: string;
    createdById: string;
    organizationId: string;
    sentAt?: Date;
  }) => {
    return await prisma.proposal.create({ data });
  },

  update: async (
    id: string,
    organizationId: string,
    data: {
      title?: string;
      customData?: any;
      password?: string | null;
      openedAt?: Date;
      lastOpenedAt?: Date;
    }
  ) => {
    return await prisma.proposal.update({
      where: { id, organizationId },
      data,
    });
  },

  updateStatus: async (id: string, status: ProposalStatus, revisionMessage?: string) => {
    return await prisma.proposal.update({
      where: { id },
      data: {
        status,
        ...(revisionMessage !== undefined && { revisionMessage }),
      },
    });
  },

  markAsSent: async (id: string) => {
    return await prisma.proposal.update({
      where: { id },
      data: { sentAt: new Date() },
    });
  },

  delete: async (id: string, organizationId: string) => {
    return await prisma.proposal.delete({
      where: { id, organizationId },
    });
  },
};
