import prisma from '../config/database';

export const contactService = {
  async get() {
    const contact = await prisma.contactInfo.findUnique({
      where: { id: 'default' },
    });

    if (!contact) {
      throw new Error('Contact info not found');
    }

    return contact;
  },

  async update(data: any) {
    return prisma.contactInfo.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });
  },
};
