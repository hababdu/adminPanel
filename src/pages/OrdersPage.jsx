import React, { useState } from 'react';
import { 
  FiSearch, 
  FiArrowUp, 
  FiArrowDown, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiXCircle 
} from 'react-icons/fi';
import { format } from 'date-fns';

function OrdersPage() {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const orders = [
    {
      id: '#001',
      customer: 'John Doe',
      date: '2023-10-01',
      total: 100.00,
      status: 'completed',
      payment: 'Credit Card',
      items: 2,
      delivery: 'Express'
    },
    {
      id: '#002',
      customer: 'Jane Smith',
      date: '2023-10-02',
      total: 250.00,
      status: 'pending',
      payment: 'PayPal',
      items: 5,
      delivery: 'Standard'
    },
  ];

  const statusStyles = {
    completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle /> },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock /> },
    processing: { color: 'bg-blue-100 text-blue-800', icon: <FiPackage /> },
    cancelled: { color: 'bg-red-100 text-red-800', icon: <FiXCircle /> }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredOrders = sortedOrders
    .filter(order => 
      (order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(order => selectedStatus === 'all' || order.status === selectedStatus);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  // Saralashni o'zgartirish


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Buyurtmalar boshqaruvi</h1>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Jami: {orders.length}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Yakunlangan: {orders.filter(o => o.status === 'completed').length}
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
              <option value="completed">Yakunlangan</option>
              <option value="pending">Kutilmoqda</option>
              <option value="processing">Jarayonda</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-2">
                      Buyurtma ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Mijoz</th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Sana
                      {sortConfig.key === 'date' && (
                        sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center gap-2">
                      Summa
                      {sortConfig.key === 'total' && (
                        sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />
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
                      <div className="font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">{order.payment}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.items} mahsulot</div>
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(order.date), 'dd MMM yyyy')}
                      <div className="text-sm text-gray-500">
                        <FiTruck className="inline mr-1" />
                        {order.delivery}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusStyles[order.status].color}`}>
                        {statusStyles[order.status].icon}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                          <FiEye />
                        </button>
                        <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg">
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
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Oldingi
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Keyingi
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
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

export default OrdersPage;