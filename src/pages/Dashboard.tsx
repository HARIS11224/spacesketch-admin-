import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Users, ShoppingBag, ArrowUpRight } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import TopAssetsWidget from '../components/dashboard/TopAssetsWidget';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to login if no admin token
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const [statsData, setStatsData] = useState({
    users: 0,
    items: 0,
    textures: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, itemsRes, texturesRes] = await Promise.all([
          axios.get('https://space-backend-production.up.railway.app/api/users/count'),
          axios.get('https://space-backend-production.up.railway.app/api/items/count'),
          axios.get('https://space-backend-production.up.railway.app/api/textures/count'),
        ]);

        setStatsData({
          users: usersRes.data.count,
          items: itemsRes.data.count,
          textures: texturesRes.data.count,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('admin_token');
  //   window.location.href = '/admin-login';
  // };

  const stats = [
    {
      title: 'Total Users',
      value: statsData.users.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: <Users className="text-blue-500" size={24} />,
    },
    {
      title: 'Furniture Items',
      value: statsData.items.toString(),
      change: '+8%',
      trend: 'up' as const,
      icon: <ShoppingBag className="text-purple-500" size={24} />,
    },
    {
      title: 'Texture Assets',
      value: statsData.textures.toString(),
      change: '+5%',
      trend: 'up' as const,
      icon: <BarChart3 className="text-amber-500" size={24} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors duration-200"
            onClick={() => {
              /* your view reports action */
            }}
          >
            <span>View Reports</span>
            <ArrowUpRight size={16} />
          </button>
          {/* <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Logout
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAssetsWidget type="texture" />
      </div>
    </div>
  );
};

export default Dashboard;
