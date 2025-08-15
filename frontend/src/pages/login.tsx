import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, CubeIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { LoginRequest } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

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

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      router.push('/');
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
            Welcome to StoreTrack
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to manage inventory
          </p>
        </div>

        {/* Login Form */}
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
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register('username', { 
                required: 'Username is required',
                minLength: { value: 2, message: 'Username must be at least 2 characters' }
              })}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={LockClosedIcon}
                placeholder="Enter your password"
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

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need an account?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/*/!* Demo credentials *!/*/}
        {/*<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">*/}
        {/*  <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo Credentials</h3>*/}
        {/*  <div className="text-xs text-yellow-700 space-y-1">*/}
        {/*    <p><strong>Admin:</strong> admin / admin123</p>*/}
        {/*    <p><strong>Staff:</strong> staff / staff123</p>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}