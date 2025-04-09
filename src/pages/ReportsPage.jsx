import React, { useState } from 'react';

function ReportsPage() {
  const [reports, setReports] = useState([
    { id: 1, title: 'Sales Report', date: '2023-10-01' },
    { id: 2, title: 'Inventory Report', date: '2023-10-05' },
    { id: 3, title: 'Customer Report', date: '2023-10-10' },
  ]);

  const handleDelete = (id) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        {reports.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">#</th>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-100">
                  <td className="border p-2">{report.id}</td>
                  <td className="border p-2">{report.title}</td>
                  <td className="border p-2">{report.date}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No reports available.</p>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;