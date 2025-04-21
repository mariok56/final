import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Check, PlusCircle, XCircle, Download, Trash2 } from 'lucide-react';
import { useBookingStore } from '../store/bookinStore';
import { useAuthStore } from '../store/authStore';

export const EnhancedBooking = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'manage'>('new');
  
  const {
    services,
    stylists,
    appointments,
    selectedServices,
    selectedStylist,
    selectedDate,
    selectedTimeSlot,
    addService,
    removeService,
    clearServices,
    selectStylist,
    selectDate,
    selectTimeSlot,
    createAppointment,
    cancelAppointment,
    rescheduleAppointment,
    getStylistAvailability,
    getAvailableStylists,
    generateICalendarEvent
  } = useBookingStore();
  
  const userAppointments = appointments.filter(apt => 
    apt.userId === user?.id && 
    apt.status !== 'cancelled' && 
    new Date(apt.date) >= new Date()
  );
  
  // Get available time slots based on selected stylist and services
  const availableTimeSlots = selectedStylist && selectedDate 
    ? getStylistAvailability(selectedStylist.id, selectedDate)
    : [];
  
  // Get available stylists for selected date and services
  const availableStylists = selectedDate 
    ? getAvailableStylists(selectedDate, selectedServices.map(s => s.id))
    : stylists;
  
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  
  const handleServiceToggle = (service: typeof services[0]) => {
    if (selectedServices.find(s => s.id === service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };
  
  const handleSubmitBooking = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const appointment = await createAppointment(user.id, notes);
      
      // After successfully creating the appointment, show confirmation
      setShowConfirmation(true);
      
      // Scroll to top to show confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
  
  // Confirmation modal
  if (showConfirmation) {
    const latestAppointment = appointments[appointments.length - 1];
    
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
                onClick={() => {
                  setShowConfirmation(false);
                  setStep(1);
                  clearServices();
                  selectStylist(null);
                  selectDate(null);
                  selectTimeSlot(null);
                  setNotes('');
                }}
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
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
            Manage Appointments ({userAppointments.length})
          </button>
        </div>
      </div>
      
      {activeTab === 'new' ? (
        <div className="max-w-6xl mx-auto py-4 px-4">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
            {[
              { num: 1, label: "Services", icon: <PlusCircle size={16} /> },
              { num: 2, label: "Stylist", icon: <User size={16} /> },
              { num: 3, label: "Date", icon: <Calendar size={16} /> },
              { num: 4, label: "Time", icon: <Clock size={16} /> }
            ].map((item) => (
              <div key={item.num} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    item.num <= step ? "bg-[#fbb034] text-black scale-110" : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {item.num < step ? <Check size={18} /> : item.icon}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-800 p-6 md:p-8 transition-all duration-300">
            {/* Step 1: Select Services */}
            {step === 1 && (
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
              </div>
            )}
            
            {/* Step 2: Select Stylist */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6">Choose Your Stylist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableStylists.map((stylist) => (
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
                        <img src="/api/placeholder/100/100" alt={stylist.name} className="w-full h-full object-cover" />
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
              </div>
            )}
            
            {/* Step 3: Select Date */}
            {step === 3 && (
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
                  })}:
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
              </div>
            )}
            
            {/* Step 4: Select Time */}
            {step === 4 && (
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
                          <p className="font-medium">{selectedTimeSlot.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                onClick={() => setStep(Math.max(1, step - 1))}
                variant="outline" 
                className={`bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-none ${
                  step === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  if (step < 4) {
                    setStep(step + 1);
                  } else {
                    handleSubmitBooking();
                  }
                }}
                disabled={
                  (step === 1 && selectedServices.length === 0) ||
                  (step === 2 && !selectedStylist) ||
                  (step === 3 && !selectedDate) ||
                  (step === 4 && !selectedTimeSlot) ||
                  loading
                }
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black disabled:opacity-50 min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin">⌛</span>
                    Booking...
                  </div>
                ) : step === 4 ? 'Confirm Booking' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
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
              <Button
                onClick={() => setActiveTab('new')}
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
              >
                Book an Appointment
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};