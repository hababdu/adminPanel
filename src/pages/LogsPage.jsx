import React, { useState } from 'react';
import { FiSearch, FiAlertCircle, FiInfo, FiAlertTriangle, FiCopy, FiClock, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [darkMode, setDarkMode] = useState(false);

  const logs = [
    { 
      id: 1, 
      message: 'User logged in successfully', 
      timestamp: new Date('2023-10-01 10:00:00'),
      level: 'info',
      source: 'AuthService',
      ip: '192.168.1.1'
    },
    { 
      id: 2, 
      message: 'Failed login attempt', 
      timestamp: new Date('2023-10-01 10:30:00'),
      level: 'warning',
      source: 'AuthService',
      ip: '192.168.1.45'
    },
    { 
      id: 3, 
      message: 'Database connection error', 
      timestamp: new Date('2023-10-01 11:00:00'),
      level: 'error',
      source: 'Database',
      ip: '192.168.1.10'
    },
  ];

  const logLevels = {
    info: { color: 'bg-blue-100 text-blue-800', icon: <FiInfo /> },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertTriangle /> },
    error: { color: 'bg-red-100 text-red-800', icon: <FiAlertCircle /> }
  };

  const filteredLogs = logs
    .filter(log => 
      (log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
       log.source.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedLevel === 'all' || log.level === selectedLevel)
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const copyLogDetails = (log) => {
    const text = `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.message}`;
    navigator.clipboard.writeText(text);
    toast.success('Log details copied to clipboard!');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-6 transition-colors`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              System Logs
            </h1>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'}`}>
                Total Logs: {logs.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-800'}`}>
                Last Updated: {formatDistanceToNow(new Date())} ago
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <FiSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search logs..."
                className={`pl-10 pr-4 py-2 rounded-lg w-full focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500'
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className={`rounded-lg px-3 py-2 focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
                  : 'bg-white border-gray-300 focus:ring-blue-500'
              }`}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        <div className={`rounded-lg shadow-md overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-2">
                    <FiClock />
                    Timestamp
                    {sortConfig.key === 'timestamp' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium cursor-pointer"
                  onClick={() => handleSort('level')}
                >
                  Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium">Source</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Message</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentLogs.map(log => (
                <tr 
                  key={log.id} 
                  className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {log.timestamp.toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(log.timestamp)} ago
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      logLevels[log.level].color
                    }`}>
                      {logLevels[log.level].icon}
                      {log.level.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">{log.source}</div>
                    <div className="text-xs text-gray-500">{log.ip}</div>
                  </td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {log.message}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => copyLogDetails(log)}
                      className={`p-2 rounded-lg hover:bg-opacity-20 ${
                        darkMode 
                          ? 'text-gray-400 hover:bg-gray-600' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Copy log details"
                    >
                      <FiCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`mt-6 flex justify-between items-center p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              Previous
            </button>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogsPage;