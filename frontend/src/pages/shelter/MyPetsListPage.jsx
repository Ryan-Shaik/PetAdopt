import React, { useState, useEffect, useContext } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import AuthContext from '../../context/AuthContext';
    import axios from 'axios';
    import { Edit, Trash2, PlusCircle } from 'lucide-react'; // Icons

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const MyPetsListPage = () => {
        const [pets, setPets] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const { user } = useContext(AuthContext);
        const navigate = useNavigate();
        const token = localStorage.getItem('authToken');

        const fetchMyPets = async () => {
            setLoading(true);
            setError('');
            if (!token) {
                setError("Authentication required.");
                setLoading(false);
                return;
            }
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(`${API_URL}/pets/my-pets`, config);
                setPets(response.data);
            } catch (err) {
                console.error('Error fetching shelter pets:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to load your pets.');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            if (user && user.role === 'Shelter') {
                fetchMyPets();
            } else {
                setError("Access denied.");
                setLoading(false);
            }
        }, [user, token]); // Rerun if user or token changes

        const handleDelete = async (petId, petName) => {
            // Confirmation dialog
            if (!window.confirm(`Are you sure you want to delete the listing for "${petName}"? This action cannot be undone.`)) {
                return;
            }

            setError(''); // Clear previous errors
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                await axios.delete(`${API_URL}/pets/${petId}`, config);
                // Refresh the list after successful deletion
                setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
                console.log(`Pet ${petId} deleted successfully.`);
            } catch (err) {
                console.error(`Error deleting pet ${petId}:`, err.response?.data || err.message);
                setError(err.response?.data?.message || `Failed to delete pet "${petName}".`);
            }
        };

        return (
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-teal-600">My Pet Listings</h1>
                    <Link
                        to="/shelter/pets/add"
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md font-medium hover:bg-teal-700 transition-colors"
                    >
                        <PlusCircle size={18} /> Add New Pet
                    </Link>
                </div>

                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

                {loading ? (
                    <p className="text-center text-gray-500">Loading your pets...</p>
                ) : pets.length === 0 ? (
                    <p className="text-center text-gray-500 bg-white p-6 rounded shadow border">You haven't listed any pets yet. <Link to="/shelter/pets/add" className="text-teal-600 hover:underline">Add one now!</Link></p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pets.map((pet) => (
                                    <tr key={pet.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.species}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                pet.adoptionStatus === 'Available' ? 'bg-green-100 text-green-800' :
                                                pet.adoptionStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800' // Adopted
                                            }`}>
                                                {pet.adoptionStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                to={`/shelter/pets/edit/${pet.id}`}
                                                className="text-teal-600 hover:text-teal-800 inline-flex items-center gap-1"
                                                title="Edit Pet"
                                            >
                                                <Edit size={16} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(pet.id, pet.name)}
                                                className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                                title="Delete Pet"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    export default MyPetsListPage;