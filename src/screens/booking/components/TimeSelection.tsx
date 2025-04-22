import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';
import { useAuthStore } from '../../../store/authStore';
import { BookingSummary } from './BookingSummary';

interface TimeSelectionProps {
  onSubmit: () => void;
  onBack: () => void;
}

export const TimeSelection = ({ onSubmit, onBack }: TimeSelectionProps) => {
  const user = useAuthStore((state) => state.user);
  const {
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    selectTimeSlot,
    createAppointment,
    getStylistAvailability
  } = useBookingStore();
  
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const availableTimeSlots = selectedStylist && selectedDate 
    ? getStylistAvailability(selectedStylist.id, selectedDate)
    : [];
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await createAppointment(user.id, notes);
      onSubmit();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Select a Time</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableTimeSlots.map((slot) => (
          <div 
            key={slot.id}
            onClick={() => slot.available && selectTimeSlot(slot)}
            className={`
              p-4 border text-center transition-all
              ${!slot.available && "opacity-50 cursor-not-allowed bg-gray-900"}
              ${slot.available && selectedTimeSlot?.id === slot.id 
                ? "border-[#fbb034] bg-[#fbb034]/10" 
                : slot.available ? "border-gray-700 hover:border-gray-500 cursor-pointer" : "border-gray-800"}
            `}
          >
            <p className="font-medium">{slot.time}</p>
            {!slot.available && <p className="text-xs text-red-400 mt-1">Unavailable</p>}
          </div>
        ))}
      </div>
      
      {selectedTimeSlot && (
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or information for your stylist..."
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
              rows={3}
            />
          </div>
          
          <BookingSummary />
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-none"
        >
          Previous
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedTimeSlot || loading}
          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black disabled:opacity-50 min-w-[120px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin">⌛</span>
              Booking...
            </div>
          ) : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
};