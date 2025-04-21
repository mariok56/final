import { useState } from 'react';
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type Service = {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
};

export const Services = () => {
  const [activeCategory, setActiveCategory] = useState('haircuts');
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const categories = [
    { id: 'haircuts', name: 'Haircuts' },
    { id: 'coloring', name: 'Coloring' },
    { id: 'styling', name: 'Styling' },
    { id: 'treatments', name: 'Treatments' }
  ];
  
  const services: Record<string, Service[]> = {
    haircuts: [
      {
        id: 1,
        name: "Men's Classic Cut",
        description: "Professional haircut with expert styling and beard trim.",
        price: "$35",
        duration: "30 min",
        image: "./Men's Classic Cut.png"
      },
      {
        id: 2,
        name: "Women's Haircut",
        description: "Professional cut and style tailored to your face shape and preferences.",
        price: "$55+",
        duration: "45 min",
        image: "womenHair.png"
      },
      {
        id: 3,
        name: "Children's Cut",
        description: "Gentle haircut for kids in a friendly environment.",
        price: "$25",
        duration: "20 min",
        image: "childrencut.png"
      }
    ],
    coloring: [
      {
        id: 4,
        name: "Full Color",
        description: "Complete hair color transformation with premium products.",
        price: "$85+",
        duration: "120 min",
        image: "./fullColor.png"
      },
      {
        id: 5,
        name: "Highlights",
        description: "Partial or full highlights to enhance your natural look.",
        price: "$95+",
        duration: "90 min",
        image: "./highlights.png"
      }
    ],
    styling: [
      {
        id: 6,
        name: "Blowout",
        description: "Professional wash and blow dry styling.",
        price: "$45",
        duration: "45 min",
        image: "./dry.png"
      },
      {
        id: 7,
        name: "Special Occasion Style",
        description: "Formal updo or styling for weddings and special events.",
        price: "$75+",
        duration: "60 min",
        image: "./wedding.png"
      }
    ],
    treatments: [
      {
        id: 8,
        name: "Deep Conditioning",
        description: "Intensive moisture treatment for damaged hair.",
        price: "$35",
        duration: "30 min",
        image: "./conditionel.png"
      },
      {
        id: 9,
        name: "Keratin Treatment",
        description: "Smoothing treatment to eliminate frizz and add shine.",
        price: "$150+",
        duration: "120 min",
        image: "./keratin.png"
      }
    ]
  };

  // Handle Book Now button click
  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-[url(/services-hero.jpg)] bg-cover bg-center h-64 md:h-80">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Premium hair services tailored to your unique style and needs
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-2 md:gap-8 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-none text-sm md:text-base font-bold transition-colors ${
                activeCategory === category.id
                  ? "bg-[#fbb034] text-black"
                  : "bg-transparent border border-[#fbb034] text-[#fbb034] hover:bg-[#fbb034]/10"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services[activeCategory].map((service) => (
            <div 
              key={service.id} 
              className="border border-gray-800 bg-gray-800/50 hover:bg-gray-800 transition-colors p-6 group"
            >
              <div className="aspect-video bg-gray-700 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#fbb034]">{service.name}</h3>
              <p className="text-gray-400 mt-2 h-16">{service.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className="block text-lg font-bold">{service.price}</span>
                  <span className="text-sm text-gray-400">{service.duration}</span>
                </div>
                <Button 
                  onClick={handleBookNowClick}
                  className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};