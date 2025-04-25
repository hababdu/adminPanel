import React, { useState, useEffect } from 'react';

function SettingsPage() {
  // LocalStorage dan boshlang'ich qiymatlarni olish
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' ? true : false;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved === 'true' ? true : false;
  });

  // Dark mode effekti butun sahifaga
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Notification sozlamalarini saqlash
  useEffect(() => {
    localStorage.setItem('notifications', notifications);
    if (notifications && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          setNotifications(false);
        }
      });
    }
  }, [notifications]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Sozlamalar</h1>
        
        <div className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Tungi rejim</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Qulay o'qish uchun qorong'u muhit</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Bildirishnomalar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {!Notification.permission === 'granted' && notifications && 
                  "Ruxsat berilmagan - iltimos brauzer sozlamalarini tekshiring"}
              </p>
            </div>
            <button
              onClick={toggleNotifications}
              disabled={!Notification.permission === 'granted' && notifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                ${notifications ? 'bg-blue-500' : 'bg-gray-300'}
                ${!Notification.permission === 'granted' && notifications ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 MyApp. Barcha huquqlar himoyalangan</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;