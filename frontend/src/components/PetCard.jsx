import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

// Expect pet data as props later
const PetCard = ({ pet = { id: 0, name: 'Placeholder Pet', species: 'Unknown', imageUrl: '/vite.svg', location: 'City, ST', adoptionStatus: 'Available' } }) => {
  const { user, favoritePetIds, addFavorite, removeFavorite } = useAuth();
  const [isFavLoading, setIsFavLoading] = useState(false);
  
  const isFavorited = favoritePetIds?.has(pet.id);
  
  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!user || isFavLoading) return; // Must be logged in and not already loading
    
    setIsFavLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(pet.id);
      } else {
        await addFavorite(pet.id);
      }
    } catch (error) {
      console.error("Failed to toggle favorite status");
      // Optionally show an error message to the user
    } finally {
      setIsFavLoading(false);
    }
  };
  
  // Helper function to get badge styles based on status
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Adopted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  return (
    <div className="border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white flex flex-col">
      <div className="relative w-full h-full overflow-hidden bg-gray-50">
        <img 
          src={pet.imageUrl || '/images/placeholder-image.svg'} 
          alt={pet.name} 
          className="w-full h-52 object-cover" 
        />
        <span
          className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(pet.adoptionStatus)}`}
        >
          {pet.adoptionStatus}
        </span>
        {/* Favorite Button - Only show if user is logged in */}
        {user && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isFavLoading}
            className={`absolute top-2 left-2 p-1.5 rounded-full transition-colors duration-200 ${
              isFavLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/50'
            }`}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={`stroke-red-500 ${isFavorited ? 'fill-red-500' : 'fill-transparent'}`}
            />
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-teal-600 mb-1">{pet.name}</h3>
        <p className="text-sm text-gray-700 mb-1">{pet.species}</p>
        <p className="text-xs text-gray-500 mb-3">{pet.location}</p>
        <div className="mt-auto">
          <Link
            to={`/pets/${pet.id}`}
            className="block w-full bg-teal-600 text-white text-sm px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-200 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
