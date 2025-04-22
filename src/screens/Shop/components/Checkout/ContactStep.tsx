import { Button } from '../../../../components/ui/button';
import { useShopStore } from '../../../../store/shopStore';

export const ContactStep = () => {
  const { checkoutFormData, updateCheckoutForm, setCheckoutStep } = useShopStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep(2);
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
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
          onClick={() => useShopStore.getState().closeCheckout()}
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
};