'use client';

import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '001',
      name: 'Admin',
      description: 'Full system access',
      permissions: 'Manage all',
    },
    {
      id: '002',
      name: 'Teacher',
      description: 'Classroom management',
      permissions: 'Manage classes, students',
    },
    {
      id: '003',
      name: 'Student',
      description: 'Basic access',
      permissions: 'View classes, assignments',
    },
    {
      id: '004',
      name: 'Accountant',
      description: 'Financial management',
      permissions: 'Manage fees, income, expenses',
    },
    {
      id: '005',
      name: 'Librarian',
      description: 'Library management',
      permissions: 'Manage books, issue/return',
    },
    {
      id: '006',
      name: 'Receptionist',
      description: 'Front desk operations',
      permissions: 'View students, visitors',
    },
    {
      id: '007',
      name: 'Parent',
      description: 'Parent portal access',
      permissions: 'View child records',
    },
    {
      id: '008',
      name: 'Principal',
      description: 'Administrative oversight',
      permissions: 'View all reports, approve',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } animate-fade-in-down`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleAddRole = () => {
    if (!formData.name || !formData.description || !formData.permissions) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const newRole: Role = {
      id: String(roles.length + 1).padStart(3, '0'),
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
    };

    setRoles([...roles, newRole]);
    setFormData({ name: '', description: '', permissions: '' });
    setShowAddModal(false);
    showToast('Role added successfully!');
  };

  const handleEditRole = () => {
    if (!editingRole || !formData.name || !formData.description || !formData.permissions) {
      showToast('Please fill all fields', 'error');
      return;
    }

    setRoles(
      roles.map((role) =>
        role.id === editingRole.id
          ? { ...role, name: formData.name, description: formData.description, permissions: formData.permissions }
          : role
      )
    );

    setFormData({ name: '', description: '', permissions: '' });
    setEditingRole(null);
    setShowEditModal(false);
    showToast('Role updated successfully!');
  };

  const handleDeleteRole = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter((role) => role.id !== id));
      showToast('Role deleted successfully!');
    }
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', description: '', permissions: '' });
    setShowAddModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Roles</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
            Add Role
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow p-5">
        <h3 className="font-semibold mb-4">Role List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Role Name</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Permissions</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 font-medium">{role.id}</td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{role.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{role.description}</td>
                  <td className="py-3 pr-4 text-slate-600">{role.permissions}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(role)}
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="font-semibold mb-4">Role List</h3>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border border-slate-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-slate-900 text-base">{role.name}</span>
                    <span className="text-xs text-slate-400 ml-2">#{role.id}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-600 mb-1">{role.description}</div>
                <div className="text-sm text-slate-500 mb-3">
                  <span className="font-medium">Permissions:</span> {role.permissions}
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(role)}
                    className="text-blue-500 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Add New Role</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Vice Principal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Assists principal with administration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., View all reports, manage staff"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', description: '', permissions: '' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && editingRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Edit Role</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Vice Principal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Assists principal with administration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., View all reports, manage staff"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingRole(null);
                  setFormData({ name: '', description: '', permissions: '' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 mt-6">
        © 2025 eCampus — All rights reserved.
      </footer>
    </div>
  );
}
