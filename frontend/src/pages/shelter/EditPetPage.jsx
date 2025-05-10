import React, { useState, useEffect, useContext } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import PetForm from '../../components/pets/PetForm'; // Adjust path
    import AuthContext from '../../context/AuthContext';
    import axios from 'axios';

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const EditPetPage = () => {
        const { petId } = useParams(); // Get pet ID from URL
        const navigate = useNavigate();
        const { user } = useContext(AuthContext);
        const [petData, setPetData] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [fetchLoading, setFetchLoading] = useState(true); // Loading state for initial fetch
        const [error, setError] = useState('');

        const token = localStorage.getItem('authToken');

        // Fetch existing pet data
        useEffect(() => {
            const fetchPet = async () => {
                setFetchLoading(true);
                setError('');
                if (!token) {
                    setError("Authentication required.");
                    setFetchLoading(false);
                    return;
                }
                try {
                    const config = {
                        headers: { 'Authorization': `Bearer ${token}` }
                    };
                    // Fetch specific pet details - public endpoint is fine here, ownership check happens on update
                    const response = await axios.get(`${API_URL}/pets/${petId}`, config);
                    // Basic check if the fetched pet belongs to the current shelter
                    if (response.data.userId !== user?.id) {
                         setError("You do not have permission to edit this pet.");
                         setPetData(null);
                    } else {
                        setPetData(response.data);
                    }
                } catch (err) {
                    console.error('Error fetching pet data:', err.response?.data || err.message);
                    setError(err.response?.data?.message || 'Failed to load pet data.');
                    setPetData(null);
                } finally {
                    setFetchLoading(false);
                }
            };

            if (petId && user) { // Only fetch if ID and user are available
                fetchPet();
            } else if (!user) {
                 setError("Please log in.");
                 setFetchLoading(false);
            }
        }, [petId, user, token]);

        const handleEditPet = async (formData) => {
            setIsLoading(true);
            setError('');

            if (!user || user.role !== 'Shelter' || !token) {
                setError('Authentication required or invalid role.');
                setIsLoading(false);
                return;
            }

            try {
                 const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                // API call to update pet
                const response = await axios.put(`${API_URL}/pets/${petId}`, formData, config);
                console.log('Pet updated successfully:', response.data);
                navigate('/shelter/pets'); // Redirect after successful update
            } catch (err) {
                console.error('Error updating pet:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to update pet.');
            } finally {
                setIsLoading(false);
            }
        };

        if (fetchLoading) {
            return <div className="container mx-auto p-6 text-center">Loading pet data...</div>;
        }

        return (
            <div className="container mx-auto p-4 md:p-6 max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-teal-600">Edit Pet Listing</h1>
                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                {petData ? (
                    <PetForm initialData={petData} onSubmit={handleEditPet} isLoading={isLoading} />
                ) : (
                    !error && <p className="text-center text-gray-500">Pet data could not be loaded.</p> // Show only if no error message exists
                )}
            </div>
        );
    };

    export default EditPetPage;