'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface StaffFormData {
  firstName: string;
  lastName: string;
  cnic: string;
  gender: string;
  dateOfBirth: string;
  religion: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  role: string;
  department: string;
  joiningDate: string;
  salary: string;
  qualifications: string;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
}

export default function AddStaff() {
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    cnic: '',
    gender: '',
    dateOfBirth: '',
    religion: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    role: '',
    department: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    qualifications: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show toast notification
  const showToast = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle CNIC formatting
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 13) value = value.slice(0, 13);
    
    // Format: XXXXX-XXXXXXX-X
    if (value.length > 5 && value.length <= 12) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    } else if (value.length > 12) {
      value = value.slice(0, 5) + '-' + value.slice(5, 12) + '-' + value.slice(12);
    }
    
    setFormData(prev => ({ ...prev, cnic: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size should not exceed 2MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setPhotoFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.cnic || !formData.gender || 
        !formData.dateOfBirth || !formData.email || !formData.phone || !formData.address || 
        !formData.city || !formData.role || !formData.joiningDate) {
      showToast('Please fill in all required fields', 'warn');
      return;
    }

    // CNIC validation
    const cnicRegex = /^\d{5}-\d{7}-\d$/;
    if (!cnicRegex.test(formData.cnic)) {
      showToast('Invalid CNIC format. Use: XXXXX-XXXXXXX-X', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Invalid email address', 'error');
      return;
    }

    console.log('Staff Data Submitted:', formData);
    console.log('Profile Photo:', profilePhoto);

    // In a real application, send this data to the server via API
    showToast('Staff member added successfully!', 'success');

    // Optionally reset form
    // setFormData({ ...initial state });
    // setProfilePhoto(null);
    // setPhotoFileName('');
  };

  // Handle cancel
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] space-y-2">
          <div
            className={`px-4 py-2 rounded-lg shadow text-white flex items-center gap-2 animate-in slide-in-from-right ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'warn'
                ? 'bg-amber-600'
                : toast.type === 'error'
                ? 'bg-rose-600'
                : 'bg-slate-900'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <a href="/" className="hover:text-slate-700">Dashboard</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <a href="#" className="hover:text-slate-700">Staff</a>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-slate-700">Add Staff</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold">Add New Staff Member</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Staff
            </button>
          </div>
        </div>

        {/* Staff Form */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold">Staff Information</h3>
          </div>
          <div className="p-5">
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cnic" className="block text-sm font-medium text-slate-700 mb-2">
                      CNIC *
                    </label>
                    <input
                      type="text"
                      id="cnic"
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleCnicChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="XXXXX-XXXXXXX-X"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="religion" className="block text-sm font-medium text-slate-700 mb-2">
                      Religion
                    </label>
                    <input
                      type="text"
                      id="religion"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="e.g., Islam"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                      Current Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="teacher">Teacher</option>
                      <option value="principal">Principal</option>
                      <option value="vice-principal">Vice Principal</option>
                      <option value="accountant">Accountant</option>
                      <option value="librarian">Librarian</option>
                      <option value="clerk">Clerk</option>
                      <option value="driver">Driver</option>
                      <option value="peon">Peon</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    >
                      <option value="">Select Department</option>
                      <option value="administration">Administration</option>
                      <option value="science">Science</option>
                      <option value="arts">Arts</option>
                      <option value="commerce">Commerce</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="english">English</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="urdu">Urdu</option>
                      <option value="islamiyat">Islamiyat</option>
                      <option value="accounts">Accounts</option>
                      <option value="library">Library</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="joiningDate" className="block text-sm font-medium text-slate-700 mb-2">
                      Joining Date *
                    </label>
                    <input
                      type="date"
                      id="joiningDate"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Salary (₨)
                    </label>
                    <input
                      type="number"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="e.g., 50000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="qualifications" className="block text-sm font-medium text-slate-700 mb-2">
                      Qualifications
                    </label>
                    <textarea
                      id="qualifications"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="e.g., B.Ed, M.Sc Mathematics"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergencyName" className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Person Name
                    </label>
                    <input
                      type="text"
                      id="emergencyName"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-slate-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      id="emergencyRelationship"
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="e.g., Spouse, Parent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      className="w-full md:w-1/2 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-slate-700 mb-4 pb-2 border-b border-slate-200">
                  Profile Photo
                </h4>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-12 h-12 mx-auto text-slate-400 mb-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 21a9 9 0 0 1 18 0H3z" />
                        </svg>
                        <p className="text-sm text-slate-500">No photo</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Photo</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Choose File
                      </button>
                      <span className="text-sm text-slate-500">
                        {photoFileName || 'JPG, PNG up to 2MB'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-500 mt-8">
          © 2025 eCampus — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
