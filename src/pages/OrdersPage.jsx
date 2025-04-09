import React from 'react';

function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">#001</td>
              <td className="border border-gray-300 px-4 py-2">John Doe</td>
              <td className="border border-gray-300 px-4 py-2">2023-10-01</td>
              <td className="border border-gray-300 px-4 py-2">$100.00</td>
              <td className="border border-gray-300 px-4 py-2 text-green-600">Completed</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">#002</td>
              <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
              <td className="border border-gray-300 px-4 py-2">2023-10-02</td>
              <td className="border border-gray-300 px-4 py-2">$250.00</td>
              <td className="border border-gray-300 px-4 py-2 text-yellow-600">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersPage;