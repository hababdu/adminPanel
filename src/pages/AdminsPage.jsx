import React, { useState, useEffect } from 'react';

function AdminsPage() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Simulating fetching admin data
    const fetchAdmins = async () => {
      const data = [
        { id: 1, name: 'Admin One', email: 'admin1@example.com' },
        { id: 2, name: 'Admin Two', email: 'admin2@example.com' },
        { id: 3, name: 'Admin Three', email: 'admin3@example.com' },
      ];
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
      setAdmins(sortedData);
    };

    fetchAdmins();
  }, []);

  const addAdmin = (newAdmin) => {
    setAdmins((prevAdmins) => {
      const updatedAdmins = [...prevAdmins, newAdmin];
      return updatedAdmins.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  // Example usage of addAdmin
  useEffect(() => {
    addAdmin({ id: 4, name: 'Admin Four', email: 'admin4@example.com' });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Admins Page</h1>
      <ul className="space-y-4">
        {admins.map((admin) => (
          <li
            key={admin.id}
            className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
          >
            <span className="font-semibold text-lg">{admin.name}</span>
            <span className="text-gray-600">{admin.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminsPage;