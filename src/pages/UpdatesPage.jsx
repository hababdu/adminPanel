import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';

function UpdatesPage() {
  const [updates, setUpdates] = useState([
    { 
      id: 1, 
      title: 'New Feature Released', 
      description: 'We have launched the new dashboard interface with improved analytics.', 
      date: '2023-05-15',
      type: 'feature'
    },
    { 
      id: 2, 
      title: 'Scheduled Maintenance', 
      description: 'There will be a system maintenance on June 1st from 2:00 AM to 4:00 AM UTC.', 
      date: '2023-05-10',
      type: 'maintenance'
    },
    { 
      id: 3, 
      title: 'Bug Fixes', 
      description: 'Fixed several issues reported by users in the settings module.', 
      date: '2023-05-05',
      type: 'fix'
    },
  ]);

  const [newUpdate, setNewUpdate] = useState({
    title: '',
    description: '',
    type: 'announcement'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAddUpdate = () => {
    if (newUpdate.title.trim() === '') return;
    
    const updateToAdd = {
      id: updates.length > 0 ? Math.max(...updates.map(u => u.id)) + 1 : 1,
      ...newUpdate,
      date: new Date().toISOString().split('T')[0]
    };
    
    setUpdates([updateToAdd, ...updates]);
    setNewUpdate({ title: '', description: '', type: 'announcement' });
    setIsAdding(false);
  };

  const handleDeleteUpdate = (id) => {
    setUpdates(updates.filter(update => update.id !== id));
  };

  const handleEditUpdate = (update) => {
    setEditingId(update.id);
    setNewUpdate({
      title: update.title,
      description: update.description,
      type: update.type
    });
  };

  const handleSaveEdit = () => {
    setUpdates(updates.map(update => 
      update.id === editingId 
        ? { ...update, ...newUpdate } 
        : update
    ));
    setEditingId(null);
    setNewUpdate({ title: '', description: '', type: 'announcement' });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'feature': return <FiCheckCircle className="text-green-500" />;
      case 'maintenance': return <FiClock className="text-yellow-500" />;
      case 'fix': return <FiAlertCircle className="text-red-500" />;
      default: return <FiAlertCircle className="text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'feature': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'fix': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Updates & Announcements</h1>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiPlus /> Add Update
            </button>
          )}
        </div>

        {(isAdding || editingId) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Update' : 'Add New Update'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Update title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newUpdate.description}
                  onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Update description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newUpdate.type}
                  onChange={(e) => setNewUpdate({...newUpdate, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="announcement">Announcement</option>
                  <option value="feature">New Feature</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="fix">Bug Fix</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setNewUpdate({ title: '', description: '', type: 'announcement' });
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleSaveEdit : handleAddUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Save Changes' : 'Add Update'}
                </button>
              </div>
            </div>
          </div>
        )}

        {updates.length > 0 ? (
          <div className="space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getTypeIcon(update.type)}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {update.title}
                      </h2>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(update.type)}`}>
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </span>
                  </div>
                  <div className="mt-3 text-gray-600">
                    {update.description}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(update.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUpdate(update)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiAlertCircle className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No updates available</h3>
            <p className="text-gray-500">Add your first update to keep users informed</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiPlus /> Add Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdatesPage;