import React, { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

function StatisticsPage() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('statsData');
    return savedData ? JSON.parse(savedData) : [
      { id: 1, name: 'Sales', value: 1200, color: '#3B82F6' },
      { id: 2, name: 'Users', value: 300, color: '#10B981' },
      { id: 3, name: 'Revenue', value: 4500, color: '#8B5CF6' },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState(null);

  // LocalStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('statsData', JSON.stringify(data));
    setLastUpdated(new Date().toLocaleTimeString());
  }, [data]);

  const updateStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(prevData =>
        prevData.map(item => ({
          ...item,
          value: item.value + Math.floor(Math.random() * 200) - 50,
        }))
      );
    } catch (err) {
      setError('Failed to update statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Statistics Dashboard
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {data.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {stat.name}
                </h3>
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <div 
                    className="w-5 h-5"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
              
              <p className="text-3xl font-bold mb-4" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </p>
              
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[stat]}>
                    <Bar 
                      dataKey="value" 
                      fill={stat.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={updateStatistics}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Updating...
              </div>
            ) : (
              'Update Statistics'
            )}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Real-time data updates • Secure API connections • Historical trends analysis</p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;