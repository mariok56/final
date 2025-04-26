// src/screens/Admin/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Users, Calendar, ShoppingCart, Package, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { initializeFirebaseData } from '../../scripts/initializeFirebaseData';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Redirect non-admin users
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleInitializeData = async () => {
    setIsInitializing(true);
    try {
      await initializeFirebaseData();
      alert('Data initialized successfully!');
    } catch (error) {
      console.error('Error initializing data:', error);
      alert('Failed to initialize data. Check console for details.');
    } finally {
      setIsInitializing(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen fixed left-0 top-0 bottom-0 flex flex-col">
          <div className="p-4">
            <Link to="/" className="flex items-center mb-8">
              <img className="w-[42px] h-7" alt="Logo" src="/logo.svg" />
              <img className="w-[41px] h-[13px] ml-1.5" alt="Saloon" src="/saloon.svg" />
            </Link>
            <div className="text-sm text-gray-400">Admin Panel</div>
          </div>

          <nav className="flex-1 px-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-[#fbb034] text-black'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 space-y-3">
            {/* Only show initialization button if on the main dashboard */}
            {location.pathname === '/admin' && (
              <Button
                onClick={handleInitializeData}
                disabled={isInitializing}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Data'}
              </Button>
            )}
            
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
              <p className="text-gray-400">Manage your salon from here</p>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};