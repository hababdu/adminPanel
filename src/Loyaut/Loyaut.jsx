import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../redax/adminAbilitiesSlice';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingCart, FiList, FiUsers, FiBarChart2, FiSettings,
  FiTag, FiUserPlus, FiLock, FiTruck, FiMapPin, FiPieChart,
  FiClipboard, FiRefreshCw, FiXCircle, FiDownload, FiDollarSign,
  FiImage, FiBookOpen, FiMail, FiUploadCloud, FiActivity,
  FiHeadphones, FiHelpCircle, FiLogOut, FiUser, FiDatabase,
  FiPackage, FiHome, FiLayers, FiShield, FiCreditCard, FiMenu, FiMoon, FiSun
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const iconComponents = {
    FiShoppingCart, FiList, FiUsers, FiBarChart2, FiSettings,
    FiTag, FiUserPlus, FiLock, FiTruck, FiMapPin, FiPieChart,
    FiClipboard, FiRefreshCw, FiXCircle, FiDownload, FiDollarSign,
    FiImage, FiBookOpen, FiMail, FiUploadCloud, FiActivity,
    FiHeadphones, FiHelpCircle, FiDatabase, FiPackage, FiHome,
    FiLayers, FiShield, FiCreditCard
  };

  // Group abilities by category
  const groupedAbilities = abilities.reduce((acc, ability) => {
    const category = ability.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(ability);
    return acc;
  }, {});

  // Category styles
  const categoryStyles = {
    Sales: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <FiDollarSign /> },
    Products: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <FiPackage /> },
    Users: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: <FiUsers /> },
    Orders: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: <FiShoppingCart /> },
    Settings: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: <FiSettings /> },
    Other: { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', icon: <FiLayers /> }
  };

  return (
    <div className={`min-h-screen dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900 flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 dark:bg-gray-800 darc:text-white  bg-gray-50 text-gray-900 p-4 h-screen overflow-y-auto transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 shadow-lg z-50`}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center space-x-3 p-4 mb-6">
          <div className="w-10 h-10 bg-gray-200   rounded-full flex items-center justify-center shadow-md">
            <FiUser size={20} />
          </div>
          <span className="text-lg dark:text-white text-black  font-bold tracking-tight">Admin Panel</span>
        </div>

       

        {/* Navigation */}
        <nav className="space-y-6">
          {/* Dashboard */}
          <div>
            <button
              onClick={() => {
                dispatch(setActiveTab('dashboard'));
                navigate('/');
                setIsSidebarOpen(false); // Close sidebar on mobile
              }}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? ` dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900  border-l-4 border-indigo-600 shadow-lg`
                  : `hover: dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900 `
              }`}
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            >
              <FiHome className="flex-shrink-0 group-hover:scale-110 transition-transform duration-150" size={18} />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Grouped Sections */}
          {Object.entries(groupedAbilities).map(([category, items]) => (
            <div key={category} className="space-y-2">
              {/* Category Header */}
              <div className={`flex items-center text-xs font-semibold  dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900  uppercase tracking-wider px-3 py-2 rounded-md ${categoryStyles[category]?.color || categoryStyles.Other.color}`}>
                {categoryStyles[category]?.icon || categoryStyles.Other.icon}
                <span className="ml-2">{category}</span>
              </div>

              {/* Abilities */}
              <ul className="space-y-1 pl-2">
                {items.map((ability, index) => {
                  const IconComponent = iconComponents[ability.icon];
                  return (
                    <li key={`ability-${index}`}>
                      <button
                        onClick={() => {
                          dispatch(setActiveTab(ability.path));
                          navigate(ability.path);
                          setIsSidebarOpen(false); // Close sidebar on mobile
                        }}
                        className={`group w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          activeTab === ability.path
                            ? ` dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900  border-l-4 border-indigo-600 shadow-lg`
                            : `hover: dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900 `
                        }`}
                        aria-current={activeTab === ability.path ? 'page' : undefined}
                      >
                        {IconComponent && <IconComponent className="flex-shrink-0 group-hover:scale-110 transition-transform duration-150" size={18} />}
                        <span>{ability.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* System Section */}
        <div className="mt-8 pt-4 border-t border-indigo-700">
          <div className={`px-3 py-2 rounded-md  dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900  flex items-center space-x-2 text-xs font-semibold uppercase mb-2`}>
            <FiSettings size={14} />
            <span>System</span>
          </div>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xltext-sm  dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900 transition-colors`}
            aria-label="Help and Support"
          >
            <FiHelpCircle size={18} />
            <span>Help & Support</span>
          </button>
          <button
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl  text-sm dark:bg-gray-800 dark:text-white  bg-gray-50 text-gray-900 transition-colors`}
            aria-label="Log out"
          >
            <FiLogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-indigo-800 dark:text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <FiMenu size={24} />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1  mt-16 md:mt-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;