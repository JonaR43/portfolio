import api from './api';
import type { ContactInfo } from '../types/contact.types';

export const contactService = {
  get: async (): Promise<ContactInfo> => {
    const { data } = await api.get<{ contact: ContactInfo }>('/contact');
    return data.contact;
  },

  update: async (updates: Partial<ContactInfo>): Promise<ContactInfo> => {
    const { data } = await api.put<{ contact: ContactInfo }>('/contact', updates);
    return data.contact;
  },
};
