import React, { useState } from 'react';

function OrderStatusPage() {
  const [orders, setOrders] = useState([
    { id: 1, status: 'Pending', customer: 'John Doe', total: '$50.00' },
    { id: 2, status: 'Shipped', customer: 'Jane Smith', total: '$75.00' },
    { id: 3, status: 'Delivered', customer: 'Alice Johnson', total: '$120.00' },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Order Status</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Order ID</th>
              <th className="border px-4 py-2 text-left">Customer</th>
              <th className="border px-4 py-2 text-left">Total</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.customer}</td>
                <td className="border px-4 py-2">{order.total}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderStatusPage;