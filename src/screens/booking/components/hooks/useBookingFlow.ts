import { useState, useEffect } from 'react';
import { useBookingStore } from '../../../../store/bookinStore';

export const useBookingFlow = () => {
  const [step, setStep] = useState(1);
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
  
  const goToNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const resetFlow = () => {
    setStep(1);
    clearServices();
    selectStylist(null);
    selectDate(null);
    selectTimeSlot(null);
  };
  
  return {
    step,
    setStep,
    goToNextStep,
    goToPreviousStep,
    resetFlow
  };
};