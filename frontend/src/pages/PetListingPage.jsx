import React, { useState, useEffect, useCallback } from 'react';
import PetCard from '../components/PetCard';
import Filters from '../components/Filters';
import axios from 'axios';

// Define API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PetListingPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  
  // Fetch pets from API with useCallback for memoization
  const fetchPets = useCallback(async (filtersToApply) => {
    console.log("PetListingPage.jsx: fetchPets called with filters:", filtersToApply);
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filtersToApply.species && filtersToApply.species !== 'Any') {
        params.species = filtersToApply.species;
      }
      if (filtersToApply.age && filtersToApply.age !== 'Any') {
        params.age = filtersToApply.age;
      }
      if (filtersToApply.size && filtersToApply.size !== 'Any') {
        params.size = filtersToApply.size;
      }
      if (filtersToApply.location && filtersToApply.location.trim() !== '') {
        params.location = filtersToApply.location.trim();
      }

      console.log(`PetListingPage.jsx: Fetching pets from ${API_URL}/pets with params:`, params);
      const response = await axios.get(`${API_URL}/pets`, { params });
      console.log('PetListingPage.jsx: Pets fetched successfully:', response.data);
      setPets(response.data);
    } catch (err) {
      console.error("PetListingPage.jsx: Error fetching pets:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load pets. Please try again later.');
      setPets([]); // Clear pets on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies from this scope that change
  
  useEffect(() => {
    console.log("PetListingPage.jsx: useEffect triggered. Current activeFilters:", activeFilters);
    fetchPets(activeFilters);
  }, [activeFilters, fetchPets]); // Re-fetch when activeFilters change
  
  // Renamed from handleFilterChange to handleApplyFilters
  const handleApplyFilters = (newFilters) => {
    console.log("PetListingPage.jsx: handleApplyFilters called with newFilters:", newFilters);
    setActiveFilters(newFilters);
  };
  
  return (
    <div>
      {/* Page Title Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Find Your New Friend</h1>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            {/* Corrected prop name to onApplyFilters and removed unused currentFilters */}
            <Filters onApplyFilters={handleApplyFilters} />
          </aside>
          
          {/* Pet Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                <p className="ml-3 text-gray-600">Loading pets...</p>
              </div>
            )}
            {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}
            {!loading && !error && pets.length === 0 && (
              <p className="text-center text-gray-500 bg-white p-6 rounded shadow border">No pets found matching your criteria. Please try different filters or an initial search.</p>
            )}
            {!loading && !error && pets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pets.map(pet => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
            
            {/* Add Pagination component later */}
            {/* <div className="mt-8 flex justify-center">
               Pagination Placeholder
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PetListingPage;
