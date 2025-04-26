// src/screens/Admin/Overview.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, Package } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Fetch today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('date', '>=', today.toISOString().split('T')[0]),
          where('date', '<', tomorrow.toISOString().split('T')[0])
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const todayAppointments = appointmentsSnapshot.size;

        // Fetch total revenue (from orders)
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        let totalRevenue = 0;
        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          totalRevenue += order.total || 0;
        });

        // Fetch total products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const totalProducts = productsSnapshot.size;

        setStats({
          totalUsers,
          todayAppointments,
          totalRevenue,
          totalProducts,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="text-[#fbb034]" size={24} />,
      path: '/admin/users',
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <Calendar className="text-[#fbb034]" size={24} />,
      path: '/admin/appointments',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="text-[#fbb034]" size={24} />,
      path: '/admin/orders',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="text-[#fbb034]" size={24} />,
      path: '/admin/products',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="bg-gray-800 p-6 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              {card.icon}
              <span className="text-3xl font-bold">{card.value}</span>
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Recent Appointments</h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>
        <div className="bg-gray-800 p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    </div>
  );
};