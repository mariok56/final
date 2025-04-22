import { Button } from '../../../../components/ui/button';
import { useShopStore } from '../../../../store/shopStore';

export const OrderConfirmation = () => {
  const { checkoutFormData, clearCart, closeCheckout } = useShopStore();
  
  // Generate random order number
  const orderNumber = Math.floor(Math.random() * 10000000);
  
  const handleContinueShopping = () => {
    clearCart();
    closeCheckout();
  };
  
  return (
    <div className="p-8 text-center">
      <div className="bg-green-800/30 text-green-400 p-4 mb-6 border border-green-700">
        <h3 className="font-bold text-xl mb-2">Order Confirmed!</h3>
        <p>Thank you for your purchase. Your order has been received.</p>
        <p className="mt-2 text-sm">Order #: {orderNumber}</p>
      </div>
      <p className="text-gray-400 mb-4">
        A confirmation email has been sent to {checkoutFormData.email}
      </p>
      <Button
        onClick={handleContinueShopping}
        className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold"
      >
        Continue Shopping
      </Button>
    </div>
  );
};