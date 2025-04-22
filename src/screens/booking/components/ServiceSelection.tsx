import { Check, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useBookingStore } from '../../../store/bookinStore';

interface ServiceSelectionProps {
  onNext: () => void;
}

export const ServiceSelection = ({ onNext }: ServiceSelectionProps) => {
  const { services, selectedServices, addService, removeService } = useBookingStore();
  
  const handleServiceToggle = (service: typeof services[0]) => {
    if (selectedServices.find(s => s.id === service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };
  
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Select Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id}
            onClick={() => handleServiceToggle(service)}
            className={`group cursor-pointer transition-all ${
              selectedServices.find(s => s.id === service.id)
                ? "ring-2 ring-[#fbb034] bg-gray-700" 
                : "hover:bg-gray-700/50"
            }`}
          >
            <div className="aspect-video bg-gray-700 overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                </div>
                {selectedServices.find(s => s.id === service.id) && (
                  <Check className="text-[#fbb034]" size={24} />
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[#fbb034] font-bold">${service.price}</span>
                <span className="text-sm text-gray-400">{service.duration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedServices.length > 0 && (
        <div className="mt-8 p-4 bg-gray-900 border border-gray-700">
          <h3 className="font-bold mb-4">Selected Services</h3>
          <div className="space-y-2">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{service.name}</span>
                  <span className="text-gray-400 ml-2">({service.duration} min)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#fbb034] mr-4">${service.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(service.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-700 pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total Duration:</span>
                <span>{totalDuration} minutes</span>
              </div>
              <div className="flex justify-between font-bold text-[#fbb034]">
                <span>Total Price:</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};