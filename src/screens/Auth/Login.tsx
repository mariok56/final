// src/screens/Auth/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../../components/ui/button";
import { useAuthStore } from '../../store/authStore';

// Define validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

// Infer TypeScript type from schema
type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  });

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    // Clear any previous errors
    setAuthError(null);
    clearError();
    
    // Attempt to login
    const result = await login({ 
      email: data.email, 
      password: data.password 
    });
    
    if (result.success) {
      navigate('/booking');
    } else {
      setAuthError(result.message);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt('Enter your email address:');
    if (email) {
      const result = await useAuthStore.getState().requestPasswordReset(email);
      if (result.success) {
        alert('Password reset email sent. Please check your inbox.');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url(/login-bg.jpg)] bg-cover bg-center">
      <div className="min-h-screen bg-black/80 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center">
              <img className="w-12 h-9" alt="Logo" src="/logo.svg" />
              <img
                className="w-12 h-4 ml-2"
                alt="Saloon"
                src="/saloon.svg"
              />
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h2>
          
          {(authError || error) && (
            <div className="bg-red-900/40 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
              {authError || error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                className={`w-full p-3 bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none`}
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`w-full p-3 bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none`}
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[#fbb034] focus:ring-[#fbb034] bg-gray-800 border-gray-700"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-[#fbb034] hover:text-[#fbb034]/90"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold py-3 rounded-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#fbb034] hover:text-[#fbb034]/90 font-medium">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};