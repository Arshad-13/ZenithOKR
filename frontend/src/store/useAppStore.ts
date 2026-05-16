import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
}

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  
  // Real Auth State
  user: null, 
  token: localStorage.getItem('atomquest_token'), 
  
  setAuth: (user, token) => {
    localStorage.setItem('atomquest_token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('atomquest_token');
    set({ user: null, token: null });
  },
}));