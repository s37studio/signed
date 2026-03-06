import prisma from "@my-better-t-app/db";

export const leadRepository = {
  findAll: async (organizationId: string) => {
    return await prisma.lead.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { proposals: true },
        },
      },
    });
  },

  findById: async (id: string, organizationId: string) => {
    return await prisma.lead.findFirst({
      where: { id, organizationId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        proposals: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            status: true,
            templateId: true,
            token: true,
            createdAt: true,
            sentAt: true,
            openedAt: true,
            lastOpenedAt: true,
            revisionMessage: true,
            _count: { select: { views: true } },
          },
        },
      },
    });
  },

  create: async (data: {
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
    createdById: string;
    organizationId: string;
  }) => {
    return await prisma.lead.create({ data });
  },

  update: async (
    id: string,
    organizationId: string,
    data: {
      name?: string;
      email?: string | null;
      company?: string | null;
      phone?: string | null;
    }
  ) => {
    return await prisma.lead.update({
      where: { id, organizationId },
      data,
    });
  },

  delete: async (id: string, organizationId: string) => {
    return await prisma.lead.delete({
      where: { id, organizationId },
    });
  },
};
