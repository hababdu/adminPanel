import React, { useState } from 'react';

function CouriersPage() {
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'John Doe', status: 'Active' },
    { id: 2, name: 'Jane Smith', status: 'Inactive' },
    { id: 3, name: 'Michael Brown', status: 'Active' },
  ]);

  const toggleStatus = (id) => {
    setCouriers((prevCouriers) =>
      prevCouriers.map((courier) =>
        courier.id === id
          ? { ...courier, status: courier.status === 'Active' ? 'Inactive' : 'Active' }
          : courier
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Couriers</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((courier) => (
              <tr key={courier.id} className="hover:bg-gray-100">
                <td className="border p-2">{courier.id}</td>
                <td className="border p-2">{courier.name}</td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      courier.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {courier.status}
                  </span>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => toggleStatus(courier.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouriersPage;