import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // Fetch admin-specific data later (users, shelters, system settings)
  if (!user || user.role !== 'Admin') {
    return <div className="container mx-auto p-6 text-center">Loading dashboard or access denied...</div>;
  }
  
  return (
    <div>
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-lg text-text mt-2">System overview and management tools.</p>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Users Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Manage Users</h2>
            <p className="text-sm text-gray-600 mb-4">View, edit, or manage user accounts.</p>
            <Link
              to="/admin/users"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              View Users
            </Link>
          </div>
          
          {/* Manage Shelters Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Manage Shelters</h2>
            <p className="text-sm text-gray-600 mb-4">Approve new shelters and manage existing ones.</p>
            <Link
              to="/admin/shelters"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              View Shelters
            </Link>
          </div>
          
          {/* Manage Pets Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Manage Pet Listings</h2>
            <p className="text-sm text-gray-600 mb-4">Oversee all pet listings on the platform.</p>
            <Link
              to="/admin/pets"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              View All Pets
            </Link>
          </div>
          
          {/* System Settings Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">System Settings</h2>
            <p className="text-sm text-gray-600 mb-4">Configure site options and parameters.</p>
            <Link
              to="/admin/settings"
              className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Configure Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
