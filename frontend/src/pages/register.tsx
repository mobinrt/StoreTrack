import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, CubeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { RegisterRequest } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const { showNotification } = useUIStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      await registerUser(data);
      showNotification('Registration successful! Please login.', 'success');
      router.push('/login');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CubeIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join StoreTrack to manage inventory efficiently
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              icon={UserIcon}
              placeholder="Choose a username"
              error={errors.username?.message}
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                pattern: { 
                  value: /^[a-zA-Z0-9_]+$/, 
                  message: 'Username can only contain letters, numbers, and underscores' 
                }
              })}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={LockClosedIcon}
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={togglePasswordVisibility}
                style={{ marginTop: '12px' }}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div>
              <label className="label">Role</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="staff"
                    className="text-primary-600 focus:ring-primary-500"
                    {...register('role', { required: 'Please select a role' })}
                  />
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Staff</p>
                      <p className="text-xs text-gray-500">Basic inventory operations</p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="admin"
                    className="text-primary-600 focus:ring-primary-500"
                    {...register('role', { required: 'Please select a role' })}
                  />
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin</p>
                      <p className="text-xs text-gray-500">Full system access and management</p>
                    </div>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}