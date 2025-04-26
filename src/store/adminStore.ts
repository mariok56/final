// src/store/adminStore.ts
import { create } from 'zustand';
import { AdminService, User, AppointmentWithUser, Service, Stylist, AdminStats } from '../services/adminService';

interface AdminState {
  // Users
  users: User[];
  usersPagination: {
    lastDoc: any;
    hasMore: boolean;
    loading: boolean;
  };
  
  // Appointments
  appointments: AppointmentWithUser[];
  appointmentsPagination: {
    lastDoc: any;
    hasMore: boolean;
    loading: boolean;
  };
  
  // Services
  services: Service[];
  servicesLoading: boolean;
  
  // Stylists
  stylists: Stylist[];
  stylistsLoading: boolean;
  
  // Stats
  stats: AdminStats | null;
  statsLoading: boolean;
  
  // Actions
  // Users
  fetchUsers: (filters?: { role?: string; status?: string; search?: string }) => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: 'admin' | 'user') => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  reactivateUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Appointments
  fetchAppointments: (filters?: { status?: string; date?: string; stylistId?: number; userId?: string }) => Promise<void>;
  loadMoreAppointments: () => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: string) => Promise<void>;
  
  // Services
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (serviceId: string, data: Partial<Service>) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  
  // Stylists
  fetchStylists: () => Promise<void>;
  addStylist: (stylist: Omit<Stylist, 'id'>) => Promise<void>;
  updateStylist: (stylistId: string, data: Partial<Stylist>) => Promise<void>;
  deleteStylist: (stylistId: string) => Promise<void>;
  
  // Stats
  fetchStats: () => Promise<void>;
  
  // Settings
  currentFilters: {
    users?: { role?: string; status?: string; search?: string };
    appointments?: { status?: string; date?: string; stylistId?: number; userId?: string };
  };
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  users: [],
  usersPagination: {
    lastDoc: null,
    hasMore: true,
    loading: false
  },
  appointments: [],
  appointmentsPagination: {
    lastDoc: null,
    hasMore: true,
    loading: false
  },
  services: [],
  servicesLoading: false,
  stylists: [],
  stylistsLoading: false,
  stats: null,
  statsLoading: false,
  currentFilters: {},
  
  // User actions
  fetchUsers: async (filters) => {
    set({ usersPagination: { ...get().usersPagination, loading: true } });
    try {
      const { users, lastDoc } = await AdminService.getAllUsers(10, undefined, filters);
      set({
        users,
        usersPagination: {
          lastDoc,
          hasMore: users.length === 10,
          loading: false
        },
        currentFilters: { ...get().currentFilters, users: filters }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ usersPagination: { ...get().usersPagination, loading: false } });
    }
  },
  
  loadMoreUsers: async () => {
    const { usersPagination, currentFilters } = get();
    if (!usersPagination.hasMore || usersPagination.loading) return;
    
    set({ usersPagination: { ...usersPagination, loading: true } });
    try {
      const { users, lastDoc } = await AdminService.getAllUsers(
        10, 
        usersPagination.lastDoc,
        currentFilters.users
      );
      set({
        users: [...get().users, ...users],
        usersPagination: {
          lastDoc,
          hasMore: users.length === 10,
          loading: false
        }
      });
    } catch (error) {
      console.error('Error loading more users:', error);
      set({ usersPagination: { ...get().usersPagination, loading: false } });
    }
  },
  
  updateUserRole: async (userId, role) => {
    try {
      await AdminService.updateUserRole(userId, role);
      set({
        users: get().users.map(user => 
          user.id === userId ? { ...user, role } : user
        )
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
  
  suspendUser: async (userId) => {
    try {
      await AdminService.suspendUser(userId);
      set({
        users: get().users.map(user => 
          user.id === userId ? { ...user, status: 'suspended' } : user
        )
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },
  
  reactivateUser: async (userId) => {
    try {
      await AdminService.reactivateUser(userId);
      set({
        users: get().users.map(user => 
          user.id === userId ? { ...user, status: 'active' } : user
        )
      });
    } catch (error) {
      console.error('Error reactivating user:', error);
      throw error;
    }
  },
  
  deleteUser: async (userId) => {
    try {
      await AdminService.deleteUser(userId);
      set({
        users: get().users.map(user => 
          user.id === userId ? { ...user, status: 'deleted' } : user
        )
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Appointment actions
  fetchAppointments: async (filters) => {
    set({ appointmentsPagination: { ...get().appointmentsPagination, loading: true } });
    try {
      const { appointments, lastDoc } = await AdminService.getAllAppointments(20, undefined, filters);
      set({
        appointments,
        appointmentsPagination: {
          lastDoc,
          hasMore: appointments.length === 20,
          loading: false
        },
        currentFilters: { ...get().currentFilters, appointments: filters }
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      set({ appointmentsPagination: { ...get().appointmentsPagination, loading: false } });
    }
  },
  
  loadMoreAppointments: async () => {
    const { appointmentsPagination, currentFilters } = get();
    if (!appointmentsPagination.hasMore || appointmentsPagination.loading) return;
    
    set({ appointmentsPagination: { ...appointmentsPagination, loading: true } });
    try {
      const { appointments, lastDoc } = await AdminService.getAllAppointments(
        20,
        appointmentsPagination.lastDoc,
        currentFilters.appointments
      );
      set({
        appointments: [...get().appointments, ...appointments],
        appointmentsPagination: {
          lastDoc,
          hasMore: appointments.length === 20,
          loading: false
        }
      });
    } catch (error) {
      console.error('Error loading more appointments:', error);
      set({ appointmentsPagination: { ...get().appointmentsPagination, loading: false } });
    }
  },
  
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      await AdminService.updateAppointmentStatus(appointmentId, status);
      set({
        appointments: get().appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },
  
  // Service actions
  fetchServices: async () => {
    set({ servicesLoading: true });
    try {
      const services = await AdminService.getAllServices();
      set({ services, servicesLoading: false });
    } catch (error) {
      console.error('Error fetching services:', error);
      set({ servicesLoading: false });
    }
  },
  
  addService: async (service) => {
    try {
      const id = await AdminService.addService(service);
      set({ services: [...get().services, { ...service, id }] });
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },
  
  updateService: async (serviceId, data) => {
    try {
      await AdminService.updateService(serviceId, data);
      set({
        services: get().services.map(service => 
          service.id === serviceId ? { ...service, ...data } : service
        )
      });
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },
  
  deleteService: async (serviceId) => {
    try {
      await AdminService.deleteService(serviceId);
      set({
        services: get().services.filter(service => service.id !== serviceId)
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },
  
  // Stylist actions
  fetchStylists: async () => {
    set({ stylistsLoading: true });
    try {
      const stylists = await AdminService.getAllStylists();
      set({ stylists, stylistsLoading: false });
    } catch (error) {
      console.error('Error fetching stylists:', error);
      set({ stylistsLoading: false });
    }
  },
  
  addStylist: async (stylist) => {
    try {
      const id = await AdminService.addStylist(stylist);
      set({ stylists: [...get().stylists, { ...stylist, id }] });
    } catch (error) {
      console.error('Error adding stylist:', error);
      throw error;
    }
  },
  
  updateStylist: async (stylistId, data) => {
    try {
      await AdminService.updateStylist(stylistId, data);
      set({
        stylists: get().stylists.map(stylist => 
          stylist.id === stylistId ? { ...stylist, ...data } : stylist
        )
      });
    } catch (error) {
      console.error('Error updating stylist:', error);
      throw error;
    }
  },
  
  deleteStylist: async (stylistId) => {
    try {
      await AdminService.deleteStylist(stylistId);
      set({
        stylists: get().stylists.filter(stylist => stylist.id !== stylistId)
      });
    } catch (error) {
      console.error('Error deleting stylist:', error);
      throw error;
    }
  },
  
  // Stats actions
  fetchStats: async () => {
    set({ statsLoading: true });
    try {
      const stats = await AdminService.getAdminStats();
      set({ stats, statsLoading: false });
    } catch (error) {
      console.error('Error fetching stats:', error);
      set({ statsLoading: false });
    }
  }
}));