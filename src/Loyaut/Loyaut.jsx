import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../redax/adminAbilitiesSlice';
import { useNavigate } from 'react-router-dom'; 
import {
  FiShoppingCart, FiList, FiUsers, FiBarChart2, FiSettings,
  FiTag, FiUserPlus, FiLock, FiTruck, FiMapPin, FiPieChart,
  FiClipboard, FiRefreshCw, FiXCircle, FiDownload, FiDollarSign,
  FiImage, FiBookOpen, FiMail, FiUploadCloud, FiActivity,
  FiHeadphones, FiHelpCircle, FiLogOut, FiUser, FiDatabase,
  FiPackage, FiHome, FiLayers, FiShield, FiCreditCard
} from "react-icons/fi";
import Header from '../components/Header';

const AdminLayout = ({ children }) => {
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const iconComponents = {
    FiShoppingCart, FiList, FiUsers, FiBarChart2, FiSettings,
    FiTag, FiUserPlus, FiLock, FiTruck, FiMapPin, FiPieChart,
    FiClipboard, FiRefreshCw, FiXCircle, FiDownload, FiDollarSign,
    FiImage, FiBookOpen, FiMail, FiUploadCloud, FiActivity,
    FiHeadphones, FiHelpCircle, FiDatabase, FiPackage, FiHome,
    FiLayers, FiShield, FiCreditCard
  };

  // Group abilities by category for better organization
  const groupedAbilities = abilities.reduce((acc, ability) => {
    const category = ability.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ability);
    return acc;
  }, {});

  // Define category colors and icons
  const categoryStyles = {
    Sales: { color: 'bg-blue-100 text-blue-800', icon: <FiDollarSign /> },
    Products: { color: 'bg-green-100 text-green-800', icon: <FiPackage /> },
    Users: { color: 'bg-purple-100 text-purple-800', icon: <FiUsers /> },
    Orders: { color: 'bg-yellow-100 text-yellow-800', icon: <FiShoppingCart /> },
    Settings: { color: 'bg-gray-100 text-gray-800', icon: <FiSettings /> },
    Other: { color: 'bg-indigo-100 text-indigo-800', icon: <FiLayers /> }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-4 sidebar h-screen overflow-y-auto">
        <div className="flex items-center space-x-2 p-4 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <FiUser size={18} />
          </div>
          <span className="font-semibold">Admin Panel</span>
        </div>

        <nav className="space-y-6">
          {/* Dashboard */}
          <div>
            <button 
              onClick={() => {
                dispatch(setActiveTab("dashboard"));
                navigate("/"); 
              }}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                activeTab === "dashboard" ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <FiHome className="flex-shrink-0" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Grouped Sections */}
          {Object.entries(groupedAbilities).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <div className={`px-3 py-2 rounded-md ${categoryStyles[category]?.color || categoryStyles.Other.color} flex items-center space-x-2 text-xs font-semibold uppercase`}>
                {categoryStyles[category]?.icon || categoryStyles.Other.icon}
                <span>{category}</span>
              </div>
              
              <ul className="space-y-1 pl-2">
                {items.map((ability, index) => {
                  const IconComponent = iconComponents[ability.icon];
                  return (
                    <li key={`ability-${index}`}>
                      <button 
                        onClick={() => {
                          dispatch(setActiveTab(ability.path));
                          navigate(ability.path);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                          activeTab === ability.path ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                        }`}
                      >
                        {IconComponent && <IconComponent className="flex-shrink-0" size={18} />}
                        <span className="text-sm">{ability.title}</span>
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
          <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-800 flex items-center space-x-2 text-xs font-semibold uppercase mb-2">
            <FiSettings size={14} />
            <span>System</span>
          </div>
          <button className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 hover:bg-indigo-700 text-sm">
            <FiHelpCircle size={18} />
            <span>Help & Support</span>
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 hover:bg-indigo-700 text-sm">
            <FiLogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex sidebar h-screen overflow-y-auto flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50 mt-16 md:mt-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;