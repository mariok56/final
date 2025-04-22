import { useState, useEffect,useCallback } from 'react';
import { create } from 'zustand';
import { Button } from "../components/ui/button";
import { Search, ShoppingCart, Filter, ChevronDown, X, Plus, Minus, Trash2, CreditCard, ArrowLeft } from "lucide-react";


// Product type definition
type Product = {
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
type CartItem = {
  product: Product;
  quantity: number;
};

// Checkout form data type
type CheckoutFormData = {
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

// Define our Zustand store
interface ShopState {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutStep: number;
  checkoutFormData: CheckoutFormData;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: number) => void;
  updateCheckoutForm: (field: keyof CheckoutFormData, value: string) => void;
}

// Create the store
const useShopStore = create<ShopState>((set) => ({
  cart: [],
  isCartOpen: false,
  isCheckoutOpen: false,
  checkoutStep: 1,
  checkoutFormData: {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  },
  
  addToCart: (product) => set((state) => {
    const existingItem = state.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      return {
        cart: state.cart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ),
        isCartOpen: true
      };
    } else {
      return {
        cart: [...state.cart, { product, quantity: 1 }],
        isCartOpen: true
      };
    }
  }),
  
  updateQuantity: (productId, newQuantity) => set((state) => {
    if (newQuantity < 1) {
      return {
        cart: state.cart.filter(item => item.product.id !== productId)
      };
    }
    
    return {
      cart: state.cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  toggleCart: () => set((state) => ({ 
    isCartOpen: !state.isCartOpen,
    isCheckoutOpen: false 
  })),
  
  closeCart: () => set({ isCartOpen: false }),
  
  openCheckout: () => set({ 
    isCartOpen: false,
    isCheckoutOpen: true,
    checkoutStep: 1
  }),
  
  closeCheckout: () => set({ 
    isCheckoutOpen: false,
    checkoutStep: 1
  }),
  
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  
  updateCheckoutForm: (field, value) => set((state) => ({
    checkoutFormData: {
      ...state.checkoutFormData,
      [field]: value
    }
  }))
}));

export const Shop = () => {
  // Use our zustand store
  const { 
    cart, 
    isCartOpen, 
    isCheckoutOpen,
    checkoutStep,
    checkoutFormData,
    addToCart, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    toggleCart,
    closeCart,
    openCheckout,
    closeCheckout,
    setCheckoutStep,
    updateCheckoutForm
  } = useShopStore();
  
  // Local state
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSorting, setActiveSorting] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  // Calculate cart count and total
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
  
  // Sample product data
  const products: Product[] = [
    {
      id: 1,
      name: "Hydrating Shampoo",
      brand: "Kerastase",
      price: 28.99,
      image: "./hydrating.png",
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
      image: "./repair.png",
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
      image: "/pomade.png",
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
      image: "./hairoil.png",
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
      image: "/spray.png",
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
      image: "./deep.png",
      category: "treatment",
      bestseller: true,
      isNew: false,
      inStock: true
    }
  ];
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'shampoo', name: 'Shampoo' },
    { id: 'conditioner', name: 'Conditioner' },
    { id: 'styling', name: 'Styling' },
    { id: 'treatment', name: 'Treatments' }
  ];
  
  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
  ];
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (activeSorting) {
      case 'newest':
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      default: // featured - bestsellers first
        return a.bestseller ? -1 : b.bestseller ? 1 : 0;
    }
  });
  
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      console.log(`Subscribing email: ${email}`);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };
  
  // Handle checkout form submission
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkoutStep < 3) {
      setCheckoutStep(checkoutStep + 1);
    } else {
      // Process the payment and order
      console.log('Order submitted:', {
        customer: checkoutFormData,
        items: cart,
        total: cartTotal
      });
      
      // Show order confirmation
      setOrderPlaced(true);
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        closeCheckout();
        setOrderPlaced(false);
      }, 5000);
    }
  };
  

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Update the debouncedSearch:
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 500),
    []
  );

// Handle search input change
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchInput(value);
  debouncedSearch(value);
};
  
  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartElement = document.getElementById('shopping-cart');
      const cartButton = document.getElementById('cart-button');
      
      if (
        isCartOpen && 
        cartElement && 
        !cartElement.contains(event.target as Node) &&
        !cartButton?.contains(event.target as Node)
      ) {
        closeCart();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, closeCart]);

  // Render checkout steps
  const renderCheckoutStep = () => {
    if (orderPlaced) {
      return (
        <div className="p-8 text-center">
          <div className="bg-green-800/30 text-green-400 p-4 mb-6 border border-green-700">
            <h3 className="font-bold text-xl mb-2">Order Confirmed!</h3>
            <p>Thank you for your purchase. Your order has been received.</p>
            <p className="mt-2 text-sm">Order #: {Math.floor(Math.random() * 10000000)}</p>
          </div>
          <p className="text-gray-400 mb-4">A confirmation email has been sent to {checkoutFormData.email}</p>
          <Button
            onClick={() => {
              closeCheckout();
              clearCart();
            }}
            className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
          >
            Continue Shopping
          </Button>
        </div>
      );
    }
    
    switch (checkoutStep) {
      case 1:
        return (
          <form onSubmit={handleCheckoutSubmit} className="p-6">
            <h3 className="font-bold text-xl mb-6">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={checkoutFormData.firstName}
                  onChange={(e) => updateCheckoutForm('firstName', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={checkoutFormData.lastName}
                  onChange={(e) => updateCheckoutForm('lastName', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={checkoutFormData.email}
                  onChange={(e) => updateCheckoutForm('email', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={closeCheckout}
                className="bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
              >
                Continue to Shipping
              </Button>
            </div>
          </form>
        );
      
      case 2:
        return (
          <form onSubmit={handleCheckoutSubmit} className="p-6">
            <h3 className="font-bold text-xl mb-6">Shipping Address</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={checkoutFormData.address}
                  onChange={(e) => updateCheckoutForm('address', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={checkoutFormData.city}
                    onChange={(e) => updateCheckoutForm('city', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Zip/Postal Code</label>
                  <input
                    type="text"
                    required
                    value={checkoutFormData.zipCode}
                    onChange={(e) => updateCheckoutForm('zipCode', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Country</label>
                <select
                  required
                  value={checkoutFormData.country}
                  onChange={(e) => updateCheckoutForm('country', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={() => setCheckoutStep(1)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        );
      
      case 3:
        return (
          <form onSubmit={handleCheckoutSubmit} className="p-6">
            <h3 className="font-bold text-xl mb-6">Payment Information</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="•••• •••• •••• ••••"
                    value={checkoutFormData.cardNumber}
                    onChange={(e) => {
                      // Only allow numbers and format with spaces
                      const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                      const formatVal = val.replace(/(.{4})/g, '$1 ').trim();
                      updateCheckoutForm('cardNumber', formatVal);
                    }}
                    className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={checkoutFormData.cardExpiry}
                    onChange={(e) => {
                      // Format as MM/YY
                      const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                      if (val.length > 2) {
                        updateCheckoutForm('cardExpiry', `${val.substring(0, 2)}/${val.substring(2)}`);
                      } else {
                        updateCheckoutForm('cardExpiry', val);
                      }
                    }}
                    className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CVC</label>
                  <input
                    type="text"
                    required
                    placeholder="•••"
                    value={checkoutFormData.cardCVC}
                    onChange={(e) => {
                      // Only allow 3-4 numbers
                      const val = e.target.value.replace(/\D/g, '').substring(0, 4);
                      updateCheckoutForm('cardCVC', val);
                    }}
                    className="w-full p-3 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-800 border border-gray-700">
              <h4 className="font-bold mb-2">Order Summary</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold border-t border-gray-700 pt-2">
                <span>Total</span>
                <span>${(cartTotal + 5.99 + cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={() => setCheckoutStep(2)}
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
              >
                Complete Order
              </Button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-[url(/shop-hero.jpg)] bg-cover bg-center h-64 md:h-80">
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Products</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
              Premium hair care products used and recommended by our stylists
            </p>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search and Cart Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="relative w-full md:w-96 mb-4 md:mb-0">
          <input
              type="text"
              placeholder="Search products..."
               value={searchInput}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 text-white focus:ring-[#fbb034] focus:border-[#fbb034] outline-none"
               />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center">
            <button 
              id="cart-button"
              className="relative p-2 mr-2"
              onClick={toggleCart}
            >
              <ShoppingCart size={24} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fbb034] text-black text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="flex items-center bg-gray-800 p-2 border border-gray-700 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
        
        {/* Shopping Cart Dropdown */}
        {isCartOpen && (
          <div 
            id="shopping-cart"
            className="fixed right-4 md:right-8 top-20 z-50 w-full max-w-md bg-gray-800 border border-gray-700 shadow-lg"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg">Shopping Cart ({cartCount})</h3>
              <button onClick={closeCart}>
                <X size={18} />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {cart.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {cart.map(item => (
                    <div key={item.product.id} className="p-4 flex items-center">
                      <div className="h-16 w-16 bg-gray-700 mr-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm text-gray-400">{item.product.brand}</div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm mt-1">
                          ${(item.product.salePrice || item.product.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 ml-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  Your cart is empty
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={openCheckout}
                  className="w-full bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Checkout Overlay */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                <h2 className="font-bold text-xl">Checkout</h2>
                <button onClick={closeCheckout}>
                <X size={18} />
                </button>
              </div>
              
              {renderCheckoutStep()}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar - Hidden on mobile unless toggled */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block col-span-1 space-y-8`}>
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`block w-full text-left px-3 py-2 transition-colors ${
                      activeCategory === category.id
                        ? "bg-[#fbb034]/10 text-[#fbb034]"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setActiveSorting(option.id)}
                    className={`block w-full text-left px-3 py-2 transition-colors ${
                      activeSorting === option.id
                        ? "bg-[#fbb034]/10 text-[#fbb034]"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Additional filter for in-stock only */}
            <div>
              <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Availability</h3>
              <label className="flex items-center px-3 py-2 cursor-pointer text-gray-300 hover:bg-gray-800">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 accent-[#fbb034]"
                />
                In Stock Only
              </label>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="col-span-1 md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map(product => (
                  <div key={product.id} className="bg-gray-800 border border-gray-700 group">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-700 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Sale or New Badge */}
                      {product.salePrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                          SALE
                        </div>
                      )}
                      {product.isNew && !product.salePrice && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1">
                          NEW
                        </div>
                      )}
                      
                      {/* Out of Stock Overlay */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="bg-gray-800 text-white px-4 py-2 font-bold">OUT OF STOCK</span>
                        </div>
                      )}
                      
                      {/* Quick View Button (hidden until hover) */}
                      {product.inStock && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => addToCart(product)}
                            className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
                          >
                            Quick Add
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <div className="text-sm text-gray-400 mb-1">{product.brand}</div>
                      <h3 className="font-bold text-white mb-2">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {product.salePrice ? (
                            <>
                              <span className="text-red-500 font-bold mr-2">${product.salePrice.toFixed(2)}</span>
                              <span className="text-gray-400 line-through text-sm">${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none px-3 py-1 text-sm disabled:bg-gray-700 disabled:text-gray-500"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-400">No products found matching your criteria.</p>
                  <Button 
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchTerm('');
                    }}
                    className="mt-4 bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Staff Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {products
              .filter(product => product.bestseller)
              .map(product => (
                <div key={product.id} className="bg-gray-900 border border-gray-700 group">
                  <div className="relative aspect-square bg-gray-700 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* Quick View Button (hidden until hover) */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => addToCart(product)}
                        className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
                      >
                        Quick Add
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-400">{product.brand}</div>
                    <h3 className="font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">${(product.salePrice || product.price).toFixed(2)}</span>
                      <Button
                        onClick={() => addToCart(product)}
                        className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black rounded-none px-3 py-1 text-sm"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to get special offers, free giveaways, and product launches.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow p-3 bg-gray-800 border border-gray-700 text-white outline-none sm:rounded-none"
              required
            />
            <Button 
              type="submit" 
              className="mt-2 sm:mt-0 bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold px-8 py-3 rounded-none"
            >
              Subscribe
            </Button>
          </form>
          
          {/* Subscription confirmation message */}
          {subscribed && (
            <div className="mt-4 p-2 bg-green-800/50 text-green-400 border border-green-700">
              Thank you for subscribing! You'll receive our next newsletter soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};