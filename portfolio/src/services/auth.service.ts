import api from './api';
import type { LoginCredentials, LoginResponse, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },

  me: async (): Promise<{ user: User }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
