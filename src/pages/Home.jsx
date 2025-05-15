import React, { useMemo, useState, useCallback } from "react";
import {
  FiShoppingCart, FiUsers, FiUser, FiPackage, FiTruck,
  FiDollarSign, FiDatabase, FiDownload, FiActivity,
  FiPlus, FiSettings, FiBell, FiMenu, FiX, FiBarChart2,
  FiHome, FiLogOut, FiMoon, FiSun, FiSearch, FiFilter,
  FiCreditCard, FiStar, FiTag, FiHeadphones

} from "react-icons/fi";
import ProductCaunt from "../components/ProtectedCaunt";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redax/adminAbilitiesSlice";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from "recharts";
import  Register from "./Register";
// Constants
const STATS = [
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
  {
    title: "Foydalanuvchilar",
    value: "5,432",
    change: "+15%",
    trend: "up",
    path: "/users",
    icon: <FiUsers className="text-indigo-500" />,
  },
  {
    title: "To'lovlar",
    value: "$45,123",
    change: "+10%",
    trend: "up",
    path: "/payments",
    icon: <FiCreditCard className="text-teal-500" />,
  },
  {
    title: "Mahsulotlar",
    value: "1,234",
    change: "+7%",
    trend: "up",
    path: "/products",
    icon: <FiTag className="text-orange-500" />,
  },
  {
    title: "Shikoyatlar",
    value: "45",
    change: "-2%",
    trend: "down",
    path: "/support",
    icon: <FiHeadphones className="text-red-500" />,
  },
];

const AdminHomePage = () => {
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const searchQuery = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("week");
  const [chartType, setChartType] = useState("bar");
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Memoized chart data
  const chartData = useMemo(() => {
    const baseData = [
      { day: "Dush", orders: 400, revenue: 2400, users: 120 },
      { day: "Sesh", orders: 600, revenue: 1398, users: 150 },
      { day: "Chor", orders: 800, revenue: 9800, users: 200 },
      { day: "Pay", orders: 500, revenue: 3908, users: 130 },
      { day: "Jum", orders: 900, revenue: 4800, users: 180 },
      { day: "Shan", orders: 1000, revenue: 3800, users: 220 },
      { day: "Yak", orders: 700, revenue: 4300, users: 160 },
    ];

    if (dateRange === "week") return baseData;
    if (dateRange === "month") {
      return Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        orders: Math.floor(Math.random() * 1000) + 300,
        revenue: Math.floor(Math.random() * 10000) + 2000,
        users: Math.floor(Math.random() * 200) + 100,
      }));
    }
    return Array.from({ length: 12 }, (_, i) => ({
      day: `${i + 1}-oy`,
      orders: Math.floor(Math.random() * 12000) + 3000,
      revenue: Math.floor(Math.random() * 100000) + 20000,
      users: Math.floor(Math.random() * 2000) + 1000,
    }));
  }, [dateRange]);

  // Pie chart data
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

  const paymentStatusData = [
    { name: "Muvaffaqiyatli", value: 60, color: "#00C49F" },
    { name: "Kutilmoqda", value: 20, color: "#FFBB28" },
    { name: "Muvaffaqiyatsiz", value: 20, color: "#FF8042" },
  ];

  const topProductsData = [
    { name: "Smartfon", value: 120, color: "#8884d8" },
    { name: "Noutbuk", value: 80, color: "#82ca9d" },
    { name: "Televizor", value: 50, color: "#ffc658" },
    { name: "Quloqlik", value: 30, color: "#ff7300" },
  ];

  // Quick actions
  const quickActions = useMemo(() => [
    { title: "Yangi mahsulot", icon: <FiPlus />, action: () => handleNavigation("/add-product") },
    { title: "Foydalanuvchi qo'shish", icon: <FiUser />, action: () => handleNavigation("/add-user") },
    { title: "Buyurtma yaratish", icon: <FiShoppingCart />, action: () => handleNavigation("/create-order") },
    { title: "Hisobot yaratish", icon: <FiDatabase />, action: () => handleNavigation("/generate-report") },
    { title: "Kuryer qo'shish", icon: <FiTruck />, action: () => handleNavigation("/add-courier") },
  ], []);

  // Navigation handler
  const handleNavigation = useCallback((path) => {
    dispatch(setActiveTab(path));
    navigate(path);
    setIsQuickActionsOpen(false);
  }, [dispatch, navigate]);

  // Filtered abilities
  const filteredAbilities = useMemo(() =>
    abilities.filter(ability =>
      ability.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ability.description && ability.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [abilities, searchQuery]);

  // Export data to CSV
  const handleExport = useCallback(() => {
    const csvContent = [
      ["Day", "Orders", "Revenue", "Users"],
      ...chartData.map(item => [item.day, item.orders, item.revenue, item.users])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [chartData]);

  // Render chart based on type
  const renderChart = useCallback(() => {
    const chartProps = {
      data: chartData,
      children: [
        <CartesianGrid key="grid" strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#f0f0f0"} />,
        <XAxis key="xAxis" dataKey="day" stroke={isDarkMode ? "#ccc" : "#888"} />,
        <YAxis key="yAxisLeft" yAxisId="left" orientation="left" stroke={isDarkMode ? "#ccc" : "#888"} />,
        <YAxis key="yAxisRight" yAxisId="right" orientation="right" stroke={isDarkMode ? "#ccc" : "#888"} />,
        <Tooltip key="tooltip" contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }} />,
        <Legend key="legend" />,
      ],
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...chartProps}>
            {chartProps.children}
            <Bar yAxisId="left" dataKey="orders" name="Buyurtmalar" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="revenue" name="Daromad ($)" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...chartProps}>
            {chartProps.children}
            <Line type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...chartProps}>
            {chartProps.children}
            <Area type="monotone" dataKey="orders" name="Buyurtmalar" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
            <Area type="monotone" dataKey="revenue" name="Daromad ($)" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
          </AreaChart>
        );
      default:
        return null;
    }
  }, [chartType, chartData, isDarkMode]);

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === "dashboard" && (
          <>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Boshqaruv Paneli</h1>
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
              </div>
            </header>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
              {STATS.map((stat, index) => (
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
                      <p className={`text-sm mt-2 flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                        <span className="ml-1">{stat.trend === "up" ? "↑" : "↓"}</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-opacity-20 bg-gray-200 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <ProductCaunt></ProductCaunt>

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

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Orders and Revenue Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Buyurtmalar va Daromad</h3>
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

              {/* Courier Status */}
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

              {/* Payment Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">To'lovlar Holati</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/payments")}
                  >
                    Barchasi <FiCreditCard className="ml-1" />
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentStatusData.map((entry, index) => (
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

              {/* Top Products */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Mahsulotlar</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/products")}
                  >
                    Barchasi <FiTag className="ml-1" />
                  </button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProductsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#f0f0f0"} />
                      <XAxis dataKey="name" stroke={isDarkMode ? "#ccc" : "#888"} />
                      <YAxis stroke={isDarkMode ? "#ccc" : "#888"} />
                      <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#333" : "#fff", borderColor: isDarkMode ? "#444" : "#ccc" }} />
                      <Legend />
                      <Bar dataKey="value" name="Sotilganlar" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Additional Sections */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Order Status */}
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

              {/* Recent Activity */}
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
                    <div
                      key={item}
                      className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
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

              {/* Top Couriers */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Eng Faol Kuryerlar</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/couriers-stats")}
                  >
                    Barchasi <FiTruck className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    { name: "Ali Valiev", orders: 45, rating: 4.8 },
                    { name: "Bobur Mirzaev", orders: 38, rating: 4.7 },
                    { name: "Sardor Karimov", orders: 32, rating: 4.5 },
                    { name: "Nodira Yusupova", orders: 28, rating: 4.6 },
                  ].map((courier, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                        <FiTruck className="text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{courier.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{courier.orders} buyurtma</p>
                      </div>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full flex items-center">
                        <FiStar className="mr-1" /> {courier.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Top Products and Complaints */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Top Products List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Mahsulotlar Ro'yxati</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/products")}
                  >
                    Barchasi <FiTag className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {topProductsData.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mr-3">
                        <FiTag className="text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.value} sotilgan</p>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Complaints */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Mijozlar Shikoyatlari</h3>
                  <button
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                    onClick={() => handleNavigation("/support")}
                  >
                    Barchasi <FiHeadphones className="ml-1" />
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {[
                    { id: 101, issue: "Yetkazib berish kechikti", status: "Kutilmoqda" },
                    { id: 102, issue: "Mahsulot sifatsiz", status: "Hal qilindi" },
                    { id: 103, issue: "To'lov muammosi", status: "Jarayonda" },
                    { id: 104, issue: "Buyurtma bekor qilindi", status: "Kutilmoqda" },
                  ].map((complaint, index) => (
                    <div
                      key={index}
                      className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-3">
                        <FiHeadphones className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Shikoyat #{complaint.id}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.issue}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          complaint.status === "Hal qilindi"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : complaint.status === "Jarayonda"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminHomePage;