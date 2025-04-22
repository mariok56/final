import { useState } from 'react';
import { Button } from '../../../components/ui/button';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      console.log(`Subscribing email: ${email}`);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };
  
  return (
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
        
        {subscribed && (
          <div className="mt-4 p-2 bg-green-800/50 text-green-400 border border-green-700">
            Thank you for subscribing! You'll receive our next newsletter soon.
          </div>
        )}
      </div>
    </div>
  );
};