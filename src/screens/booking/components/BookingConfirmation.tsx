import { Check, Download } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';
import { useAuthStore } from '../../../store/authStore';

interface BookingConfirmationProps {
  onClose: () => void;
}

export const BookingConfirmation = ({ onClose }: BookingConfirmationProps) => {
  const { appointments, stylists, generateICalendarEvent } = useBookingStore();
  const user = useAuthStore((state) => state.user);
  
  const latestAppointment = appointments[appointments.length - 1];
  
  const downloadCalendarEvent = (appointment: typeof appointments[0]) => {
    const icsContent = generateICalendarEvent(appointment);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appointment-${appointment.id}.ics`;
    link.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 p-8 transition-all duration-300 animate-fadeIn">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-8">
            We've sent a confirmation email to {user?.email}. We look forward to seeing you!
          </p>
          
          <div className="bg-gray-900 p-6 mb-8 text-left">
            <h3 className="font-bold text-lg mb-4">Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">Services:</span>
                <p className="font-medium">
                  {latestAppointment?.services.map(s => s.name).join(', ') || '-'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Stylist:</span>
                <p className="font-medium">
                  {stylists.find(s => s.id === latestAppointment?.stylistId)?.name || '-'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Date & Time:</span>
                <p className="font-medium">
                  {latestAppointment ? new Date(latestAppointment.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  }) : ''} at {latestAppointment?.startTime || '-'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Total:</span>
                <p className="font-medium">${latestAppointment?.totalPrice || '0'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => {
                if (latestAppointment) {
                  downloadCalendarEvent(latestAppointment);
                }
              }}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Download size={18} className="mr-2" />
              Add to Calendar
            </Button>
            <Button
              onClick={onClose}
              className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
            >
              Book Another Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};