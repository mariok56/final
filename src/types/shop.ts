// src/types/shop.ts

// Product type definition
export type Product = {
    id: number;
    name: string;
    brand: string;
    price: number;
    salePrice?: number;
    image: string;
    category: string;
    bestseller: boolean;
    isNew: boolean;
    inStock: boolean;
  };
  
  // Cart item type definition
  export type CartItem = {
    product: Product;
    quantity: number;
  };
  
  // Checkout form data type
  export type CheckoutFormData = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    cardNumber: string;
    cardExpiry: string;
    cardCVC: string;
  };
  
  // Order type definition
  export type Order = {
    id: string;
    date: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    customer: CheckoutFormData;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
  };
  
  // Filter options
  export type CategoryId = 'all' | 'shampoo' | 'conditioner' | 'styling' | 'treatment';
  export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';
  
  // Category and Sort options
  export const categories = [
    { id: 'all' as CategoryId, name: 'All Products' },
    { id: 'shampoo' as CategoryId, name: 'Shampoo' },
    { id: 'conditioner' as CategoryId, name: 'Conditioner' },
    { id: 'styling' as CategoryId, name: 'Styling' },
    { id: 'treatment' as CategoryId, name: 'Treatments' }
  ];
  
  export const sortOptions = [
    { id: 'featured' as SortOption, name: 'Featured' },
    { id: 'newest' as SortOption, name: 'Newest' },
    { id: 'price-low' as SortOption, name: 'Price: Low to High' },
    { id: 'price-high' as SortOption, name: 'Price: High to Low' }
  ];
  
  // Sample products data
  export const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Hydrating Shampoo",
      brand: "Kerastase",
      price: 28.99,
      image: "/products/shampoo-1.jpg",
      category: "shampoo",
      bestseller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 2,
      name: "Repair Conditioner",
      brand: "Oribe",
      price: 32.99,
      image: "/products/conditioner-1.jpg",
      category: "conditioner",
      bestseller: false,
      isNew: true,
      inStock: true
    },
    {
      id: 3,
      name: "Styling Pomade",
      brand: "Aveda",
      price: 24.99,
      salePrice: 19.99,
      image: "/products/styling-1.jpg",
      category: "styling",
      bestseller: false,
      isNew: false,
      inStock: true
    },
    {
      id: 4,
      name: "Hair Oil Treatment",
      brand: "Moroccanoil",
      price: 46.99,
      image: "/products/treatment-1.jpg",
      category: "treatment",
      bestseller: true,
      isNew: false,
      inStock: true
    },
    {
      id: 5,
      name: "Volume Spray",
      brand: "Kevin Murphy",
      price: 29.99,
      image: "/products/styling-2.jpg",
      category: "styling",
      bestseller: false,
      isNew: true,
      inStock: true
    },
    {
      id: 6,
      name: "Curl Defining Cream",
      brand: "DevaCurl",
      price: 26.99,
      image: "/products/styling-3.jpg",
      category: "styling",
      bestseller: false,
      isNew: false,
      inStock: false
    },
    {
      id: 7,
      name: "Color Protection Shampoo",
      brand: "Pureology",
      price: 34.99,
      salePrice: 29.99,
      image: "/products/shampoo-2.jpg",
      category: "shampoo",
      bestseller: false,
      isNew: false,
      inStock: true
    },
    {
      id: 8,
      name: "Deep Repair Mask",
      brand: "Redken",
      price: 38.99,
      image: "/products/treatment-2.jpg",
      category: "treatment",
      bestseller: true,
      isNew: false,
      inStock: true
    }
  ];