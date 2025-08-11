import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userMobile: string | null;
  login: (mobile: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userMobile: null,
      login: (mobile: string) => set({ isAuthenticated: true, userMobile: mobile }),
      logout: () => set({ isAuthenticated: false, userMobile: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);