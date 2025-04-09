// layouts/AdminLayout.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../redax/adminAbilitiesSlice';
import { useNavigate } from 'react-router-dom'; 
import {
  FiShoppingCart, FiList, FiUsers, FiBarChart2, FiSettings,
  FiTag, FiUserPlus, FiLock, FiTruck, FiMapPin, FiPieChart,
  FiClipboard, FiRefreshCw, FiXCircle, FiDownload, FiDollarSign,
  FiImage, FiBookOpen, FiMail, FiUploadCloud, FiActivity,
  FiHeadphones, FiHelpCircle, FiLogOut, FiUser
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
    FiHeadphones, FiHelpCircle
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

        <nav>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => {
                  dispatch(setActiveTab("dashboard"));
                  navigate("/"); 
                }}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                  activeTab === "dashboard" ? 'bg-indigo-700' : 'hover:bg-indigo-700'
                }`}
              >
                <FiBarChart2 />
                <span>Dashboard</span>
              </button>
            </li>
            {abilities.map((ability, index) => {
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
                    {IconComponent && <IconComponent size={24} />}
                    <span>{ability.title.replace(/[^\w\s]/g, '').trim()}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-4 border-t border-indigo-700">
          <button className="w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 hover:bg-indigo-700">
            <FiLogOut />
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
