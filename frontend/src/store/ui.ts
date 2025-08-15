import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  currentPage: string;
  isLoading: boolean;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  } | null;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (isLoading: boolean) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // State
  isSidebarOpen: true,
  currentPage: 'Dashboard',
  isLoading: false,
  notification: null,

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

  showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    set({
      notification: {
        message,
        type,
        isVisible: true,
      },
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      set((state) => 
        state.notification ? { ...state, notification: { ...state.notification, isVisible: false } } : state
      );
    }, 5000);
  },

  hideNotification: () => {
    set((state) => 
      state.notification ? { ...state, notification: { ...state.notification, isVisible: false } } : state
    );
  },
}));