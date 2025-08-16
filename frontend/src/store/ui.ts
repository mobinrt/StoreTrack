import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  currentPage: string;
  isLoading: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (isLoading: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  isSidebarOpen: true,
  currentPage: 'Dashboard',
  isLoading: false,

  // Actions
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen: boolean) => {
    set({ isSidebarOpen: isOpen });
  },

  setCurrentPage: (page: string) => {
    set({ currentPage: page });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));