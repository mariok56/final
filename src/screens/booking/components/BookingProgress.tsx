import { Check, PlusCircle, User, Calendar, Clock } from 'lucide-react';

interface ProgressStep {
  num: number;
  label: string;
  icon: React.ReactNode;
}

interface BookingProgressProps {
  currentStep: number;
}

export const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  const steps: ProgressStep[] = [
    { num: 1, label: "Services", icon: <PlusCircle size={16} /> },
    { num: 2, label: "Stylist", icon: <User size={16} /> },
    { num: 3, label: "Date", icon: <Calendar size={16} /> },
    { num: 4, label: "Time", icon: <Clock size={16} /> }
  ];

  return (
    <div className="flex justify-between mb-12 relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
      {steps.map((item) => (
        <div key={item.num} className="flex flex-col items-center">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              item.num <= currentStep ? "bg-[#fbb034] text-black scale-110" : "bg-gray-700 text-gray-400"
            }`}
          >
            {item.num < currentStep ? <Check size={18} /> : item.icon}
          </div>
          <span className="mt-2 text-sm font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// src/screens/Booking/components/ServiceSelection.tsx
