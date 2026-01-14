import api from './api';
import type { Project, ProjectInput } from '../types/project.types';

export const projectsService = {
  getAll: async (published?: boolean): Promise<Project[]> => {
    const params = published !== undefined ? { published: published.toString() } : {};
    const { data } = await api.get<{ projects: Project[] }>('/projects', { params });
    return data.projects;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get<{ project: Project }>(`/projects/${id}`);
    return data.project;
  },

  create: async (project: ProjectInput): Promise<Project> => {
    const { data } = await api.post<{ project: Project }>('/projects', project);
    return data.project;
  },

  update: async (id: string, updates: Partial<ProjectInput>): Promise<Project> => {
    const { data } = await api.put<{ project: Project }>(`/projects/${id}`, updates);
    return data.project;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  reorder: async (projectIds: string[]): Promise<void> => {
    await api.patch('/projects/reorder', { projectIds });
  },
};
