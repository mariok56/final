import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';

interface DateSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export const DateSelection = ({ onNext, onBack }: DateSelectionProps) => {
  const { selectedStylist, selectedDate, selectDate } = useBookingStore();
  
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      dates.push({ 
        value: dateString, 
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'long' })
      });
    }
    
    return dates;
  };
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Select a Date</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {generateDateOptions().map((date) => {
          const dayOfWeek = new Date(date.value).getDay();
          const isAvailable = selectedStylist?.availableDays.includes(dayOfWeek);
          
          return (
            <div 
              key={date.value}
              onClick={() => isAvailable ? selectDate(date.value) : null}
              className={`
                p-3 border text-center transition-all cursor-pointer ${
                  selectedDate === date.value 
                    ? "border-[#fbb034] bg-[#fbb034]/10" 
                    : isAvailable 
                      ? "border-gray-700 hover:border-gray-500" 
                      : "border-gray-800 opacity-50 cursor-not-allowed"
                }
              `}
            >
              <p className="font-medium">{date.display}</p>
              {!isAvailable && (
                <p className="text-xs text-red-400 mt-1">Unavailable</p>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Showing availability for {selectedStylist?.name} on{' '}
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }) : ''}
          </p>
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
          onClick={onNext}
          disabled={!selectedDate}
          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};