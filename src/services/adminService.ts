// src/services/adminService.ts
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  addDoc,
  writeBatch
} from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended' | 'deleted';
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface AppointmentWithUser {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  stylistId: number;
  services: { name: string; price: number; duration: number }[];
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  category: string;
  isActive: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availableDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
  rating: number;
  experience: string;
  status: 'active' | 'inactive';
}

export class AdminService {
  // User Management
  static async getAllUsers(
    pageSize = 10, 
    lastDoc?: any,
    filters?: { role?: string; status?: string; search?: string }
  ): Promise<{ users: User[]; lastDoc: any }> {
    let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    if (filters?.role) {
      q = query(q, where('role', '==', filters.role));
    }
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    q = query(q, limit(pageSize));
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return { users, lastDoc: lastVisible };
  }

  static async updateUserRole(userId: string, newRole: 'admin' | 'user'): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
  }

  static async suspendUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: 'suspended' });
  }

  static async reactivateUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: 'active' });
  }

  static async deleteUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status: 'deleted' });
  }

  // Appointment Management
  static async getAllAppointments(
    pageSize = 20,
    lastDoc?: any,
    filters?: { 
      status?: string; 
      date?: string; 
      stylistId?: number;
      userId?: string;
    }
  ): Promise<{ appointments: AppointmentWithUser[]; lastDoc: any }> {
    let q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.date) {
      q = query(q, where('date', '==', filters.date));
    }
    
    if (filters?.stylistId) {
      q = query(q, where('stylistId', '==', filters.stylistId));
    }
    
    if (filters?.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    q = query(q, limit(pageSize));
    
    const snapshot = await getDocs(q);
    
    // Fetch user details for each appointment
    const appointments = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const appointment = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', appointment.userId));
        const userData = userDoc.data();
        
        return {
          id: docSnap.id,
          ...appointment,
          userName: userData?.name || 'Unknown',
          userEmail: userData?.email || 'unknown'
        } as AppointmentWithUser;
      })
    );
    
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
    return { appointments, lastDoc: lastVisible };
  }

  static async updateAppointmentStatus(appointmentId: string, status: string): Promise<void> {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status });
  }

  // Service Management
  static async getAllServices(): Promise<Service[]> {
    const snapshot = await getDocs(collection(db, 'services'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Service[];
  }

  static async addService(service: Omit<Service, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'services'), service);
    return docRef.id;
  }

  static async updateService(serviceId: string, data: Partial<Service>): Promise<void> {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, data);
  }

  static async deleteService(serviceId: string): Promise<void> {
    const serviceRef = doc(db, 'services', serviceId);
    await deleteDoc(serviceRef);
  }

  // Stylist Management
  static async getAllStylists(): Promise<Stylist[]> {
    const snapshot = await getDocs(collection(db, 'stylists'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Stylist[];
  }

  static async addStylist(stylist: Omit<Stylist, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'stylists'), stylist);
    return docRef.id;
  }

  static async updateStylist(stylistId: string, data: Partial<Stylist>): Promise<void> {
    const stylistRef = doc(db, 'stylists', stylistId);
    await updateDoc(stylistRef, data);
  }

  static async deleteStylist(stylistId: string): Promise<void> {
    const stylistRef = doc(db, 'stylists', stylistId);
    await deleteDoc(stylistRef);
  }

  // Analytics & Reporting
  static async getAdminStats(): Promise<AdminStats> {
    // Get total users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const totalUsers = usersSnapshot.size;
    const activeUsers = usersSnapshot.docs.filter(doc => doc.data().status === 'active').length;
    
    // Get appointments
    const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
    const totalAppointments = appointmentsSnapshot.size;
    
    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todayQuery = query(collection(db, 'appointments'), where('date', '==', today));
    const todaySnapshot = await getDocs(todayQuery);
    const todayAppointments = todaySnapshot.size;
    
    // Calculate revenue
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    appointmentsSnapshot.docs.forEach(doc => {
      const appointment = doc.data();
      if (appointment.status === 'completed') {
        totalRevenue += appointment.totalPrice;
        
        const appointmentDate = new Date(appointment.date);
        if (appointmentDate.getMonth() === currentMonth && 
            appointmentDate.getFullYear() === currentYear) {
          monthlyRevenue += appointment.totalPrice;
        }
      }
    });
    
    return {
      totalUsers,
      activeUsers,
      totalAppointments,
      todayAppointments,
      totalRevenue,
      monthlyRevenue
    };
  }

  static async getRevenueReport(startDate: string, endDate: string): Promise<{
    date: string;
    revenue: number;
    appointments: number;
  }[]> {
    const reportQuery = query(
      collection(db, 'appointments'),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      where('status', '==', 'completed'),
      orderBy('date')
    );
    
    const snapshot = await getDocs(reportQuery);
    const reportData: { [key: string]: { revenue: number; appointments: number } } = {};
    
    snapshot.docs.forEach(doc => {
      const appointment = doc.data();
      const date = appointment.date;
      
      if (!reportData[date]) {
        reportData[date] = { revenue: 0, appointments: 0 };
      }
      
      reportData[date].revenue += appointment.totalPrice;
      reportData[date].appointments += 1;
    });
    
    return Object.entries(reportData).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      appointments: data.appointments
    }));
  }

  // Bulk Operations
  static async bulkUpdateServices(updates: { id: string; data: Partial<Service> }[]): Promise<void> {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const serviceRef = doc(db, 'services', id);
      batch.update(serviceRef, data);
    });
    
    await batch.commit();
  }

  static async bulkDeleteUsers(userIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    
    userIds.forEach(userId => {
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, { status: 'deleted' });
    });
    
    await batch.commit();
  }
}