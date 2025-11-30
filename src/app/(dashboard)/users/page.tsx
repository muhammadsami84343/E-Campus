'use client';

import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Staff' | 'Accountant' | 'Librarian';
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '001',
      name: 'Sarah Johnson',
      email: 'sarah.j@school.com',
      role: 'Admin',
      lastLogin: '2 hours ago',
      status: 'Active',
    },
    {
      id: '002',
      name: 'Michael Chen',
      email: 'm.chen@school.com',
      role: 'Teacher',
      lastLogin: 'Yesterday',
      status: 'Active',
    },
    {
      id: '003',
      name: 'Elena Rodriguez',
      email: 'elena.r@school.com',
      role: 'Staff',
      lastLogin: '5 days ago',
      status: 'Inactive',
    },
    {
      id: '004',
      name: 'David Park',
      email: 'david.p@school.com',
      role: 'Teacher',
      lastLogin: '1 hour ago',
      status: 'Active',
    },
    {
      id: '005',
      name: 'Amanda White',
      email: 'amanda.w@school.com',
      role: 'Accountant',
      lastLogin: '3 hours ago',
      status: 'Active',
    },
    {
      id: '006',
      name: 'James Brown',
      email: 'james.b@school.com',
      role: 'Librarian',
      lastLogin: '2 days ago',
      status: 'Active',
    },
    {
      id: '007',
      name: 'Lisa Martinez',
      email: 'lisa.m@school.com',
      role: 'Teacher',
      lastLogin: '4 hours ago',
      status: 'Active',
    },
    {
      id: '008',
      name: 'Robert Taylor',
      email: 'robert.t@school.com',
      role: 'Staff',
      lastLogin: '1 week ago',
      status: 'Inactive',
    },
    {
      id: '009',
      name: 'Jennifer Lee',
      email: 'jennifer.l@school.com',
      role: 'Admin',
      lastLogin: '30 minutes ago',
      status: 'Active',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Teacher' as User['role'],
    status: 'Active' as User['status'],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-600',
      error: 'bg-rose-600',
      info: 'bg-slate-900',
    };
    toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${colors[type]} animate-fade-in-down`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddUser = () => {
    if (!formData.name || !formData.email) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const newUser: User = {
      id: String(users.length + 1).padStart(3, '0'),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      lastLogin: 'Never',
      status: formData.status,
    };

    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'Teacher', status: 'Active' });
    setShowAddModal(false);
    showToast('User added successfully!');
  };

  const handleEditUser = () => {
    if (!editingUser || !formData.name || !formData.email) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            }
          : user
      )
    );

    setFormData({ name: '', email: '', role: 'Teacher', status: 'Active' });
    setEditingUser(null);
    setShowEditModal(false);
    showToast('User updated successfully!');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      setUsers(users.filter((user) => user.id !== id));
      showToast(`User "${name}" deleted successfully!`);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', role: 'Teacher', status: 'Active' });
    setShowAddModal(true);
  };

  const getRoleBadgeColor = (role: User['role']) => {
    const colors = {
      Admin: 'bg-indigo-100 text-indigo-800',
      Teacher: 'bg-emerald-100 text-emerald-800',
      Staff: 'bg-amber-100 text-amber-800',
      Accountant: 'bg-blue-100 text-blue-800',
      Librarian: 'bg-purple-100 text-purple-800',
    };
    return colors[role] || 'bg-slate-100 text-slate-800';
  };

  const getStatusBadgeColor = (status: User['status']) => {
    return status === 'Active'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-rose-100 text-rose-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      {/* Page Header */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Manage Users</h1>
          <p className="text-sm text-slate-500">View, edit, and manage system users and roles.</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
            </svg>
            Add New User
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRoleFilter('All Roles')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                roleFilter === 'All Roles'
                  ? 'bg-slate-100 border-slate-400'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter('Admin')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                roleFilter === 'Admin'
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRoleFilter('Teacher')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                roleFilter === 'Teacher'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setRoleFilter('Staff')}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                roleFilter === 'Staff'
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              Staff
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900">{user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                        title="Edit User"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
                        title="Delete User"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}{' '}
            results
          </p>
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-slate-200 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold text-slate-900">{user.name}</div>
                <div className="text-sm text-slate-600">{user.email}</div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusBadgeColor(
                  user.status
                )}`}
              >
                {user.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span className="text-slate-500">Role:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Last Login:</span> {user.lastLogin}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => openEditModal(user)}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user.id, user.name)}
                className="text-rose-600 text-sm font-medium hover:text-rose-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Add New User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., john.smith@school.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Librarian">Librarian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as User['status'] })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', email: '', role: 'Teacher', status: 'Active' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold">Edit User</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., john.smith@school.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Librarian">Librarian</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as User['status'] })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setFormData({ name: '', email: '', role: 'Teacher', status: 'Active' });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 mt-8">
        © 2025 eCampus — All rights reserved.
      </footer>
    </div>
  );
}
