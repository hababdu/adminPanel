import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, clearError } from '../redax/usersSlice';
import {
  Box,
  CircularProgress,
  Button,
  Typography,
} from '@mui/material';
import {
  FiUsers, FiUser, FiPlus, FiSearch, FiDownload, FiX,
  FiMoon, FiSun, FiDatabase, FiActivity,
} from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import AllUsersList from './UsersPage';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.users);
  const [dateRange, setDateRange] = useState('week');
  const [chartType, setChartType] = useState('bar');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Memoized chart data
  const chartData = useMemo(() => {
    const baseData = [
      { day: 'Dush', users: 120, active: 80 },
      { day: 'Sesh', users: 150, active: 100 },
      { day: 'Chor', users: 200, active: 140 },
      { day: 'Pay', users: 130, active: 90 },
      { day: 'Jum', users: 180, active: 120 },
      { day: 'Shan', users: 220, active: 160 },
      { day: 'Yak', users: 160, active: 110 },
    ];

    if (dateRange === 'week') return baseData;
    if (dateRange === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        users: Math.floor(Math.random() * 200) + 50,
        active: Math.floor(Math.random() * 150) + 30,
      }));
    }
    return Array.from({ length: 12 }, (_, i) => ({
      day: `${i + 1}-oy`,
      users: Math.floor(Math.random() * 2000) + 500,
      active: Math.floor(Math.random() * 1500) + 300,
    }));
  }, [dateRange]);

  // Pie chart data
  const userStatusData = [
    { name: 'Faol', value: 60, color: '#00C49F' },
    { name: 'Nofaol', value: 30, color: '#FFBB28' },
    { name: 'Bloklangan', value: 10, color: '#FF8042' },
  ];

  // Stats grid data
  const stats = [
    {
      title: 'Jami Foydalanuvchilar',
      value: users.length.toLocaleString(),
      change: '+10%',
      trend: 'up',
      path: '/users',
      icon: <FiUsers className="text-indigo-500" />,
    },
    {
      title: 'Yangi Ro‘yxatdan O‘tganlar',
      value: users.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(),
      change: '+5%',
      trend: 'up',
      path: '/users',
      icon: <FiUser className="text-blue-500" />,
    },
    {
      title: 'Faol Foydalanuvchilar',
      value: users.filter(u => u.is_active).length.toString(),
      change: '+8%',
      trend: 'up',
      path: '/users',
      icon: <FiActivity className="text-green-500" />,
    },
    {
      title: 'Hisobotlar',
      value: '12',
      change: '+3%',
      trend: 'up',
      path: '/reports',
      icon: <FiDatabase className="text-purple-500" />,
    },
  ];

  // Quick actions
  const quickActions = useMemo(() => [
    { title: 'Foydalanuvchi qo‘shish', icon: <FiUser />, action: () => handleNavigation('/add-user') },
    { title: 'Hisobot yaratish', icon: <FiDatabase />, action: () => handleNavigation('/generate-report') },
    { title: 'Foydalanuvchilarni boshqarish', icon: <FiUsers />, action: () => handleNavigation('/users') },
  ], []);

  // Navigation handler
  const handleNavigation = useCallback((path) => {
    navigate(path);
    setIsQuickActionsOpen(false);
  }, [navigate]);

  // Export chart data to CSV
  const handleExport = useCallback(() => {
    const csvContent = [
      ['Day', 'Users', 'Active'],
      ...chartData.map(item => [item.day, item.users, item.active]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [chartData]);

  // Render chart based on type
  const renderChart = useCallback(() => {
    const chartProps = {
      data: chartData,
      children: [
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#f0f0f0'} />,
        <XAxis key="xAxis" dataKey="day" stroke={isDarkMode ? '#ccc' : '#888'} />,
        <YAxis key="yAxis" stroke={isDarkMode ? '#ccc' : '#888'} />,
        <Tooltip key="tooltip" contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#444' : '#ccc' }} />,
        <Legend key="legend" />,
      ],
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {chartProps.children}
            <Bar dataKey="users" name="Foydalanuvchilar" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="active" name="Faol" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...chartProps}>
            {chartProps.children}
            <Line type="monotone" dataKey="users" name="Foydalanuvchilar" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="active" name="Faol" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            {chartProps.children}
            <Area type="monotone" dataKey="users" name="Foydalanuvchilar" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
            <Area type="monotone" dataKey="active" name="Faol" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
          </AreaChart>
        );
      default:
        return null;
    }
  }, [chartType, chartData, isDarkMode]);

  const handleLoginRedirect = () => {
    localStorage.removeItem('token');
    navigate('/register');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={error.includes('Autentifikatsiya xatosi') ? handleLoginRedirect : () => dispatch(fetchUsers())}
            sx={{ mt: 2 }}
          >
            {error.includes('Autentifikatsiya xatosi') ? 'Qayta kirish' : 'Qayta urinish'}
          </Button>
        </div>
      </Box>
    );
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Foydalanuvchilar Boshqaruvi</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setIsQuickActionsOpen(true)}
              className="flex items-center text-sm px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-indigo-700 transition"
            >
              <FiPlus className="mr-2" /> Tezkor Amal
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
          {stats.map((stat, index) => (
            <div
              key={`stat-${index}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => handleNavigation(stat.path)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${stat.title}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1 text-gray-800 dark:text-white">{stat.value}</p>
                  <p className={`text-sm mt-2 flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    <span className="ml-1">{stat.trend === 'up' ? '↑' : '↓'}</span>
                  </p>
                </div>
                <div className="p-3 rounded-full bg-opacity-20 bg-gray-200 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Registration Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Foydalanuvchilar Ro‘yxatdan O‘tishi</h3>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="week">1 Hafta</option>
                  <option value="month">1 Oy</option>
                  <option value="year">1 Yil</option>
                </select>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="text-sm border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bar">Stolbchali</option>
                  <option value="line">Chiziqli</option>
                  <option value="area">Maydon</option>
                </select>
                <button
                  onClick={handleExport}
                  className="text-sm px-3 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-indigo-700 transition flex items-center"
                >
                  <FiDownload className="mr-1" /> Yuklab olish
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Status Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Foydalanuvchilar Holati</h3>
              <button
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                onClick={() => handleNavigation('/users')}
              >
                Boshqarish <FiUsers className="ml-1" />
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} ta`, name]}
                    contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#444' : '#ccc' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* All Users List */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
          <AllUsersList />
        </section>

        {/* Quick Actions Modal */}
        {isQuickActionsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tezkor Amallar</h3>
                <button onClick={() => setIsQuickActionsOpen(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700">
                  <FiX size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    {action.icon}
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;