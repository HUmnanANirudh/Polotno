import { create } from 'zustand';
import { api, setTokenGetter, ApiError } from '../lib/api';
import type { UserResponse } from '@polotno/types';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setAccessToken: (token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Wire up the token getter so the API client can read the token
  setTokenGetter(() => get().accessToken);

  return {
    user: null,
    accessToken: null,
    isLoading: true, // true until initial fetchMe completes
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.post<{ user: UserResponse; accessToken: string }>(
          '/auth/login',
          { email, password }
        );
        set({
          user: res.data!.user,
          accessToken: res.data!.accessToken,
          isLoading: false,
        });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Login failed';
        set({ error: message, isLoading: false });
        throw err;
      }
    },

    register: async (name, email, password) => {
      set({ isLoading: true, error: null });
      try {
        const res = await api.post<{ user: UserResponse; accessToken: string }>(
          '/auth/register',
          { name, email, password }
        );
        set({
          user: res.data!.user,
          accessToken: res.data!.accessToken,
          isLoading: false,
        });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Registration failed';
        set({ error: message, isLoading: false });
        throw err;
      }
    },

    logout: async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        // Ignore errors — clear client state regardless
      }
      set({ user: null, accessToken: null, isLoading: false, error: null });
    },

    fetchMe: async () => {
      // First try to refresh the access token from the cookie
      try {
        const refreshRes = await api.post<{ accessToken: string }>('/auth/refresh');
        if (refreshRes.data?.accessToken) {
          set({ accessToken: refreshRes.data.accessToken });
        }
      } catch {
        set({ isLoading: false });
        return;
      }

      // Now fetch the user profile with the fresh token
      try {
        const res = await api.get<UserResponse>('/auth/me');
        set({ user: res.data!, isLoading: false });
      } catch {
        set({ user: null, accessToken: null, isLoading: false });
      }
    },

    setAccessToken: (token) => set({ accessToken: token }),
    clearError: () => set({ error: null }),
  };
});
