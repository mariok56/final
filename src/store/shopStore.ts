// src/store/shopStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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
  completeOrder: () => Promise<void>;
  resetOrderPlaced: () => void;
}

// Create the store
export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
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
      
      completeOrder: async () => {
        const state = get();
        
        try {
          // Calculate total
          const subtotal = state.cart.reduce((total, item) => {
            const price = item.product.salePrice || item.product.price;
            return total + (price * item.quantity);
          }, 0);
          
          const shipping = 5.99;
          const tax = subtotal * 0.08;
          const total = subtotal + shipping + tax;
          
          // Create order document in Firestore
          const orderData = {
            items: state.cart,
            customer: state.checkoutFormData,
            subtotal,
            shipping,
            tax,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: state.checkoutFormData.email, // Temporary: using email as userId
          };
          
          const docRef = await addDoc(collection(db, 'orders'), orderData);
          console.log('Order created with ID:', docRef.id);
          
          set({
            orderPlaced: true,
            checkoutStep: 4,
          });
        } catch (error) {
          console.error('Error creating order:', error);
          throw error;
        }
      },
      
      resetOrderPlaced: () => set({ orderPlaced: false })
    }),
    {
      name: 'shop-storage',
      partialize: (state) => ({ cart: state.cart }) // Only persist cart
    }
  )
);