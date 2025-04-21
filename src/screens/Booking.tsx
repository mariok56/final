import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Check } from 'lucide-react';

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type Stylist = {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  availability: string[];
};

type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  image: string;
};

export const Booking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedStylist, setSelectedStylist] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Enhanced services data with more details
  const services: Service[] = [
    { 
      id: 'haircut', 
      name: "Haircut", 
      price: "$35-55", 
      duration: "30-45 min",
      description: "Professional haircut tailored to your style",
      image: "/service1.png"
    },
    { 
      id: 'color', 
      name: "Hair Coloring", 
      price: "$85+", 
      duration: "120-180 min",
      description: "Full color application with premium products",
      image: "/service2.png"
    },
    { 
      id: 'highlights', 
      name: "Highlights", 
      price: "$95+", 
      duration: "90-150 min",
      description: "Natural-looking highlights for dimension",
      image: "/service3.png"
    },
    { 
      id: 'treatment', 
      name: "Hair Treatment", 
      price: "$35-150", 
      duration: "30-60 min",
      description: "Deep conditioning and nourishing treatments",
      image: "/service4.png"
    },
    { 
      id: 'styling', 
      name: "Styling", 
      price: "$45-75", 
      duration: "45-60 min",
      description: "Professional styling for events or daily wear",
      image: "/service5.png"
    },
  ];
  
  // Enhanced stylists data with more information
  const stylists: Stylist[] = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      specialty: "Coloring Expert", 
      image: "/stylists/alex.jpg",
      rating: 4.9,
      experience: "8 years",
      availability: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"]
    },
    { 
      id: 2, 
      name: "Jamie Smith", 
      specialty: "Cutting Specialist", 
      image: "/stylists/jamie.jpg",
      rating: 4.8,
      experience: "6 years",
      availability: ["Tuesday", "Wednesday", "Thursday", "Saturday"]
    },
    { 
      id: 3, 
      name: "Taylor Wilson", 
      specialty: "Styling Professional", 
      image: "/stylists/taylor.jpg",
      rating: 4.7,
      experience: "5 years",
      availability: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    { 
      id: 4, 
      name: "Jordan Lee", 
      specialty: "Treatment Specialist", 
      image: "/stylists/jordan.jpg",
      rating: 4.9,
      experience: "10 years",
      availability: ["Monday", "Tuesday", "Thursday", "Friday"]
    },
  ];
  
  // Generate dynamic time slots based on stylist availability
  const getTimeSlots = (): TimeSlot[] => {
    const timeList = [
      { id: '9am', time: '9:00 AM', available: true },
      { id: '10am', time: '10:00 AM', available: true },
      { id: '11am', time: '11:00 AM', available: true },
      { id: '12pm', time: '12:00 PM', available: true },
      { id: '1pm', time: '1:00 PM', available: true },
      { id: '2pm', time: '2:00 PM', available: true },
      { id: '3pm', time: '3:00 PM', available: true },
      { id: '4pm', time: '4:00 PM', available: true },
      { id: '5pm', time: '5:00 PM', available: true },
    ];
    
    return timeList;
  };
  
  const handleSubmitBooking = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bookingDetails = {
      service: services.find(s => s.id === selectedService),
      stylist: stylists.find(s => s.id === selectedStylist),
      date: new Date(selectedDate).toLocaleDateString(),
      time: getTimeSlots().find(t => t.id === selectedTimeSlot)?.time,
      bookingNumber: Math.floor(100000 + Math.random() * 900000),
    };
    
    setBookingInfo(bookingDetails);
    setLoading(false);
    setShowConfirmation(true);
  };
  
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmitBooking();
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
      setSelectedStylist(null);
      setSelectedDate('');
      setSelectedTimeSlot(null);
    } else if (step === 2) {
      setSelectedDate('');
      setSelectedTimeSlot(null);
    } else if (step === 3) {
      setSelectedTimeSlot(null);
    }
  }, [step]);
  
  // Render confirmation modal
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-800 p-8 transition-all duration-300 animate-fadeIn">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-gray-400 mb-8">
              Your appointment has been successfully booked. We look forward to seeing you!
            </p>
            
            <div className="bg-gray-900 p-6 mb-8 text-left">
              <h3 className="font-bold text-lg mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Booking Number:</span>
                  <p className="font-medium">#{bookingInfo?.bookingNumber}</p>
                </div>
                <div>
                  <span className="text-gray-400">Service:</span>
                  <p className="font-medium">{bookingInfo?.service?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Stylist:</span>
                  <p className="font-medium">{bookingInfo?.stylist?.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Date & Time:</span>
                  <p className="font-medium">{bookingInfo?.date} at {bookingInfo?.time}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => navigate('/')}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Return Home
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  setStep(1);
                  setSelectedService('');
                  setSelectedStylist(null);
                  setSelectedDate('');
                  setSelectedTimeSlot(null);
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
            <h1 className="text-3xl md:text-4xl font-bold">Book Your Appointment</h1>
            <p className="text-gray-300 mt-2">Choose your service and preferred stylist</p>
          </div>
        </div>
      </div>
      
      {/* Booking Form */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
          {[
            { num: 1, label: "Service", icon: <User size={16} /> },
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
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`group cursor-pointer transition-all ${
                      selectedService === service.id 
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
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#fbb034] font-bold">{service.price}</span>
                        <span className="text-sm text-gray-400">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 2: Select Stylist */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">Choose Your Stylist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stylists.map((stylist) => (
                  <div 
                    key={stylist.id}
                    onClick={() => setSelectedStylist(stylist.id)}
                    className={`flex flex-col md:flex-row items-center gap-4 p-4 cursor-pointer transition-all ${
                      selectedStylist === stylist.id 
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
                          Available: {stylist.availability.join(', ')}
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
                {generateDateOptions().map((date) => (
                  <div 
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`
                      p-3 border text-center transition-all cursor-pointer ${
                        selectedDate === date.value 
                          ? "border-[#fbb034] bg-[#fbb034]/10" 
                          : "border-gray-700 hover:border-gray-500"
                      }
                    `}
                  >
                    <p className="font-medium">{date.display}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 4: Select Time */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">Select a Time</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {getTimeSlots().map((slot) => (
                  <div 
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                    className={`
                      p-4 border text-center transition-all
                      ${!slot.available && "opacity-50 cursor-not-allowed bg-gray-900"}
                      ${slot.available && selectedTimeSlot === slot.id 
                        ? "border-[#fbb034] bg-[#fbb034]/10" 
                        : slot.available ? "border-gray-700 hover:border-gray-500 cursor-pointer" : "border-gray-800"}
                    `}
                  >
                    <p className="font-medium">{slot.time}</p>
                    {!slot.available && <p className="text-xs text-red-400 mt-1">Unavailable</p>}
                  </div>
                ))}
              </div>
              
              {/* Booking Summary */}
              {selectedTimeSlot && (
                <div className="mt-8 p-6 border border-gray-700 bg-gray-900 animate-fadeIn">
                  <h3 className="font-bold text-xl mb-4">Booking Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Service:</p>
                      <p className="font-medium">{services.find(s => s.id === selectedService)?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price:</p>
                      <p className="font-medium">{services.find(s => s.id === selectedService)?.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stylist:</p>
                      <p className="font-medium">{stylists.find(s => s.id === selectedStylist)?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration:</p>
                      <p className="font-medium">{services.find(s => s.id === selectedService)?.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date:</p>
                      <p className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Time:</p>
                      <p className="font-medium">{getTimeSlots().find(t => t.id === selectedTimeSlot)?.time}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              onClick={handlePrevStep}
              variant="outline" 
              className={`bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-none ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={
                (step === 1 && !selectedService) ||
                (step === 2 && selectedStylist === null) ||
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
    </div>
  );
};