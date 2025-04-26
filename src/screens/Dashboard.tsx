// src/screens/Admin/Dashboard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Users, Calendar, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, {user?.name}</span>
            <Button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 border border-gray-700 cursor-pointer hover:bg-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Users className="text-[#fbb034]" size={24} />
              <h2 className="text-xl font-semibold">Users</h2>
            </div>
            <p className="text-gray-400">Manage user accounts and roles</p>
          </div>

          <div className="bg-gray-800 p-6 border border-gray-700 cursor-pointer hover:bg-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="text-[#fbb034]" size={24} />
              <h2 className="text-xl font-semibold">Appointments</h2>
            </div>
            <p className="text-gray-400">View and manage all appointments</p>
          </div>

          <div className="bg-gray-800 p-6 border border-gray-700 cursor-pointer hover:bg-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <ShoppingCart className="text-[#fbb034]" size={24} />
              <h2 className="text-xl font-semibold">Orders</h2>
            </div>
            <p className="text-gray-400">Manage product orders and inventory</p>
          </div>

          <div className="bg-gray-800 p-6 border border-gray-700 cursor-pointer hover:bg-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <Settings className="text-[#fbb034]" size={24} />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <p className="text-gray-400">Configure system settings</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-[#fbb034]">0</p>
            </div>
            <div className="bg-gray-800 p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Appointments Today</h3>
              <p className="text-3xl font-bold text-[#fbb034]">0</p>
            </div>
            <div className="bg-gray-800 p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Orders This Week</h3>
              <p className="text-3xl font-bold text-[#fbb034]">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};