import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  Bars3Icon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const { role, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar, currentPage } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Bars3Icon className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{currentPage}</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <UserCircleIcon className="w-6 h-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {role} User
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 capitalize">{role} Account</p>
                    <p className="text-xs text-gray-500">Inventory Management</p>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`
                          w-full flex items-center px-4 py-2 text-sm text-left
                          ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                        `}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}