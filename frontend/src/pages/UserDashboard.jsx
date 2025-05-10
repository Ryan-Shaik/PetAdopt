import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import PetCard from '../components/PetCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [favoritePets, setFavoritePets] = useState([]);
  const [favLoading, setFavLoading] = useState(true);
  const [favError, setFavError] = useState('');
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const [appError, setAppError] = useState('');
  const token = localStorage.getItem('authToken');

  // Fetch favorite pets
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !token) {
        setFavError("Please log in to see favorites.");
        setFavLoading(false);
        return;
      }
      setFavLoading(true);
      setFavError('');
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/users/me/favorites`, config);
        setFavoritePets(res.data);
      } catch (err) {
        console.error("Error fetching favorites for dashboard:", err);
        setFavError("Could not load favorites.");
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavorites();
  }, [user, token]); // Refetch if user or token changes

  // Fetch Applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !token) {
        setAppError("Please log in to see applications.");
        setAppLoading(false);
        return;
      }
      setAppLoading(true);
      setAppError('');
      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/applications/my-applications`, config);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching user applications:", err);
        setAppError("Could not load your applications.");
      } finally {
        setAppLoading(false);
      }
    };
    fetchApplications();
  }, [user, token]); // Refetch if user or token changes

  // Helper for status badge styles
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Placeholder for when we don't have user data yet
  if (!user) {
    return <div className="container mx-auto p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-teal-50 to-amber-50 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-teal-600">Welcome, {user?.name || 'User'}!</h1>
          <p className="text-lg text-gray-700 mt-2">Manage your adoption journey here.</p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4 md:p-6">
        {/* My Favorites Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-teal-700 border-b pb-2">My Favorite Pets</h2>
          {favLoading ? (
            <p className="text-gray-500">Loading favorites...</p>
          ) : favError ? (
            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">{favError}</p>
          ) : favoritePets.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded border">You haven't saved any favorites yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* My Applications Section */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-teal-700 border-b pb-2">My Adoption Applications</h2>
            {appLoading ? (
              <p className="text-gray-500">Loading applications...</p>
            ) : appError ? (
              <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">{appError}</p>
            ) : applications.length === 0 ? (
              <p className="text-gray-500">You have not submitted any applications yet.</p>
            ) : (
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {applications.map(app => (
                    <li key={app.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <img
                          src={app.Pet?.imageUrl || '/images/placeholder-pet.jpg'}
                          alt={app.Pet?.name || 'Pet'}
                          className="w-12 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div>
                          <Link to={`/pets/${app.Pet?.id}`} className="text-md font-semibold text-teal-600 hover:underline">
                            {app.Pet?.name || 'Unknown Pet'}
                          </Link>
                          <p className="text-sm text-gray-500">
                            Shelter: {app.shelter?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-left sm:text-right w-full sm:w-auto">
                        <p>Applied: {formatDate(app.createdAt)}</p>
                        <p>Status:
                          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(app.status)}`}>
                            {app.status}
                          </span>
                        </p>
                        {app.status === 'Rejected' && app.shelterNotes && (
                          <p className="text-xs mt-1 text-gray-400 italic" title={app.shelterNotes}>Reason available</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Saved Searches Card */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-amber-500 border-b pb-2">Saved Searches</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Dogs, Young, Medium Size</p>
              <p className="text-sm text-gray-600">Cats, Any Age, Good with Children</p>
            </div>
          </div> */}

          {/* Profile Settings Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-teal-700 border-b pb-2">Profile Settings</h2>
            <p className="text-sm text-gray-600 mb-4">Keep your contact information up to date.</p>
            <Link
              to="/profile/edit"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
