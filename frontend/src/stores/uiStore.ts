import { create } from 'zustand';

interface UIStore {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export default useUIStore;
