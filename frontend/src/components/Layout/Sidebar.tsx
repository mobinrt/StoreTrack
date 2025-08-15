import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  CubeIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'staff'] },
  { name: 'Items', href: '/items', icon: CubeIcon, roles: ['admin', 'staff'] },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, roles: ['admin', 'staff'] },
  { name: 'Stock History', href: '/stock-history', icon: ClockIcon, roles: ['admin'] },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['admin'] },
];

export default function Sidebar() {
  const router = useRouter();
  const { role } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(role || '')
  );

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CubeIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">StoreTrack</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-primary-500' : 'text-gray-400'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {role?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{role} User</p>
                <p className="text-xs text-gray-500">Logged in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}