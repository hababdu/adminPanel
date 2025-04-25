import React, { useMemo, useState } from "react";
import {
  FiShoppingCart, FiUsers, FiUser, FiPackage, FiTruck,
  FiDollarSign, FiDatabase, FiDownload, FiActivity,
  FiPlus, FiSettings, FiBell, FiMenu, FiX, FiBarChart2,
  FiHome, FiLogOut, FiMoon, FiSun, FiSearch, FiFilter
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redax/adminAbilitiesSlice";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from "recharts";

const AdminHomePage = () => {
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const searchQuery = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("week");
  const [chartView, setChartView] = useState("bar");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const iconComponents = {
    FiShoppingCart, FiUsers, FiUser, FiPackage, FiTruck,
    FiDollarSign, FiDatabase, FiActivity, FiSettings,
    FiBarChart2, FiHome, FiLogOut, FiSearch, FiFilter,
    FiMoon, FiSun
  };

  // Sample chart data
  const chartData = useMemo(() => {
    const baseData = [
      { day: "Dush", orders: 400, revenue: 2400 },
      { day: "Sesh", orders: 600, revenue: 1398 },
      { day: "Chor", orders: 800, revenue: 9800 },
      { day: "Pay", orders: 500, revenue: 3908 },
      { day: "Jum", orders: 900, revenue: 4800 },
      { day: "Shan", orders: 1000, revenue: 3800 },
      { day: "Yak", orders: 700, revenue: 4300 },
    ];
    if (dateRange === "week") return baseData;
    if (dateRange === "month") {
      return Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        orders: Math.floor(Math.random() * 1000) + 300,
        revenue: Math.floor(Math.random() * 10000) + 2000,
      }));
    }
    if (dateRange === "year") {
      return Array.from({ length: 12 }, (_, i) => ({
        day: `${i + 1}-oy`,
        orders: Math.floor(Math.random() * 12000) + 3000,
        revenue: Math.floor(Math.random() * 100000) + 20000,
      }));
    }
    return baseData;
  }, [dateRange]);

  const courierStatusData = [
    { name: "Faol", value: 75, color: "#00C49F" },
    { name: "Yetkazishda", value: 25, color: "#0088FE" },
    { name: "Nofaol", value: 10, color: "#FFBB28" },
  ];

  const orderStatusData = [
    { name: "Yetkazilgan", value: 45, color: "#00C49F" },
    { name: "Jarayonda", value: 30, color: "#0088FE" },
    { name: "Bekor qilingan", value: 15, color: "#FF8042" },
    { name: "Qaytarilgan", value: 10, color: "#FFBB28" },
  ];

  const stats = [
    {
      title: "Jami Buyurtmalar",
      value: "12,345",
      change: "+12%",
      trend: "up",
      path: "/orders",
      icon: <FiShoppingCart className="text-blue-500" />,
    },
    {
      title: "Jami Daromad",
      value: "$56,789",
      change: "+8%",
      trend: "up",
      path: "/revenue",
      icon: <FiDollarSign className="text-green-500" />,
    },
    {
      title: "Faol Kuryerlar",
      value: "87",
      change: "+5",
      trend: "up",
      path: "/couriers",
      icon: <FiTruck className="text-purple-500" />,
    },
    {
      title: "Kutilayotgan Buyurtmalar",
      value: "234",
      change: "-3%",
      trend: "down",
      path: "/pending-orders",
      icon: <FiPackage className="text-yellow-500" />,
    },
  ];

  const quickActions = [
    { title: "Yangi mahsulot", icon: <FiPlus />, action: () => handleNavigation("/add-product") },
    { title: "Foydalanuvchi qo'shish", icon: <FiUser />, action: () => handleNavigation("/add-user") },
    { title: "Buyurtma yaratish", icon: <FiShoppingCart />, action: () => handleNavigation("/create-order") },
    { title: "Hisobot yaratish", icon: <FiDatabase />, action: () => handleNavigation("/generate-report") },
  ];

  const handleNavigation = (path) => {
    dispatch(setActiveTab(path));
    navigate(path);
    setShowQuickActions(false);
  };

  const filteredAbilities = useMemo(() =>
    abilities.filter(ability =>
      ability.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ability.description && ability.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [abilities, searchQuery]
  );

  const handleExport = () => {
    const csvContent = [
      ['Day', 'Orders', 'Revenue'],
      ...chartData.map(item => [item.day, item.orders, item.revenue])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === "dashboard" && (
          <>
            {/* Sarlavha va boshqaruv elementlari */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">Boshqaruv Paneli</h1>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Qidirish..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition`}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
                <button
                  onClick={() => setShowQuickActions(true)}
                  className={`flex items-center text-sm px-4 py-2 rounded-lg ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} transition`}
                >
                  <FiPlus className="mr-2" /> Tezkor Amal
                </button>
              </div>
            </div>

            {/* Filtrlar */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className={`text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="week">1 Hafta</option>
                  <option value="month">1 Oy</option>
                  <option value="year">1 Yil</option>
                </select>
                <select
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value)}
                  className={`text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="bar">Stolbchali</option>
                  <option value="line">Chiziqli</option>
                  <option value="area">Maydon</option>
                </select>
                <button
                  onClick={handleExport}
                  className={`flex items-center text-sm px-4 py-2 rounded-lg ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} transition`}
                >
                  <FiDownload className="mr-2" /> Yuklab olish
                </button>
              </div>
            </div>

            {/* Statistik kartalar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={`stat-${index}`}
                  className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} animate-fade-in`}
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
                    <div className={`p-3 rounded-full bg-opacity-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tezkor amallar modal */}
            {showQuickActions && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tezkor Amallar</h3>
                    <button onClick={() => setShowQuickActions(false)} className="text-gray-500 dark:text-gray-300 hover:text-gray-700">
                      <FiX size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition`}
                      >
                        <span>{action.icon}</span>
                        <span>{action.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Diagrammalar bo'limi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Buyurtmalar va daromad */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Buyurtmalar va Daromad</h3>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className={`text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="week">1 Hafta</option>
                      <option value="month">1 Oy</option>
                      <option value="year">1 Yil</option>
                    </select>
                    <select
                      value={chartView}
                      onChange={(e) => setChartView(e.target.value)}
                      className={`text-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="bar">Stolbchali</option>
                      <option value="line">Chiziqli</option>
                      <option value="area">Maydon</option>
                    </select>
                    <button
                      onClick={handleExport}
                      className={`text-sm px-3 py-2 rounded-lg ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'} transition flex items-center`}
                    >
                      <FiDownload className="mr-1" /> Yuklab olish
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartView === "bar" ? (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#f0f0f0"} />
                        <XAxis dataKey="day" stroke={isDarkMode ? "#ccc" : "#888"} />
                        <YAxis yAxisId="left" orientation="left" stroke={isDarkMode ? "#ccc" : "#888"} />
                        <YAxis yAxisId="right" orientation="right" stroke={isDarkMode ? "#ccc" : "#888"} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" name="Buyurtmalar" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="revenue" name="Daromad ($)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : chartView === "line" ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#f0f0f0"} />
                        <XAxis dataKey="day" stroke={isDarkMode ? "#ccc" : "#888"} />
                        <YAxis stroke={isDarkMode ? "#ccc" : "#888"} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }} />
                        <Legend />
                        <Line type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#f0f0f0"} />
                        <XAxis dataKey="day" stroke={isDarkMode ? "#ccc" : "#888"} />
                        <YAxis stroke={isDarkMode ? "#ccc" : "#888"} />
                        <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }} />
                        <Legend />
                        <Area type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Kuryerlar holati */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Kuryerlar Holati</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
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
                        formatter={(value, name) => [`${value} ta`, name]}
                        contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Buyurtma Holatlari</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
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
                        formatter={(value, name) => [`${value} ta`, name]}
                        contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* So'nggi faoliyat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">So'nggi Faoliyat</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/activity")}
                  >
                    Barchasi <FiActivity className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                        <FiUser className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Yangi buyurtma #{100 + item}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">10:3{item} AM - Bugun</p>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
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