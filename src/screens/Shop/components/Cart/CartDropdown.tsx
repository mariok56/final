import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useShopStore } from '../../../../store/shopStore';
import { CartItem } from './CartItem';

export const CartDropdown = () => {
  const { cart, closeCart, openCheckout } = useShopStore();
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
  
  return (
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
              <CartItem key={item.product.id} item={item} />
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
  );
};