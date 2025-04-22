import { useBookingStore } from '../../../store/bookinStore';

export const BookingSummary = () => {
  const {
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTimeSlot
  } = useBookingStore();
  
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  
  return (
    <div className="p-6 border border-gray-700 bg-gray-900">
      <h3 className="font-bold text-xl mb-4">Booking Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400">Services:</p>
          <p className="font-medium">
            {selectedServices.map(s => s.name).join(', ')}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Total Price:</p>
          <p className="font-medium text-[#fbb034]">${totalPrice}</p>
        </div>
        <div>
          <p className="text-gray-400">Stylist:</p>
          <p className="font-medium">{selectedStylist?.name}</p>
        </div>
        <div>
          <p className="text-gray-400">Duration:</p>
          <p className="font-medium">{totalDuration} minutes</p>
        </div>
        <div>
          <p className="text-gray-400">Date:</p>
          <p className="font-medium">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }) : ''}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Time:</p>
          <p className="font-medium">{selectedTimeSlot?.time}</p>
        </div>
      </div>
    </div>
  );
};