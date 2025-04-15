import React, { useState } from 'react';
import { FiSearch, FiArrowUp, FiArrowDown, FiStar, FiBarChart2, FiList } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function CouriersStatsPage() {
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'John Doe', deliveries: 25, rating: 4.5, completed: 23, late: 2 },
    { id: 2, name: 'Jane Smith', deliveries: 30, rating: 4.8, completed: 29, late: 1 },
    { id: 3, name: 'Mike Johnson', deliveries: 20, rating: 4.2, completed: 18, late: 2 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'deliveries', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState('table');
  const [chartType, setChartType] = useState('bar');

  // Sorting functionality
  const sortedCouriers = [...couriers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Search and filter
  const filteredCouriers = sortedCouriers.filter(courier =>
    courier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCouriers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (deliveries) => {
    if (deliveries >= 30) return 'bg-green-100 text-green-800';
    if (deliveries >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const totalDeliveries = couriers.reduce((sum, courier) => sum + courier.deliveries, 0);
  const averageRating = (couriers.reduce((sum, courier) => sum + courier.rating, 0) / couriers.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Courier Performance Analytics</h1>
            <div className="flex gap-4 mt-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Total Couriers: {couriers.length}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Total Deliveries: {totalDeliveries}
              </div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Avg Rating: {averageRating}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search couriers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="table">Table View</option>
              <option value="chart">Chart View</option>
            </select>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('deliveries')}
                    >
                      <div className="flex items-center gap-1">
                        Deliveries
                        {sortConfig.key === 'deliveries' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Success Rate
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase cursor-pointer"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-1">
                        Rating
                        {sortConfig.key === 'rating' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.map(courier => (
                    <tr key={courier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{courier.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{courier.deliveries}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-green-600">{courier.completed} completed</span>
                          <span className="text-red-600">{courier.late} late</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(courier.completed / courier.deliveries) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-400" />
                          {courier.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(courier.deliveries)}`}>
                          {courier.deliveries >= 30 ? 'Top Performer' : 
                           courier.deliveries >= 20 ? 'On Track' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredCouriers.length)}</span> of{' '}
                      <span className="font-medium">{filteredCouriers.length}</span> results
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 rounded-lg ${
                  chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FiBarChart2 className="inline mr-2" />
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 rounded-lg ${
                  chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <FiList className="inline mr-2" />
                Trend Line
              </button>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={couriers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deliveries" fill="#3B82F6" name="Total Deliveries" />
                    <Bar dataKey="completed" fill="#10B981" name="Completed Deliveries" />
                  </BarChart>
                ) : (
                  <LineChart data={couriers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#F59E0B" 
                      name="Rating"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="deliveries" 
                      stroke="#3B82F6" 
                      name="Deliveries"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouriersStatsPage;