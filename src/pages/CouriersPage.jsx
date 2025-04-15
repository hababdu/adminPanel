import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiArrowUp, FiArrowDown, FiUser } from 'react-icons/fi';
import Swal from 'sweetalert2';

function CouriersPage() {
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'John Doe', status: 'Active', vehicle: 'Motorcycle', phone: '+1 555-1234' },
    { id: 2, name: 'Jane Smith', status: 'Inactive', vehicle: 'Car', phone: '+1 555-5678' },
    { id: 3, name: 'Michael Brown', status: 'Active', vehicle: 'Bicycle', phone: '+1 555-9012' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourier, setEditingCourier] = useState(null);
  const [newCourier, setNewCourier] = useState({ name: '', phone: '', vehicle: '' });
  const itemsPerPage = 5;

  // Sorting functionality
  const sortedCouriers = [...couriers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Search and filter
  const filteredCouriers = sortedCouriers.filter(courier =>
    Object.values(courier).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCouriers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);

  const toggleStatus = (id) => {
    setCouriers(prev => prev.map(courier =>
      courier.id === id ? { ...courier, status: courier.status === 'Active' ? 'Inactive' : 'Active' } : courier
    ));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete Courier?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        setCouriers(prev => prev.filter(courier => courier.id !== id));
        Swal.fire('Deleted!', 'Courier has been removed.', 'success');
      }
    });
  };

  const handleEdit = (courier) => {
    setEditingCourier(courier);
    setNewCourier(courier);
  };

  const handleAddEditSubmit = (e) => {
    e.preventDefault();
    if (!newCourier.name || !newCourier.phone || !newCourier.vehicle) {
      Swal.fire('Error', 'All fields are required!', 'error');
      return;
    }

    if (editingCourier) {
      setCouriers(prev => prev.map(c => c.id === editingCourier.id ? newCourier : c));
      Swal.fire('Updated!', 'Courier details updated.', 'success');
    } else {
      const newId = Math.max(...couriers.map(c => c.id)) + 1;
      setCouriers(prev => [...prev, { ...newCourier, id: newId, status: 'Active' }]);
      Swal.fire('Added!', 'New courier added.', 'success');
    }
    setEditingCourier(null);
    setNewCourier({ name: '', phone: '', vehicle: '' });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Courier Management</h1>
            <p className="text-gray-600">
              {filteredCouriers.length} couriers found
            </p>
          </div>
          
          <div className="w-full md:w-96 mt-4 md:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search couriers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleAddEditSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newCourier.name}
                  onChange={(e) => setNewCourier({ ...newCourier, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newCourier.phone}
                  onChange={(e) => setNewCourier({ ...newCourier, phone: e.target.value })}
                />
                <select
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={newCourier.vehicle}
                  onChange={(e) => setNewCourier({ ...newCourier, vehicle: e.target.value })}
                >
                  <option value="">Select Vehicle</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="text-lg" />
                {editingCourier ? 'Update Courier' : 'Add Courier'}
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                      )}
                    </div>
                  </th>
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
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map(courier => (
                  <tr key={courier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{courier.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        {courier.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {courier.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {courier.vehicle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          courier.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {courier.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(courier)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => toggleStatus(courier.id)}
                          className={`text-gray-600 hover:text-gray-800 transition-colors ${
                            courier.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : ''
                          }`}
                        >
                          {courier.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(courier.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500" colSpan="6">
                      No couriers found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="ml-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              
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
      </div>
    </div>
  );
}

export default CouriersPage;