// src/store/bookingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// Types
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  image: string;
}

interface Stylist {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  availableDays: number[];
  workingHours: {
    start: string;
    end: string;
  };
}

interface Appointment {
  id: string;
  userId: string;
  stylistId: number;
  services: Service[];
  date: string;
  startTime: string;
  endTime: string;
  totalDuration: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  createdAt: string;
  notes?: string;
}

interface BookingState {
  appointments: Appointment[];
  stylists: Stylist[];
  services: Service[];
  selectedServices: Service[];
  selectedStylist: Stylist | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  selectStylist: (stylist: Stylist | null) => void;
  selectDate: (date: string | null) => void;
  selectTimeSlot: (timeSlot: TimeSlot | null) => void;
  createAppointment: (userId: string, notes?: string) => Promise<Appointment>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  getStylistAvailability: (stylistId: number, date: string | null) => TimeSlot[];
  generateICalendarEvent: (appointment: Appointment) => string;
  fetchAppointments: (userId?: string) => Promise<void>;
}

// Helper functions
const generateTimeSlots = (date: string, stylist: Stylist, existingAppointments: Appointment[], duration: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  if (!date) return slots;
  
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  
  if (!stylist.availableDays.includes(dayOfWeek)) {
    return slots;
  }
  
  const [startHour, startMinute] = stylist.workingHours.start.split(':').map(Number);
  const [endHour, endMinute] = stylist.workingHours.end.split(':').map(Number);
  
  const startTime = new Date(dateObj);
  startTime.setHours(startHour, startMinute, 0);
  
  const endTime = new Date(dateObj);
  endTime.setHours(endHour, endMinute, 0);
  
  let currentTime = new Date(startTime);
  
  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().slice(0, 5);
    const slotEndTime = new Date(currentTime.getTime() + duration * 60000);
    
    // Check if slot conflicts with existing appointments
    const hasConflict = existingAppointments.some(appointment => {
      if (appointment.stylistId !== stylist.id || appointment.date !== date) return false;
      
      const apptStart = new Date(`${appointment.date} ${appointment.startTime}`);
      const apptEnd = new Date(`${appointment.date} ${appointment.endTime}`);
      const slotStart = currentTime;
      const slotEnd = slotEndTime;
      
      return (slotStart >= apptStart && slotStart < apptEnd) ||
             (slotEnd > apptStart && slotEnd <= apptEnd) ||
             (slotStart <= apptStart && slotEnd >= apptEnd);
    });
    
    slots.push({
      id: `${date}-${timeString}`,
      time: timeString,
      available: !hasConflict
    });
    
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }
  
  return slots;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      appointments: [],
      stylists: [
        { 
          id: 1, 
          name: "Alex Johnson", 
          specialty: "Coloring Expert", 
          image: "/stylists/alex.jpg",
          rating: 4.9,
          experience: "8 years",
          availableDays: [1, 2, 3, 5, 6],
          workingHours: { start: "09:00", end: "18:00" }
        },
        { 
          id: 2, 
          name: "Jamie Smith", 
          specialty: "Cutting Specialist", 
          image: "/stylists/jamie.jpg",
          rating: 4.8,
          experience: "6 years",
          availableDays: [2, 3, 4, 6],
          workingHours: { start: "10:00", end: "19:00" }
        },
        { 
          id: 3, 
          name: "Taylor Wilson", 
          specialty: "Styling Professional", 
          image: "/stylists/taylor.jpg",
          rating: 4.7,
          experience: "5 years",
          availableDays: [1, 3, 4, 5, 6],
          workingHours: { start: "09:00", end: "17:00" }
        },
      ],
      services: [
        { 
          id: 'haircut', 
          name: "Haircut", 
          price: 45, 
          duration: 45,
          description: "Professional haircut tailored to your style",
          image: "/service1.png"
        },
        { 
          id: 'color', 
          name: "Hair Coloring", 
          price: 95, 
          duration: 120,
          description: "Full color application with premium products",
          image: "/service2.png"
        },
        { 
          id: 'highlights', 
          name: "Highlights", 
          price: 110, 
          duration: 150,
          description: "Natural-looking highlights for dimension",
          image: "/service3.png"
        },
        { 
          id: 'treatment', 
          name: "Hair Treatment", 
          price: 65, 
          duration: 60,
          description: "Deep conditioning and nourishing treatments",
          image: "/service4.png"
        },
        { 
          id: 'styling', 
          name: "Styling", 
          price: 50, 
          duration: 60,
          description: "Professional styling for events or daily wear",
          image: "/service5.png"
        },
      ],
      
      selectedServices: [],
      selectedStylist: null,
      selectedDate: null,
      selectedTimeSlot: null,
      
      addService: (service) => set((state) => ({
        selectedServices: [...state.selectedServices, service]
      })),
      
      removeService: (serviceId) => set((state) => ({
        selectedServices: state.selectedServices.filter(s => s.id !== serviceId)
      })),
      
      clearServices: () => set({ selectedServices: [] }),
      
      selectStylist: (stylist) => set({ selectedStylist: stylist }),
      
      selectDate: (date) => set({ selectedDate: date }),
      
      selectTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
      
      createAppointment: async (userId, notes) => {
        const state = get();
        const { selectedServices, selectedStylist, selectedDate, selectedTimeSlot } = state;
        
        if (!selectedStylist || !selectedDate || !selectedTimeSlot || selectedServices.length === 0) {
          throw new Error('Missing required booking information');
        }
        
        const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
        const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
        
        const startTime = selectedTimeSlot.time;
        const endTimeDate = new Date(`${selectedDate} ${startTime}`);
        endTimeDate.setMinutes(endTimeDate.getMinutes() + totalDuration);
        const endTime = endTimeDate.toTimeString().slice(0, 5);
        
        const appointmentData: Omit<Appointment, 'id'> = {
          userId,
          stylistId: selectedStylist.id,
          services: selectedServices,
          date: selectedDate,
          startTime,
          endTime,
          totalDuration,
          totalPrice,
          status: 'confirmed' as const,  // Using type assertion to fix the type issue
          createdAt: new Date().toISOString(),
          notes
        };
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
        
        const appointment: Appointment = {
          id: docRef.id,
          ...appointmentData
        };
        
        // Update local state
        set((state) => ({
          appointments: [...state.appointments, appointment],
          selectedServices: [],
          selectedStylist: null,
          selectedDate: null,
          selectedTimeSlot: null
        }));
        
        return appointment;
      },
      
      cancelAppointment: async (appointmentId) => {
        try {
          await updateDoc(doc(db, 'appointments', appointmentId), {
            status: 'cancelled'
          });
          
          set((state) => ({
            appointments: state.appointments.map(apt => 
              apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
            )
          }));
          
          return true;
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          return false;
        }
      },
      
      getStylistAvailability: (stylistId, date) => {
        const state = get();
        const stylist = state.stylists.find(s => s.id === stylistId);
        if (!stylist || !date) return [];
        
        const totalDuration = state.selectedServices.reduce((sum, service) => sum + service.duration, 0) || 60;
        return generateTimeSlots(date, stylist, state.appointments, totalDuration);
      },
      
      generateICalendarEvent: (appointment) => {
        const stylist = get().stylists.find(s => s.id === appointment.stylistId);
        const services = appointment.services.map(s => s.name).join(', ');
        
        const start = new Date(`${appointment.date} ${appointment.startTime}`);
        const end = new Date(`${appointment.date} ${appointment.endTime}`);
        
        const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:Salon Appointment with ${stylist?.name || 'Stylist'}
DESCRIPTION:Services: ${services}
LOCATION:Choppers Salon
END:VEVENT
END:VCALENDAR`;
      },
      
      fetchAppointments: async (userId?: string) => {
        try {
          let appointmentsQuery;
          
          if (userId) {
            appointmentsQuery = query(
              collection(db, 'appointments'),
              where('userId', '==', userId)
            );
          } else {
            appointmentsQuery = collection(db, 'appointments');
          }
          
          const querySnapshot = await getDocs(appointmentsQuery);
          const appointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Appointment[];
          
          set({ appointments });
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
    }),
    {
      name: 'booking-storage',
    }
  )
);