import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';

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

// Mock JWT token generation
const generateToken = (userId: string): string => {
  // In a real app, use proper JWT library
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }));
};

// Mock database of users (will be stored in localStorage)
interface MockDB {
  users: Array<User & { passwordHash: string }>;
}

// Auth store state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Password methods
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
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

      // Password validation
      const validatePassword = (password: string): { valid: boolean; message: string } => {
        if (password.length < 8) {
          return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/[A-Z]/.test(password)) {
          return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
          return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
          return { valid: false, message: 'Password must contain at least one number' };
        }
        if (!/[!@#$%^&*]/.test(password)) {
          return { valid: false, message: 'Password must contain at least one special character' };
        }
        return { valid: true, message: '' };
      };

      return {
        user: null,
        token: null,
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
            
            // Validate password
            const passwordValidation = validatePassword(data.password);
            if (!passwordValidation.valid) {
              set({ 
                isLoading: false, 
                error: passwordValidation.message
              });
              return { success: false, message: passwordValidation.message };
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(data.password, salt);
            
            // Create new user
            const newUser = {
              id: Date.now().toString(),
              name: data.name,
              email: data.email,
              passwordHash,
            };
            
            // Add to "database"
            db.users.push(newUser);
            saveMockDB(db);
            
            // Generate token
            const token = generateToken(newUser.id);
            
            // Update auth state
            const { passwordHash: _, ...userWithoutPassword } = newUser;
            set({
              user: userWithoutPassword,
              token,
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
            
            if (!user) {
              set({ 
                isLoading: false, 
                error: 'Invalid email or password' 
              });
              return { success: false, message: 'Invalid email or password' };
            }
            
            // Check password
            const passwordMatch = await bcrypt.compare(data.password, user.passwordHash);
            
            if (!passwordMatch) {
              set({ 
                isLoading: false, 
                error: 'Invalid email or password' 
              });
              return { success: false, message: 'Invalid email or password' };
            }
            
            // Generate token
            const token = generateToken(user.id);
            
            // Update auth state
            const { passwordHash: _, ...userWithoutPassword } = user;
            set({
              user: userWithoutPassword,
              token,
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
            token: null,
            isAuthenticated: false,
          });
        },

        requestPasswordReset: async (email: string) => {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const db = getMockDB();
            const user = db.users.find(user => user.email === email);
            
            if (user) {
              // In a real app, you'd send an email with reset link
              const resetToken = btoa(JSON.stringify({ email, exp: Date.now() + 3600000 }));
              localStorage.setItem(`reset_${email}`, resetToken);
            }
            
            set({ isLoading: false });
            // Always return success to prevent email enumeration
            return { success: true, message: 'If an account exists, a reset email has been sent' };
          } catch (error) {
            set({ 
              isLoading: false, 
              error: 'Request failed' 
            });
            return { success: false, message: 'Request failed' };
          }
        },

        resetPassword: async (token: string, newPassword: string) => {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            // Decode token
            const decoded = JSON.parse(atob(token));
            if (decoded.exp < Date.now()) {
              throw new Error('Token expired');
            }
            
            const db = getMockDB();
            const userIndex = db.users.findIndex(user => user.email === decoded.email);
            
            if (userIndex === -1) {
              throw new Error('User not found');
            }
            
            // Validate new password
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.valid) {
              set({ 
                isLoading: false, 
                error: passwordValidation.message
              });
              return { success: false, message: passwordValidation.message };
            }
            
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);
            
            // Update user password
            db.users[userIndex].passwordHash = passwordHash;
            saveMockDB(db);
            
            // Clear reset token
            localStorage.removeItem(`reset_${decoded.email}`);
            
            set({ isLoading: false });
            return { success: true, message: 'Password reset successful' };
          } catch (error) {
            set({ 
              isLoading: false, 
              error: 'Reset failed' 
            });
            return { success: false, message: 'Reset failed' };
          }
        },

        clearError: () => {
          set({ error: null });
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);