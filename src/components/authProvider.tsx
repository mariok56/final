// src/components/AuthProvider.tsx
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize Firebase auth listener
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};