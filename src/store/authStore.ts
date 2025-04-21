// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Mock database of users (will be stored in localStorage)
interface MockDB {
  users: Array<User & { password: string }>;
}

// Auth store state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Helper methods
  clearError: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize or get mock database from localStorage
      const getMockDB = (): MockDB => {
        const dbString = localStorage.getItem('mockDB');
        if (dbString) {
          return JSON.parse(dbString);
        }
        // Initialize empty DB
        const initialDB: MockDB = { users: [] };
        localStorage.setItem('mockDB', JSON.stringify(initialDB));
        return initialDB;
      };

      // Save mock database to localStorage
      const saveMockDB = (db: MockDB) => {
        localStorage.setItem('mockDB', JSON.stringify(db));
      };

      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        register: async (data: RegisterData) => {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const db = getMockDB();
            
            // Check if user already exists
            const existingUser = db.users.find(user => user.email === data.email);
            if (existingUser) {
              set({ 
                isLoading: false, 
                error: 'Email already registered' 
              });
              return { success: false, message: 'Email already registered' };
            }
            
            // Create new user
            const newUser = {
              id: Date.now().toString(),
              name: data.name,
              email: data.email,
              password: data.password, // In a real app, this would be hashed
            };
            
            // Add to "database"
            db.users.push(newUser);
            saveMockDB(db);
            
            // Update auth state
            const { password, ...userWithoutPassword } = newUser;
            set({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true, message: 'Registration successful' };
          } catch (error) {
            set({ 
              isLoading: false, 
              error: 'Registration failed' 
            });
            return { success: false, message: 'Registration failed' };
          }
        },

        login: async (data: LoginData) => {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const db = getMockDB();
            
            // Find user by email
            const user = db.users.find(user => user.email === data.email);
            
            // Check if user exists and password matches
            if (!user || user.password !== data.password) {
              set({ 
                isLoading: false, 
                error: 'Invalid email or password' 
              });
              return { success: false, message: 'Invalid email or password' };
            }
            
            // Update auth state
            const { password, ...userWithoutPassword } = user;
            set({
              user: userWithoutPassword,
              isAuthenticated: true,
              isLoading: false,
            });
            
            return { success: true, message: 'Login successful' };
          } catch (error) {
            set({ 
              isLoading: false, 
              error: 'Login failed' 
            });
            return { success: false, message: 'Login failed' };
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
          });
        },

        clearError: () => {
          set({ error: null });
        },
      };
    },
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);