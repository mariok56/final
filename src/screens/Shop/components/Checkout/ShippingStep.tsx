import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useShopStore } from '../../../../store/shopStore';

export const ShippingStep = () => {
  const { checkoutFormData, updateCheckoutForm, setCheckoutStep } = useShopStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep(3);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
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
};