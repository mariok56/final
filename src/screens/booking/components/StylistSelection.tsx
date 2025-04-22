import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';

interface StylistSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export const StylistSelection = ({ onNext, onBack }: StylistSelectionProps) => {
  const { stylists, selectedStylist, selectStylist } = useBookingStore();
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Choose Your Stylist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stylists.map((stylist) => (
          <div 
            key={stylist.id}
            onClick={() => selectStylist(stylist)}
            className={`flex flex-col md:flex-row items-center gap-4 p-4 cursor-pointer transition-all ${
              selectedStylist?.id === stylist.id 
                ? "bg-gray-700 ring-2 ring-[#fbb034]" 
                : "bg-gray-800 hover:bg-gray-700/50"
            }`}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 shrink-0">
              <img 
                src="/api/placeholder/100/100" 
                alt={stylist.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="font-bold text-lg">{stylist.name}</h3>
              <p className="text-[#fbb034] text-sm mb-2">{stylist.specialty}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <span>★ {stylist.rating}</span>
                <span>{stylist.experience}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">
                  Available: {stylist.availableDays.map(day => 
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                  ).join(', ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
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
          disabled={!selectedStylist}
          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
