import React, { useState } from 'react';
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      status: 'active',
      joined: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      role: 'Editor',
      status: 'active',
      joined: '2023-02-20'
    },
    { 
      id: 3, 
      name: 'Alice Johnson', 
      email: 'alice@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Viewer',
      status: 'inactive',
      joined: '2023-03-10'
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Viewer',
    status: 'active'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    
    const userToAdd = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...newUser,
      joined: new Date().toISOString().split('T')[0]
    };
    
    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', phone: '', role: 'Viewer', status: 'active' });
    setIsAdding(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEditUser = (user) => {
    setEditingId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
  };

  const handleSaveEdit = () => {
    setUsers(users.map(user => 
      user.id === editingId 
        ? { ...user, ...newUser } 
        : user
    ));
    setEditingId(null);
    setNewUser({ name: '', email: '', phone: '', role: 'Viewer', status: 'active' });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600">Manage your system users and permissions</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiUserPlus /> Add User
          </button>
        </div>

        {(isAdding || editingId) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit User' : 'Add New User'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewUser({ name: '', email: '', phone: '', role: 'Viewer', status: 'active' });
                }}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleSaveEdit : handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <FiUser className="inline" /> Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      <FiMail className="inline" /> Email
                      {sortConfig.key === 'email' && (
                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiPhone className="inline" /> Phone
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('role')}
                  >
                    Role
                    {sortConfig.key === 'role' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.length > 0 ? (
                  sortedUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FiUser />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              Joined {new Date(user.joined).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(user.status)}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No users found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;