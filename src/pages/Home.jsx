import React, { useMemo } from "react";
import {
  FiShoppingCart, FiUsers, FiBarChart2, FiLogOut,
  FiBell, FiUser, FiSearch
} from "react-icons/fi";
import * as FiIcons from 'react-icons/fi';
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../redax/adminAbilitiesSlice";
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
  const { abilities, activeTab } = useSelector((state) => state.adminAbilities);
  const searchQuery = useSelector((state) => state.search.query); // 🔁 Reduxdan qidiruv holatini olish
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredAbilities = useMemo(() =>
    abilities.filter(ability =>
      ability.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ability.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [abilities, searchQuery]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-6 bg-gray-50">
        {activeTab === "dashboard" && (
          <>
            <div className="mb-6">
            
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAbilities.map((ability, index) => (
                  <div
                    key={`quick-access-${index}`}
                    className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer border border-transparent hover:border-indigo-200"
                    onClick={() => {
                      dispatch(setActiveTab(ability.path));
                      navigate(ability.path);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700">
                        {FiIcons[ability.icon] && React.createElement(FiIcons[ability.icon])}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold mb-1">{ability.title}</h2>
                        <p className="text-gray-600 text-sm">{ability.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminHomePage;