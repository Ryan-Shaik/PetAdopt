import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ShelterDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // TODO: Fetch shelter-specific data (pets, applications, profile) when API is ready
  
  if (!user || user.role !== 'Shelter') {
    // Handle case where user data isn't loaded or user is not a shelter
    return <div className="container mx-auto p-6 text-center">Loading dashboard or access denied...</div>;
  }
  
  // TODO: Fetch shelter name if not part of the basic user object
  const shelterName = user.shelterName || user.name || 'Your Shelter';

  return (
    <div>
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-teal-50 to-orange-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary">Shelter Dashboard</h1>
          <p className="text-lg text-text mt-1">Manage {shelterName}'s listings and applications.</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Manage Pets Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Manage Pets</h2>
            <p className="text-sm text-gray-600 mb-4">Add new pets or update existing listings.</p>
            <div className="space-y-3 sm:space-y-0 sm:space-x-3">
              <Link
                to="/shelter/pets/add"
                className="inline-block w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Add New Pet
              </Link>
              <Link
                to="/shelter/pets"
                className="inline-block w-full sm:w-auto bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                View My Pets
              </Link>
            </div>
          </div>

          {/* Adoption Applications Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Adoption Applications</h2>
            <p className="text-sm text-gray-600 mb-4">Review applications submitted for your pets.</p>
            {/* TODO: Add dynamic count of pending applications */}
            {/* <p className="text-sm text-gray-600 mb-4"><span className="font-bold text-orange-600">3</span> Pending Applications</p> */}
            <Link
              to="/shelter/applications"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Review Applications
            </Link>
          </div>

          {/* Shelter Profile Card */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-secondary border-b pb-2">Shelter Profile</h2>
            <p className="text-sm text-gray-600 mb-4">Update your shelter's information and contact details.</p>
            <Link
              to="/shelter/profile/edit"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Edit Shelter Profile
            </Link>
          </div> */}
          
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard;
