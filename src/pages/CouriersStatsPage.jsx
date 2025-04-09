import React, { useState } from 'react';

function CouriersStatsPage() {
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'John Doe', deliveries: 25, rating: 4.5 },
    { id: 2, name: 'Jane Smith', deliveries: 30, rating: 4.8 },
    { id: 3, name: 'Mike Johnson', deliveries: 20, rating: 4.2 },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Couriers Statistics</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-center">Deliveries</th>
              <th className="py-3 px-6 text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {couriers.map((courier) => (
              <tr
                key={courier.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{courier.name}</td>
                <td className="py-3 px-6 text-center">{courier.deliveries}</td>
                <td className="py-3 px-6 text-center">{courier.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouriersStatsPage;