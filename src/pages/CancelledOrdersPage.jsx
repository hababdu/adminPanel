import React, { useState, useEffect } from 'react';

function CancelledOrdersPage() {
  const [cancelledOrders, setCancelledOrders] = useState([]);

  useEffect(() => {
    // Simulating fetching cancelled orders from an API
    const fetchCancelledOrders = async () => {
      const data = [
        { id: 1, customer: 'John Doe', date: '2023-10-01', reason: 'Customer request' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
        { id: 2, customer: 'Jane Smith', date: '2023-10-02', reason: 'Payment issue' },
      ];
      setCancelledOrders(data);
    };

    fetchCancelledOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Cancelled Orders</h1>
      {cancelledOrders.length === 0 ? (
        <p className="text-gray-600">No cancelled orders found.</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2 text-gray-700">Order ID</th>
              <th className="text-left px-4 py-2 text-gray-700">Customer</th>
              <th className="text-left px-4 py-2 text-gray-700">Date</th>
              <th className="text-left px-4 py-2 text-gray-700">Reason</th>
            </tr>
          </thead>
          <tbody>
            {cancelledOrders.map((order, index) => (
              <tr
                key={order.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="px-4 py-2 text-gray-800">{order.id}</td>
                <td className="px-4 py-2 text-gray-800">{order.customer}</td>
                <td className="px-4 py-2 text-gray-800">{order.date}</td>
                <td className="px-4 py-2 text-gray-800">{order.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CancelledOrdersPage;