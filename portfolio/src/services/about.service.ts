import api from './api';
import type { AboutSection } from '../types/about.types';

export const aboutService = {
  get: async (): Promise<AboutSection> => {
    const { data } = await api.get<{ about: AboutSection }>('/about');
    return data.about;
  },

  update: async (updates: Partial<AboutSection>): Promise<AboutSection> => {
    const { data } = await api.put<{ about: AboutSection }>('/about', updates);
    return data.about;
  },
};
