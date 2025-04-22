// src/store/shopStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Define our Zustand store
interface ShopState {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutStep: number;
  checkoutFormData: CheckoutFormData;
  orderPlaced: boolean;
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
  completeOrder: () => void;
  resetOrderPlaced: () => void;
}

// Create the store
export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      checkoutStep: 1,
      orderPlaced: false,
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
        }
      }),
      
      setCheckoutStep: (step) => set({ checkoutStep: step }),
      
      updateCheckoutForm: (field, value) => set((state) => ({
        checkoutFormData: {
          ...state.checkoutFormData,
          [field]: value
        }
      })),
      
      completeOrder: () => set((state) => {
        console.log('Order completed:', {
          cart: state.cart,
          customer: state.checkoutFormData
        });
        
        return {
          orderPlaced: true,
          checkoutStep: 4,
          // Will automatically clear cart after confirmation animation
        };
      }),
      
      resetOrderPlaced: () => set({ orderPlaced: false })
    }),
    {
      name: 'shop-storage',
      partialize: (state) => ({ cart: state.cart }) // Only persist cart
    }
  )
);

// Helper function to calculate cart total
export const getCartTotal = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
};

// Helper function to calculate cart count
export const getCartCount = (cart: CartItem[]) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Helper function to check if product is in cart
export const isProductInCart = (cart: CartItem[], productId: number) => {
  return cart.some(item => item.product.id === productId);
};

// Helper function to get product quantity in cart
export const getProductQuantityInCart = (cart: CartItem[], productId: number) => {
  const item = cart.find(item => item.product.id === productId);
  return item ? item.quantity : 0;
};

// Sample products data that can be used across the application
export const sampleProducts: Product[] = [
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
    image: "./curl.png",
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
    image: "./colorprotection.png",
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