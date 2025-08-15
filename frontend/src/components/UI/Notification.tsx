import React, { useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/store/ui';

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

export default function Notification() {
  const { notification, hideNotification } = useUIStore();

  useEffect(() => {
    if (notification?.isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification?.isVisible, hideNotification]);

  if (!notification) return null;

  const Icon = icons[notification.type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <Transition
        show={notification.isVisible}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`
          rounded-lg border p-4 shadow-lg
          ${colors[notification.type]}
        `}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${iconColors[notification.type]}`} />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={hideNotification}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}