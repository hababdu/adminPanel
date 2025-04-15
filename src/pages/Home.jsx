import React, { useMemo, useState } from "react";
import {
  FiShoppingCart, FiUsers, FiUser, FiPackage, FiTruck, 
  FiDollarSign, FiDatabase, FiDownload, FiActivity,
  FiPlus, FiEdit, FiEye, FiTrash2, FiFilter, FiSearch,
  FiClock, FiAlertCircle, FiCheckCircle, FiSettings,
  FiBell, FiChevronDown, FiChevronUp, FiMenu, FiX,
  FiBarChart2, FiHome, FiLogOut
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redax/adminAbilitiesSlice";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';

const AdminHomePage = () => {
  // Redux stateni olish
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const searchQuery = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('week');
  const [chartView, setChartView] = useState('bar');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Ikonlar obyekti
  const iconComponents = {
    FiShoppingCart,
    FiUsers,
    FiUser,
    FiPackage,
    FiTruck,
    FiDollarSign,
    FiDatabase,
    FiActivity,
    FiSettings,
    FiBarChart2,
    FiHome,
    FiLogOut,
    // Barcha ishlatilgan ikonlar...
  };

  // Namuna ma'lumotlar
  const chartData = useMemo(() => {
    const baseData = [
      { day: 'Dush', orders: 400, revenue: 2400 },
      { day: 'Sesh', orders: 600, revenue: 1398 },
      { day: 'Chor', orders: 800, revenue: 9800 },
      { day: 'Pay', orders: 500, revenue: 3908 },
      { day: 'Jum', orders: 900, revenue: 4800 },
      { day: 'Shan', orders: 1000, revenue: 3800 },
      { day: 'Yak', orders: 700, revenue: 4300 },
    ];

    if (dateRange === 'week') return baseData;
    if (dateRange === 'month') {
      return Array.from({ length: 30 }, (_, i) => ({
        day: `${i+1}`,
        orders: Math.floor(Math.random() * 1000) + 300,
        revenue: Math.floor(Math.random() * 10000) + 2000
      }));
    }
    return baseData;
  }, [dateRange]);

  // Kuryerlar holati
  const courierStatusData = [
    { name: 'Faol', value: 75, color: '#00C49F' },
    { name: 'Yetkazishda', value: 25, color: '#0088FE' },
    { name: 'Nofaol', value: 10, color: '#FFBB28' },
  ];

  // Buyurtma holatlari
  const orderStatusData = [
    { name: 'Yetkazilgan', value: 45, color: '#00C49F' },
    { name: 'Jarayonda', value: 30, color: '#0088FE' },
    { name: 'Bekor qilingan', value: 15, color: '#FF8042' },
    { name: 'Qaytarilgan', value: 10, color: '#FFBB28' },
  ];

  // Statistik kartalar
  const stats = [
    { 
      title: "Jami Buyurtmalar", 
      value: "12,345", 
      change: "+12%", 
      trend: "up", 
      path: "/orders",
      icon: <FiShoppingCart className="text-blue-500" />
    },
    { 
      title: "Jami Daromad", 
      value: "$56,789", 
      change: "+8%", 
      trend: "up", 
      path: "/revenue",
      icon: <FiDollarSign className="text-green-500" />
    },
    { 
      title: "Faol Kuryerlar", 
      value: "87", 
      change: "+5", 
      trend: "up", 
      path: "/couriers",
      icon: <FiTruck className="text-purple-500" />
    },
    { 
      title: "Kutilayotgan Buyurtmalar", 
      value: "234", 
      change: "-3%", 
      trend: "down", 
      path: "/pending-orders",
      icon: <FiPackage className="text-yellow-500" />
    },
  ];

  // Tezkor amallar
  const quickActions = [
    { title: "Yangi mahsulot", icon: <FiPlus />, action: () => handleNavigation("/add-product") },
    { title: "Foydalanuvchi qo'shish", icon: <FiUser />, action: () => handleNavigation("/add-user") },
    { title: "Buyurtma yaratish", icon: <FiShoppingCart />, action: () => handleNavigation("/create-order") },
    { title: "Hisobot yaratish", icon: <FiDatabase />, action: () => handleNavigation("/generate-report") },
  ];

  // Navigatsiya funktsiyasi
  const handleNavigation = (path) => {
    dispatch(setActiveTab(path));
    navigate(path);
  };

  // Filtrlangan imkoniyatlar
  const filteredAbilities = useMemo(() =>
    abilities.filter(ability =>
      ability.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ability.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [abilities, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6">
        {activeTab === "dashboard" && (
          <>
            {/* Sarlavha va tezkor amallar */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Boshqaruv Paneli</h1>
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <FiPlus className="mr-2" />
                  Tezkor Amal
                </button>
                
                {showQuickActions && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{action.icon}</span>
                          {action.title}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div 
                  key={`stat-${index}`} 
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer border border-gray-100"
                  onClick={() => handleNavigation(stat.path)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold mt-1 text-gray-800">{stat.value}</p>
                      <p className={`text-sm mt-2 flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                        <span className="ml-1">
                          {stat.trend === 'up' ? '↑' : '↓'}
                        </span>
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-opacity-20 bg-gray-200">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Diagrammalar bo'limi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Buyurtmalar va daromad */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Buyurtmalar va Daromad</h3>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="week">1 Hafta</option>
                      <option value="month">1 Oy</option>
                    </select>
                    <select 
                      value={chartView}
                      onChange={(e) => setChartView(e.target.value)}
                      className="text-sm border border-gray-200 rounded px-2 py-1"
                    >
                      <option value="bar">Stolbchali</option>
                      <option value="line">Chiziqli</option>
                      <option value="area">Maydon</option>
                    </select>
                    <button className="text-sm bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 flex items-center">
                      <FiDownload className="mr-1" /> Yuklab olish
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === 'bar' ? (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#888" />
                        <YAxis yAxisId="left" orientation="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" name="Buyurtmalar" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="revenue" name="Daromad ($)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : chartView === 'line' ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Kuryerlar holati */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Kuryerlar Holati</h3>
                  <button 
                    className="text-sm text-indigo-600 hover:underline flex items-center"
                    onClick={() => handleNavigation("/couriers")}
                  >
                    Boshqarish <FiUsers className="ml-1" />
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courierStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {courierStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} ta`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Qo'shimcha bo'limlar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Buyurtma holatlari */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Buyurtma Holatlari</h3>
                  <button 
                    className="text-sm text-indigo-600 hover:underline flex items-center"
                    onClick={() => handleNavigation("/orders")}
                  >
                    Barchasi <FiDatabase className="ml-1" />
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} ta`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* So'nggi faoliyat */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">So'nggi Faoliyat</h3>
                  <button 
                    className="text-sm text-indigo-600 hover:underline flex items-center"
                    onClick={() => handleNavigation("/activity")}
                  >
                    Barchasi <FiActivity className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start border-b border-gray-100 pb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FiUser className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Yangi buyurtma #100{item}</p>
                        <p className="text-xs text-gray-500">10:3{item} AM - Bugun</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Yangi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  );
};

export default AdminHomePage;