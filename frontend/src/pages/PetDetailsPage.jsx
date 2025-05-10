import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PawPrint, CalendarDays, Ruler, Tag, Info, Stethoscope, Home, Heart,CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PetDetailsPage = () => {
  const { id } = useParams(); // Get pet ID from URL parameter
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, favoritePetIds, addFavorite, removeFavorite } = useAuth();
  const [isFavLoading, setIsFavLoading] = useState(false);

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching details for pet ID: ${id}`);
        const response = await axios.get(`${API_URL}/pets/${id}`);
        console.log('Pet details fetched:', response.data);
        setPet(response.data);
      } catch (err) {
        console.error("Error fetching pet details:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load pet details.');
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    } else {
      setError("No pet ID provided.");
      setLoading(false);
    }
  }, [id]); // Re-fetch if ID changes

  const isFavorited = favoritePetIds.has(parseInt(id, 10));

  const handleFavoriteToggle = async () => {
    if (!user || isFavLoading || !pet) return;
    setIsFavLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(pet.id);
      } else {
        await addFavorite(pet.id);
      }
    } catch (error) {
      console.error("Failed to toggle favorite status");
    } finally {
      setIsFavLoading(false);
    }
  };

  // Helper function for status badge styles
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Adopted': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
        Loading pet details...
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-6 text-center text-red-600 bg-red-50 rounded border border-red-200">{error}</div>;
  }

  if (!pet) {
    return <div className="container mx-auto p-6 text-center text-gray-500">Pet not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 p-4 relative">
            <img
              src={pet.imageUrl || '/images/placeholder-image.svg'}
              alt={pet.name}
              className="w-full h-auto object-contain rounded-lg max-h-[500px]"
            />
            {/* Favorite Button */}
            {user && (
              <button
                onClick={handleFavoriteToggle}
                disabled={isFavLoading}
                className={`absolute top-6 right-6 p-2 rounded-full transition-colors duration-200 bg-white/70 ${isFavLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}`}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={24} className={`stroke-red-500 ${isFavorited ? 'fill-red-500' : 'fill-transparent'}`} />
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-teal-600">{pet.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadgeStyles(pet.adoptionStatus)}`}>
                    {pet.adoptionStatus}
                </span>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6 text-sm text-gray-700">
              <div className="flex items-center gap-2"><PawPrint size={16} className="text-gray-500" /> <strong>Species:</strong> {pet.species || 'N/A'}</div>
              <div className="flex items-center gap-2"><Tag size={16} className="text-gray-500" /> <strong>Breed:</strong> {pet.breed || 'N/A'}</div>
              <div className="flex items-center gap-2"><CalendarDays size={16} className="text-gray-500" /> <strong>Age:</strong> {pet.age || 'N/A'}</div>
              <div className="flex items-center gap-2"><Info size={16} className="text-gray-500" /> <strong>Gender:</strong> {pet.gender || 'N/A'}</div>
              <div className="flex items-center gap-2"><Ruler size={16} className="text-gray-500" /> <strong>Size:</strong> {pet.size || 'N/A'}</div>
            </div>

            {/* Description */}
            {pet.description && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1">About {pet.name}</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{pet.description}</p>
                </div>
            )}

            {/* Medical History */}
            {pet.medicalHistory && (
                <div className="mb-6">
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 border-b pb-1 flex items-center gap-2"><Stethoscope size={18}/> Medical History</h2>
                    
                    <p className="flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"><CheckCircle className="h-4 w-4 mr-1" />{pet.medicalHistory}</p>
                </div>
            )}

             {/* Shelter Info */}
             {pet.shelter && (
                <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"><Home size={18}/> Shelter Information</h2>
                    <p className="text-gray-700">Listed by: <strong>{pet.shelter.name}</strong></p>
                </div>
             )}

            {/* Action Button */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              {pet.adoptionStatus === 'Available' ? (
                <Link
                  to={`/apply/${pet.id}`}
                  className="block w-full bg-teal-600 text-white text-lg font-medium px-6 py-3 rounded hover:bg-teal-700 transition-colors duration-200 text-center shadow-md"
                >
                  Apply to Adopt {pet.name}
                </Link>
              ) : pet.adoptionStatus === 'Pending' ? (
                 <p className="text-center text-yellow-700 font-medium bg-yellow-100 p-3 rounded">Adoption Pending</p>
              ) : (
                 <p className="text-center text-red-700 font-medium bg-red-100 p-3 rounded">Already Adopted</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;
