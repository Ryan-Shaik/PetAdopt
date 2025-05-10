import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Dummy data - replace with API call later
const dummyFeaturedPets = [
  { id: 1, name: 'Buddy', species: 'Dog', imageUrl: '/images/placeholder-dog1.jpg', location: 'New York, NY' },
  { id: 2, name: 'Whiskers', species: 'Cat', imageUrl: '/images/placeholder-cat1.jpg', location: 'Los Angeles, CA' },
  { id: 3, name: 'Rocky', species: 'Dog', imageUrl: '/images/placeholder-dog2.jpg', location: 'Chicago, IL' },
  { id: 4, name: 'Luna', species: 'Cat', imageUrl: '/images/placeholder-cat2.jpg', location: 'Houston, TX' },
  { id: 5, name: 'Max', species: 'Dog', imageUrl: '/images/placeholder-dog3.jpg', location: 'Phoenix, AZ' },
  { id: 6, name: 'Cleo', species: 'Cat', imageUrl: '/images/placeholder-cat3.jpg', location: 'Philadelphia, PA' },
];

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [allPets, setAllPets] = useState([]); // For listing page potentially
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pets from the backend API
  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching pets from ${API_URL}/pets`);
        const response = await axios.get(`${API_URL}/pets`);
        console.log('Pets fetched successfully:', response.data);

        setAllPets(response.data); // Store all fetched pets
        
        // Set featured pets (first 6 pets)
        setFeaturedPets(response.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching pets:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load pets.');
        setAllPets([]); // Clear pets on error
        setFeaturedPets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
    // No dependencies needed if we only fetch on initial load
  }, []);

  // TODO: Add function to fetch all pets with filters

  const value = {
    featuredPets,
    allPets,
    isLoading,
    error,
    // Add fetch functions here later
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

// Custom hook to use the PetContext (optional but good practice)
export const usePets = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export default PetContext; // Export context for direct use if needed
