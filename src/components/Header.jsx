import React from 'react';
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../redax/searchSlice';

const Header = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.search.query);

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Admin Panelga Xush Kelibsiz</h1>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Qidiruv..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
