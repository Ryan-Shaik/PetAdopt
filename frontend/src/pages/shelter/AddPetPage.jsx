import React, { useState, useContext } from 'react';
    import { useNavigate } from 'react-router-dom';
    import PetForm from '../../components/pets/PetForm'; // Adjust path if needed
    import AuthContext from '../../context/AuthContext'; // To ensure user is logged in and get token
    import axios from 'axios'; // Use axios directly

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const AddPetPage = () => {
        const navigate = useNavigate();
        const { user } = useContext(AuthContext); // Get user context
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        // Get the auth token from localStorage for the API call header
        const token = localStorage.getItem('authToken');

        const handleAddPet = async (formData) => {
            setIsLoading(true);
            setError('');

            if (!user || user.role !== 'Shelter') {
                setError('You must be logged in as a Shelter to add pets.');
                setIsLoading(false);
                return;
            }
            if (!token) {
                 setError('Authentication token not found. Please log in again.');
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
                // API call to create pet
                const response = await axios.post(`${API_URL}/pets`, formData, config);
                console.log('Pet added successfully:', response.data);
                // Redirect to the shelter's pet list page after successful addition
                navigate('/shelter/pets'); // Adjust if your route is different
            } catch (err) {
                console.error('Error adding pet:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to add pet. Please check the details and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="container mx-auto p-4 md:p-6 max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-teal-600">Add New Pet Listing</h1>
                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                <PetForm onSubmit={handleAddPet} isLoading={isLoading} />
            </div>
        );
    };

    export default AddPetPage;