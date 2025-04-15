import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiTruck, FiClock, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function CouriersTrackPage() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [couriers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      status: 'in-transit', 
      location: 'New York', 
      lastUpdate: '2023-10-05 14:30', 
      coordinates: [40.7128, -74.0060],
      vehicle: 'Motorcycle',
      deliveryProgress: 65
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      status: 'delivered', 
      location: 'Los Angeles', 
      lastUpdate: '2023-10-05 12:45',
      coordinates: [34.0522, -118.2437],
      vehicle: 'Van',
      deliveryProgress: 100
    },
    // ... other couriers
  ]);

  const statusStyles = {
    'in-transit': { color: 'bg-yellow-100 text-yellow-800', icon: <FiTruck /> },
    delivered: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
    pending: { color: 'bg-red-100 text-red-800', icon: <FiClock /> }
  };

  // Filtering and sorting logic
  const filteredCouriers = couriers
    .filter(courier => 
      courier.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedStatus === 'all' || courier.status === selectedStatus)
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCouriers = filteredCouriers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusLabel = (status) => {
    const labels = {
      'in-transit': 'In Transit',
      delivered: 'Delivered',
      pending: 'Pending'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Real-Time Courier Tracking</h1>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Total Couriers: {couriers.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                In Transit: {couriers.filter(c => c.status === 'in-transit').length}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                Delivered: {couriers.filter(c => c.status === 'delivered').length}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search couriers..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Courier List</h2>
              <div className="flex items-center gap-3">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortConfig.key === 'name' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCouriers.map(courier => (
                    <tr key={courier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{courier.name}</div>
                        <div className="text-sm text-gray-500">{courier.vehicle}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-sm ${statusStyles[courier.status].color}`}>
                            {statusStyles[courier.status].icon}
                            {getStatusLabel(courier.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400" />
                          {courier.location}
                        </div>
                        <div className="text-sm text-gray-500">{courier.lastUpdate}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${courier.deliveryProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {courier.deliveryProgress}% Complete
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 h-96">
            <MapContainer 
              center={[37.0902, -95.7129]} 
              zoom={4} 
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {couriers.map(courier => (
                <Marker key={courier.id} position={courier.coordinates}>
                  <Popup>
                    <div className="font-medium">{courier.name}</div>
                    <div className="text-sm">{courier.location}</div>
                    <div className={`text-sm ${statusStyles[courier.status].color}`}>
                      {getStatusLabel(courier.status)}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouriersTrackPage;