import React, { useState } from 'react';

function StatisticsPage() {
  const [data, setData] = useState([
    { id: 1, name: 'Sales', value: 1200 },
    { id: 2, name: 'Users', value: 300 },
    { id: 3, name: 'Revenue', value: 4500 },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((stat) => (
          <div
            key={stat.id}
            className="bg-white shadow-md rounded-lg p-4 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-700">{stat.name}</h2>
            <p className="text-2xl font-bold text-blue-500">{stat.value}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          setData((prevData) =>
            prevData.map((item) => ({
              ...item,
              value: item.value + Math.floor(Math.random() * 100),
            }))
          )
        }
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Update Statistics
      </button>
    </div>
  );
}

export default StatisticsPage;