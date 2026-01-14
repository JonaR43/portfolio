import prisma from '../config/database';
import { Project } from '@prisma/client';

export const projectsService = {
  async getAll(published?: boolean) {
    return prisma.project.findMany({
      where: published !== undefined ? { published } : undefined,
      orderBy: { order: 'asc' },
    });
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  async create(data: Omit<Project, 'createdAt' | 'updatedAt'>) {
    // Check if project with this ID already exists
    const existing = await prisma.project.findUnique({
      where: { id: data.id },
    });

    if (existing) {
      throw new Error('Project with this ID already exists');
    }

    return prisma.project.create({ data });
  },

  async update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Project not found');
    }

    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Project not found');
    }

    await prisma.project.delete({
      where: { id },
    });
  },

  async reorder(projectIds: string[]) {
    // Update order for each project
    const updates = projectIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { order: index + 1 },
      })
    );

    await prisma.$transaction(updates);
  },
};
