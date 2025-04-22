import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useShopStore } from '../../../../store/shopStore';

export const PaymentStep = () => {
  const { 
    cart,
    checkoutFormData, 
    updateCheckoutForm, 
    setCheckoutStep,
    completeOrder 
  } = useShopStore();
  
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically process the payment
    completeOrder();
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
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
};