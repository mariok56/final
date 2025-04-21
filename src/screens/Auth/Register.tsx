import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../../components/ui/button";
import { useAuthStore } from '../../store/authStore';

// Define validation schema with Zod
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Infer TypeScript type from schema
type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  });

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    // Clear any previous errors
    setAuthError(null);
    clearError();
    
    // Attempt to register
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    
    if (result.success) {
      navigate('/booking');
    } else {
      setAuthError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[url(/register-bg.jpg)] bg-cover bg-center">
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
          
          <h2 className="text-2xl font-bold text-white text-center mb-6">Create an Account</h2>
          
          {(authError || error) && (
            <div className="bg-red-900/40 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
              {authError || error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className={`w-full p-3 bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none`}
                placeholder="Enter your full name"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
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
                placeholder="Create a password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full p-3 bg-gray-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none`}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className={`h-4 w-4 text-[#fbb034] focus:ring-[#fbb034] bg-gray-800 border-gray-700 ${errors.terms ? 'border-red-500' : ''}`}
                {...register('terms')}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-[#fbb034] hover:text-[#fbb034]/90">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#fbb034] hover:text-[#fbb034]/90">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold py-3 rounded-none"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#fbb034] hover:text-[#fbb034]/90 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};