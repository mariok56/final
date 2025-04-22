import { X } from 'lucide-react';
import { useShopStore } from '../../../../store/shopStore';
import { ContactStep } from './ContactStep';
import { ShippingStep } from './ShippingStep';
import { PaymentStep } from './PaymentStep';
import { OrderConfirmation } from './OrderConfirmation';

export const CheckoutModal = () => {
  const { 
    checkoutStep, 
    closeCheckout,
    orderPlaced
  } = useShopStore();
  
  const renderCheckoutStep = () => {
    if (orderPlaced) {
      return <OrderConfirmation />;
    }
    
    switch (checkoutStep) {
      case 1:
        return <ContactStep />;
      case 2:
        return <ShippingStep />;
      case 3:
        return <PaymentStep />;
      default:
        return null;
    }
  };
  
  return (
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
  );
};