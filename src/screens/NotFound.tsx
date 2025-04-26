// src/screens/NotFound.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#fbb034] mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-none flex items-center justify-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Go Back
          </Button>
          
          <Link to="/">
            <Button className="bg-[#fbb034] hover:bg-[#fbb034]/90 text-black font-bold px-6 py-3 rounded-none flex items-center justify-center w-full">
              <Home className="mr-2" size={18} />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            If you believe this is a mistake, please{' '}
            <Link to="/contact" className="text-[#fbb034] hover:underline">
              contact our support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};