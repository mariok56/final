import { Calendar, Download, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';

interface AppointmentManagerProps {
  userId?: string;
}

export const AppointmentManager = ({ userId }: AppointmentManagerProps) => {
  const {
    appointments,
    stylists,
    cancelAppointment,
    generateICalendarEvent
  } = useBookingStore();
  
  const userAppointments = appointments.filter(apt => 
    apt.userId === userId && 
    apt.status !== 'cancelled' && 
    new Date(apt.date) >= new Date()
  );
  
  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointmentId);
    }
  };
  
  const downloadCalendarEvent = (appointment: typeof appointments[0]) => {
    const icsContent = generateICalendarEvent(appointment);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointment-${appointment.id}.ics`;
    link.click();
  };
  
  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Upcoming Appointments</h2>
      {userAppointments.length > 0 ? (
        <div className="space-y-6">
          {userAppointments.map((appointment) => {
            const stylist = stylists.find(s => s.id === appointment.stylistId);
            
            return (
              <div key={appointment.id} className="bg-gray-800 p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {appointment.services.map(s => s.name).join(', ')}
                    </h3>
                    <p className="text-gray-400">with {stylist?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#fbb034]">${appointment.totalPrice}</p>
                    <p className="text-sm text-gray-400">{appointment.totalDuration} minutes</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time</p>
                    <p className="font-medium">
                      {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Booking ID</p>
                    <p className="font-medium">{appointment.id}</p>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="mb-4">
                    <p className="text-gray-400">Notes</p>
                    <p className="font-medium">{appointment.notes}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => downloadCalendarEvent(appointment)}
                    className="flex items-center bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Download size={16} className="mr-2" />
                    Add to Calendar
                  </Button>
                  <Button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Cancel Appointment
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800 p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-bold mb-2">No Upcoming Appointments</h3>
          <p className="text-gray-400 mb-6">
            You don't have any scheduled appointments yet.
          </p>
        </div>
      )}
    </div>
  );
};