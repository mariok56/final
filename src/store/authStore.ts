// src/store/firebaseAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Define user types
interface User {
  id: string;
  name: string;
  email: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Auth store state
interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  
  // Password methods
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  
  // Helper methods
  clearError: () => void;
  initializeAuth: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Create user with Firebase
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );
          
          // Update profile with display name
          await updateProfile(userCredential.user, {
            displayName: data.name
          });
          
          // Update store state
          set({
            user: {
              id: userCredential.user.uid,
              name: data.name,
              email: data.email,
            },
            firebaseUser: userCredential.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, message: 'Registration successful' };
        } catch (error: any) {
          let errorMessage = 'Registration failed';
          
          // Handle Firebase error codes
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'Email already registered';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address';
              break;
            case 'auth/operation-not-allowed':
              errorMessage = 'Registration is currently disabled';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password should be at least 6 characters';
              break;
            default:
              errorMessage = error.message || 'Registration failed';
          }
          
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          return { success: false, message: errorMessage };
        }
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Sign in with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );
          
          // Update store state
          set({
            user: {
              id: userCredential.user.uid,
              name: userCredential.user.displayName || '',
              email: userCredential.user.email || '',
            },
            firebaseUser: userCredential.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, message: 'Login successful' };
        } catch (error: any) {
          let errorMessage = 'Login failed';
          
          // Handle Firebase error codes
          switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = 'Invalid email or password';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This account has been disabled';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later';
              break;
            default:
              errorMessage = error.message || 'Login failed';
          }
          
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          return { success: false, message: errorMessage };
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({
            user: null,
            firebaseUser: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      requestPasswordReset: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
          return { success: true, message: 'Password reset email sent' };
        } catch (error: any) {
          let errorMessage = 'Failed to send password reset email';
          
          switch (error.code) {
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address';
              break;
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email';
              break;
            default:
              errorMessage = error.message || 'Failed to send password reset email';
          }
          
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          return { success: false, message: errorMessage };
        }
      },

      clearError: () => {
        set({ error: null });
      },

      initializeAuth: () => {
        // Listen for auth state changes
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            set({
              user: {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
              },
              firebaseUser,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              firebaseUser: null,
              isAuthenticated: false,
            });
          }
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        // We don't persist Firebase user object
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);