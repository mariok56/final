import { useState, useEffect } from 'react';
import { useBookingStore } from '../../store/bookinStore';
import { useAuthStore } from '../../store/authStore';
import { BookingProgress } from './components/BookingProgress';
import { ServiceSelection } from './components/ServiceSelection';
import { StylistSelection } from './components/StylistSelection';
import { DateSelection } from './components/DateSelection';
import { TimeSelection } from './components/TimeSelection';
import { BookingConfirmation } from './components/BookingConfirmation';
import { AppointmentManager } from './components/AppointmentManager';

export const EnhancedBooking = () => {
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('new');
  
  const {
    selectStylist,
    selectDate,
    selectTimeSlot,
    clearServices
  } = useBookingStore();
  
  // Reset selections when going back to previous steps
  useEffect(() => {
    if (step === 1) {
      selectStylist(null);
      selectDate(null);
      selectTimeSlot(null);
    } else if (step === 2) {
      selectDate('');
      selectTimeSlot(null);
    } else if (step === 3) {
      selectTimeSlot(null);
    }
  }, [step, selectStylist, selectDate, selectTimeSlot]);
  
  if (showConfirmation) {
    return (
      <BookingConfirmation
        onClose={() => {
          setShowConfirmation(false);
          setStep(1);
          clearServices();
          selectStylist(null);
          selectDate(null);
          selectTimeSlot(null);
        }}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-[url(/booking-hero.jpg)] bg-cover bg-center h-48">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Appointment Booking</h1>
            <p className="text-gray-300 mt-2">Schedule your visit or manage existing appointments</p>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-6 py-3 font-bold ${activeTab === 'new' ? 'text-[#fbb034] border-b-2 border-[#fbb034]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('new')}
          >
            New Appointment
          </button>
          <button
            className={`px-6 py-3 font-bold ${activeTab === 'manage' ? 'text-[#fbb034] border-b-2 border-[#fbb034]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('manage')}
          >
            Manage Appointments
          </button>
        </div>
      </div>
      
      {activeTab === 'new' ? (
        <div className="max-w-6xl mx-auto py-4 px-4">
          <BookingProgress currentStep={step} />
          
          <div className="bg-gray-800 p-6 md:p-8 transition-all duration-300 mt-12">
            {step === 1 && <ServiceSelection onNext={() => setStep(2)} />}
            {step === 2 && <StylistSelection onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <DateSelection onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && (
              <TimeSelection 
                onSubmit={() => setShowConfirmation(true)}
                onBack={() => setStep(3)}
              />
            )}
          </div>
        </div>
      ) : (
        <AppointmentManager userId={user?.id} />
      )}
    </div>
  );
};