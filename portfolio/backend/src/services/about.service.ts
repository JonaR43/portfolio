import prisma from '../config/database';

export const aboutService = {
  async get() {
    const about = await prisma.aboutSection.findUnique({
      where: { id: 'default' },
    });

    if (!about) {
      throw new Error('About section not found');
    }

    return about;
  },

  async update(data: any) {
    return prisma.aboutSection.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });
  },
};
