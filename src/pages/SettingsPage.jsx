import React, { useState } from 'react';

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
          >
            {darkMode ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <button
            onClick={toggleNotifications}
            className={`px-4 py-2 rounded ${notifications ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
          >
            {notifications ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;