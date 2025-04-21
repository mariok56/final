// src/stores/shopStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

  // Cart actions
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;

  // UI actions
  toggleCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: number) => void;
  updateCheckoutForm: (field: keyof CheckoutFormData, value: string) => void;

  // Cart calculations
  getCartCount: () => number;
  getCartTotal: () => number;
  getOrderTotal: () => number;
}

// Create the store with persistence to localStorage
export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
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

      // Add item to cart
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

      // Update quantity of an item
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

      // Remove item from cart
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),

      // Clear cart
      clearCart: () => set({ cart: [] }),

      // Toggle cart visibility
      toggleCart: () => set((state) => ({
        isCartOpen: !state.isCartOpen,
        isCheckoutOpen: false
      })),

      // Close cart
      closeCart: () => set({ isCartOpen: false }),

      // Open checkout
      openCheckout: () => set({
        isCartOpen: false,
        isCheckoutOpen: true,
        checkoutStep: 1
      }),

      // Close checkout
      closeCheckout: () => set({
        isCheckoutOpen: false,
        checkoutStep: 1
      }),

      // Set checkout step
      setCheckoutStep: (step) => set({ checkoutStep: step }),

      // Update checkout form data
      updateCheckoutForm: (field, value) => set((state) => ({
        checkoutFormData: {
          ...state.checkoutFormData,
          [field]: value
        }
      })),

      // Get cart count
      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      // Get cart subtotal
      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.product.salePrice || item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      // Get total order amount including shipping and tax
      getOrderTotal: () => {
        const subtotal = get().getCartTotal();
        const shipping = 5.99;
        const tax = subtotal * 0.08;
        return subtotal + shipping + tax;
      }
    }),
    {
      name: 'hair-salon-cart',
      storage: createJSONStorage(() => localStorage), // ✅ Correctly typed for TypeScript
    }
  )
);
