// src/scripts/initializeFirebaseData.ts
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Products data
const initialProducts = [
  {
    name: "Hydrating Shampoo",
    brand: "Kerastase",
    price: 28.99,
    image: "./hydrating.png",
    category: "shampoo",
    bestseller: true,
    isNew: false,
    inStock: true,
    description: "Professional hydrating shampoo for all hair types"
  },
  {
    name: "Repair Conditioner",
    brand: "Oribe",
    price: 32.99,
    image: "./repair.png",
    category: "conditioner",
    bestseller: false,
    isNew: true,
    inStock: true,
    description: "Deep repair conditioner for damaged hair"
  },
  {
    name: "Styling Pomade",
    brand: "Aveda",
    price: 24.99,
    salePrice: 19.99,
    image: "/pomade.png",
    category: "styling",
    bestseller: false,
    isNew: false,
    inStock: true,
    description: "Medium hold pomade for all hair types"
  },
  {
    name: "Hair Oil Treatment",
    brand: "Moroccanoil",
    price: 46.99,
    image: "./hairoil.png",
    category: "treatment",
    bestseller: true,
    isNew: false,
    inStock: true,
    description: "Luxurious hair oil treatment for shine and repair"
  },
  {
    name: "Volume Spray",
    brand: "Kevin Murphy",
    price: 29.99,
    image: "/spray.png",
    category: "styling",
    bestseller: false,
    isNew: true,
    inStock: true,
    description: "Lightweight volume spray for fine hair"
  },
  {
    name: "Curl Defining Cream",
    brand: "DevaCurl",
    price: 26.99,
    image: "./curl.png",
    category: "styling",
    bestseller: false,
    isNew: false,
    inStock: false,
    description: "Defining cream for curly and wavy hair"
  },
  {
    name: "Color Protection Shampoo",
    brand: "Pureology",
    price: 34.99,
    salePrice: 29.99,
    image: "./colorprotection.png",
    category: "shampoo",
    bestseller: false,
    isNew: false,
    inStock: true,
    description: "Color-safe shampoo for dyed hair"
  },
  {
    name: "Deep Repair Mask",
    brand: "Redken",
    price: 38.99,
    image: "./deep.png",
    category: "treatment",
    bestseller: true,
    isNew: false,
    inStock: true,
    description: "Intensive repair mask for dry and damaged hair"
  }
];

// Services data
const initialServices = [
  { 
    id: 'haircut', 
    name: "Haircut", 
    price: 45, 
    duration: 45,
    description: "Professional haircut tailored to your style",
    image: "/service1.png"
  },
  { 
    id: 'color', 
    name: "Hair Coloring", 
    price: 95, 
    duration: 120,
    description: "Full color application with premium products",
    image: "/service2.png"
  },
  { 
    id: 'highlights', 
    name: "Highlights", 
    price: 110, 
    duration: 150,
    description: "Natural-looking highlights for dimension",
    image: "/service3.png"
  },
  { 
    id: 'treatment', 
    name: "Hair Treatment", 
    price: 65, 
    duration: 60,
    description: "Deep conditioning and nourishing treatments",
    image: "/service4.png"
  },
  { 
    id: 'styling', 
    name: "Styling", 
    price: 50, 
    duration: 60,
    description: "Professional styling for events or daily wear",
    image: "/service5.png"
  }
];

// Stylists data
// src/scripts/initializeFirebaseData.ts
const initialStylists = [
  { 
    id: 1, 
    name: "Alex Johnson", 
    specialty: "Coloring Expert", 
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.9,
    experience: "8 years",
    availableDays: [1, 2, 3, 5, 6],
    workingHours: { start: "09:00", end: "18:00" }
  },
  { 
    id: 2, 
    name: "Jamie Smith", 
    specialty: "Cutting Specialist", 
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.8,
    experience: "6 years",
    availableDays: [2, 3, 4, 6],
    workingHours: { start: "10:00", end: "19:00" }
  },
  { 
    id: 3, 
    name: "Taylor Wilson", 
    specialty: "Styling Professional", 
    image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=500",
    rating: 4.7,
    experience: "5 years",
    availableDays: [1, 3, 4, 5, 6],
    workingHours: { start: "09:00", end: "17:00" }
  }
];

// Initial settings
const initialSettings = {
  businessName: 'Choppers Salon',
  email: 'info@choppers.com',
  phone: '(123) 456-7890',
  address: '123 Salon Street, Beauty District, City, 10001',
  openingHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '16:00', closed: true },
  },
  bookingSettings: {
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    cancellationPolicyHours: 24,
  },
};

export async function initializeFirebaseData() {
  try {
    // Check if data already exists
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Initializing products...');
      for (const product of initialProducts) {
        await addDoc(collection(db, 'products'), product);
      }
      console.log('Products initialized successfully');
    } else {
      console.log('Products already exist');
    }

    // Initialize services
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    if (servicesSnapshot.empty) {
      console.log('Initializing services...');
      for (const service of initialServices) {
        await setDoc(doc(db, 'services', service.id), service);
      }
      console.log('Services initialized successfully');
    } else {
      console.log('Services already exist');
    }

    // Initialize stylists
    const stylistsSnapshot = await getDocs(collection(db, 'stylists'));
    if (stylistsSnapshot.empty) {
      console.log('Initializing stylists...');
      for (const stylist of initialStylists) {
        await setDoc(doc(db, 'stylists', stylist.id.toString()), stylist);
      }
      console.log('Stylists initialized successfully');
    } else {
      console.log('Stylists already exist');
    }

    // Initialize settings
    const settingsDoc = await getDocs(collection(db, 'settings'));
    if (settingsDoc.empty) {
      console.log('Initializing settings...');
      await setDoc(doc(db, 'settings', 'salon'), initialSettings);
      console.log('Settings initialized successfully');
    } else {
      console.log('Settings already exist');
    }

    console.log('All data initialization completed');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
}