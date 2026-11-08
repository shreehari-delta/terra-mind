import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('terramind_token'),
  setAuth: (user, token) => {
    localStorage.setItem('terramind_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('terramind_token');
    set({ user: null, token: null });
  },
}));