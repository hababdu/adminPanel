import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ name: '', amount: '', status: 'Pending' });
  
  const itemsPerPage = 5;
  const statusOptions = ['Paid', 'Pending', 'Failed'];

  // Mock API call
  useEffect(() => {
    setTimeout(() => {
      setPayments([
        { id: 1, name: 'John Doe', amount: 100, status: 'Paid' },
        { id: 2, name: 'Jane Smith', amount: 200, status: 'Pending' },
        { id: 3, name: 'Alice Johnson', amount: 150, status: 'Failed' },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (payment) => {
    setEditingId(payment.id);
  };

  const handleDelete = (id) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setPayments(payments.map(payment =>
      payment.id === id ? { ...payment, status: newStatus } : payment
    ));
  };

  const sortedAndFilteredData = React.useMemo(() => {
    let filtered = payments.filter(payment =>
      payment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [payments, searchTerm, sortConfig]);

  const paginatedData = sortedAndFilteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Payment Management</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search payments..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              New Payment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['ID', 'Name', 'Amount', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => header === 'ID' && handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? (
                          <ArrowUpIcon className="h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === payment.id ? (
                      <input
                        type="text"
                        value={payment.name}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      payment.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={payment.status}
                      onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {paginatedData.length} of {sortedAndFilteredData.length} results
            </div>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i+1}
                  onClick={() => setCurrentPage(i+1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i+1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i+1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Payment</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-4 px-3 py-2 border rounded"
              value={newPayment.name}
              onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full mb-4 px-3 py-2 border rounded"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            />
            <select
              className="w-full mb-6 px-3 py-2 border rounded"
              value={newPayment.status}
              onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPayments([...payments, { ...newPayment, id: payments.length + 1 }]);
                  setIsModalOpen(false);
                  setNewPayment({ name: '', amount: '', status: 'Pending' });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;