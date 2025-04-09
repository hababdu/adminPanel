import React, { useState } from 'react';

function LogsPage() {
  const [logs, setLogs] = useState([
    { id: 1, message: 'User logged in', timestamp: '2023-10-01 10:00:00' },
    { id: 2, message: 'User updated profile', timestamp: '2023-10-01 10:30:00' },
    { id: 3, message: 'User logged out', timestamp: '2023-10-01 11:00:00' },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Logs</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Message</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-700">{log.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{log.message}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsPage;