import React, { useState } from 'react';
import { FiSearch, FiFilter, FiAlertCircle, FiTruck, FiCheckCircle, FiEdit, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OrderStatusPage() {
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      status: 'pending', 
      customer: 'John Doe', 
      total: 50.00,
      date: '2023-10-01',
      items: 2,
      payment: 'Credit Card',
      tracking: 'UPS-123456'
    },
    { 
      id: 2, 
      status: 'shipped', 
      customer: 'Jane Smith', 
      total: 75.00,
      date: '2023-10-02',
      items: 3,
      payment: 'PayPal',
      tracking: 'DHL-789012'
    },
    { 
      id: 3, 
      status: 'delivered', 
      customer: 'Alice Johnson', 
      total: 120.00,
      date: '2023-10-03',
      items: 5,
      payment: 'Stripe',
      tracking: 'FEDEX-345678'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = {
    pending: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle /> },
    shipped: { label: 'Yuborilgan', color: 'bg-blue-100 text-blue-800', icon: <FiTruck /> },
    delivered: { label: 'Yetkazilgan', color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
    cancelled: { label: 'Bekor qilingan', color: 'bg-red-100 text-red-800', icon: <FiTrash2 /> }
  };

  // Filtrlash va saralash
  const filteredOrders = orders
    .filter(order => 
      (order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tracking.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(order => selectedStatus === 'all' || order.status === selectedStatus)
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Paginatsiya
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const updateStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    toast.success(`Buyurtma holati yangilandi!`);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Buyurtma Holatlari</h1>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Jami: {orders.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Yetkazilgan: {orders.filter(o => o.status === 'delivered').length}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Qidiruv..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Barchasi</option>
              {Object.entries(statusOptions).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Buyurtma ID
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center gap-2">
                      Mijoz
                      {sortConfig.key === 'customer' && (
                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    To'lov usuli
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Sana
                      {sortConfig.key === 'date' && (
                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Holati</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.tracking}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.items} mahsulot</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.payment}</td>
                    <td className="px-6 py-4">
                      {format(new Date(order.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          className={`px-3 py-1 rounded-lg text-sm ${statusOptions[order.status].color}`}
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          {Object.entries(statusOptions).map(([key, { label }]) => (
                            <option key={key} value={key} className={statusOptions[key].color}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                          <FiEdit />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginatsiya */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Oldingi
              </button>
              <span className="text-sm text-gray-600">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderStatusPage;