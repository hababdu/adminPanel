import React, { useState } from 'react';

function ReportsPage() {
  const [reports, setReports] = useState([
    { id: 1, title: 'Sales Report', date: '2023-10-01' },
    { id: 2, title: 'Inventory Report', date: '2023-10-05' },
    { id: 3, title: 'Customer Report', date: '2023-10-10' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtr va tartiblash
  const filteredReports = reports
    .filter(report => 
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date) - new Date(b.date);
      }
      return new Date(b.date) - new Date(a.date);
    });

  // O'chirishni tasdiqlash
  const handleDelete = (id) => {
    setReports(reports.filter(report => report.id !== id));
    setIsModalOpen(false);
  };

  // Modal komponenti
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Delete Report?</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this report? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleDelete(selectedReport)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Reports Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search reports..."
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="asc">Oldest First</option>
              <option value="desc">Newest First</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {filteredReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Title</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium text-gray-800">{report.title}</td>
                      <td className="p-3 text-gray-600">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedReport(report.id);
                            setIsModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              No reports found
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <ConfirmationModal />}
    </div>
  );
}

export default ReportsPage;