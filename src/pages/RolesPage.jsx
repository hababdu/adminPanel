import React, { useState } from 'react';

function RolesPage() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Viewer' },
  ]);

  const [newRole, setNewRole] = useState('');

  const handleAddRole = () => {
    if (newRole.trim()) {
      setRoles([...roles, { id: roles.length + 1, name: newRole }]);
      setNewRole('');
    }
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Roles Management</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter new role"
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button
          onClick={handleAddRole}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Role
        </button>
      </div>
      <ul className="bg-white shadow rounded p-4">
        {roles.map((role) => (
          <li
            key={role.id}
            className="flex justify-between items-center border-b last:border-b-0 py-2"
          >
            <span>{role.name}</span>
            <button
              onClick={() => handleDeleteRole(role.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RolesPage;