import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const { setCurrentPage } = useUIStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Update current page title
  useEffect(() => {
    if (title) {
      setCurrentPage(title);
    }
  }, [title, setCurrentPage]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login' && router.pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Don't render layout for auth pages
  if (router.pathname === '/login' || router.pathname === '/register') {
    return <>{children}</>;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}