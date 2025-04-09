import React, { useState } from 'react';

function CouriersTrackPage() {
  const [search, setSearch] = useState('');
  const [couriers, setCouriers] = useState([
    { id: 1, name: 'Courier 1', status: 'In Transit', location: 'New York' },
    { id: 2, name: 'Courier 2', status: 'Delivered', location: 'Los Angeles' },
    { id: 3, name: 'Courier 3', status: 'Pending', location: 'Chicago' },
    { id: 4, name: 'Courier 4', status: 'In Transit', location: 'Houston' },
    { id: 5, name: 'Courier 5', status: 'Delivered', location: 'Phoenix' },
    { id: 6, name: 'Courier 6', status: 'Pending', location: 'Philadelphia' },
    { id: 7, name: 'Courier 7', status: 'In Transit', location: 'San Antonio' },
    { id: 8, name: 'Courier 8', status: 'Delivered', location: 'San Diego' },
    { id: 9, name: 'Courier 9', status: 'Pending', location: 'Dallas' },
    { id: 10, name: 'Courier 10', status: 'In Transit', location: 'San Jose' },
  ]);

  const filteredCouriers = couriers.filter((courier) =>
    courier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Couriers Tracking</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search couriers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredCouriers.length > 0 ? (
              filteredCouriers.map((courier) => (
                <tr key={courier.id} className="border-t">
                  <td className="py-2 px-4">{courier.id}</td>
                  <td className="py-2 px-4">{courier.name}</td>
                  <td className="py-2 px-4">{courier.status}</td>
                  <td className="py-2 px-4">{courier.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-4 px-4 text-center text-gray-500"
                >
                  No couriers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouriersTrackPage;