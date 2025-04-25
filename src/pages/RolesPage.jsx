import React, { useState } from 'react';
import { FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

function RolesPage() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Editor' },
    { id: 3, name: 'Viewer' },
  ]);
  const [newRole, setNewRole] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddRole = () => {
    if (!newRole.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Xatolik!',
        text: 'Role nomini kiriting!',
      });
      return;
    }
    
    if (roles.some(role => role.name.toLowerCase() === newRole.toLowerCase())) {
      Swal.fire({
        icon: 'error',
        title: 'Xatolik!',
        text: 'Bu role allaqachon mavjud!',
      });
      return;
    }

    setRoles([...roles, { 
      id: Date.now(), 
      name: newRole.trim() 
    }]);
    setNewRole('');
    Swal.fire({
      icon: 'success',
      title: 'Muvaffaqiyatli!',
      text: 'Yangi role qo\'shildi!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleDeleteRole = (id) => {
    Swal.fire({
      title: 'O\'chirishni tasdiqlang',
      text: "Bu rolni o'chirishni istaysizmi?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ha, o\'chirish!'
    }).then((result) => {
      if (result.isConfirmed) {
        setRoles(roles.filter(role => role.id !== id));
        Swal.fire(
          'O\'chirildi!',
          'Role muvaffaqiyatli o\'chirildi.',
          'success'
        );
      }
    });
  };

  const startEditing = (role) => {
    setEditingRole(role.id);
    setEditValue(role.name);
  };

  const handleEdit = (id) => {
    if (!editValue.trim()) return;
    
    setRoles(roles.map(role => 
      role.id === id ? { ...role, name: editValue.trim() } : role
    ));
    setEditingRole(null);
    Swal.fire({
      icon: 'success',
      title: 'Yangilandi!',
      text: 'Role nomi muvaffaqiyatli o\'zgartirildi!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddRole();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Role Boshqaruvi</h1>
        
        {/* Add Role Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Yangi role nomi..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddRole}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Qo'shish
            </button>
          </div>
        </div>

        {/* Roles List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">Rolelar Ro'yxati</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {roles.map((role) => (
              <div 
                key={role.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                {editingRole === role.id ? (
                  <div className="flex flex-1 items-center gap-3">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(role.id)}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-md"
                      >
                        <FiCheck size={18} />
                      </button>
                      <button
                        onClick={() => setEditingRole(null)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-700">{role.name}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(role)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {roles.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Hech qanday role topilmadi
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolesPage;