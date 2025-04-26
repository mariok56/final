// src/screens/Admin/Appointments.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Button } from '../../components/ui/button';
import { Calendar, Clock, User, XCircle, CheckCircle } from 'lucide-react';

interface AppointmentData {
  id: string;
  userId: string;
  stylistId: number;
  services: { name: string; price: number; duration: number }[];
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  createdAt: string;
  notes?: string;
}

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          orderBy('date', 'desc')
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AppointmentData[];
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: newStatus
      });
      
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId ? { ...appointment, status: newStatus as any } : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return appointment.status === 'confirmed' && new Date(appointment.date) > new Date();
    if (filter === 'completed') return appointment.status === 'completed';
    if (filter === 'cancelled') return appointment.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Appointment Management</h2>
        <div className="flex gap-2">
          {['all', 'upcoming', 'completed', 'cancelled'].map((filterOption) => (
            <Button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`${
                filter === filterOption 
                  ? 'bg-[#fbb034] text-black' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } capitalize`}
            >
              {filterOption}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading appointments...</div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-gray-800 p-6 border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {appointment.services.map(s => s.name).join(', ')}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Stylist ID: {appointment.stylistId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#fbb034] mb-2">
                    ${appointment.totalPrice}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'confirmed' ? 'bg-blue-500' :
                    appointment.status === 'completed' ? 'bg-green-500' :
                    appointment.status === 'cancelled' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-900 text-sm">
                  <strong>Notes:</strong> {appointment.notes}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {appointment.status === 'confirmed' && (
                  <>
                    <Button
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark Completed
                    </Button>
                    <Button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};