import React, { useState, useEffect } from 'react';
    import { useAuth } from '../context/AuthContext'; // Use custom hook
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const EditProfilePage = () => {
        const { user, loadUser } = useAuth(); // Get user and loadUser function
        const navigate = useNavigate();
        const [formData, setFormData] = useState({
            name: '',
            email: '', // Display only, not editable for now
            phoneNumber: '',
            address: ''
        });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const token = localStorage.getItem('authToken');

        // Pre-fill form when user data is available
        useEffect(() => {
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || '',
                    phoneNumber: user.phoneNumber || '',
                    address: user.address || ''
                }));
            }
        }, [user]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
            setError(''); // Clear error on change
            setSuccess(''); // Clear success on change
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            if (!token) {
                setError("Authentication error. Please log in again.");
                return;
            }

            // --- Client-side Validation ---
            if (!formData.name.trim()) {
                setError("Name cannot be empty.");
                return;
            }

            setLoading(true);

            // Prepare payload - only send fields that are being updated
            const payload = {
                name: formData.name.trim(),
                phoneNumber: formData.phoneNumber,
                address: formData.address
            };

            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.put(`${API_URL}/users/me`, payload, config);

                setSuccess("Profile updated successfully!");
                // Refresh user data in AuthContext
                await loadUser(); // Re-fetch user data to update context/display

                // Optionally redirect after a delay
                // setTimeout(() => navigate('/dashboard'), 2000);

            } catch (err) {
                console.error("Error updating profile:", err);
                setError(err.response?.data?.message || "Failed to update profile.");
            } finally {
                setLoading(false);
            }
        };

        if (!user) {
            return <div className="container mx-auto p-6 text-center">Loading user data...</div>;
        }

        return (
            <div className="container mx-auto p-4 md:p-8 max-w-2xl">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-teal-600">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-6">
                    {error && <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200 text-sm">{error}</p>}
                    {success && <p className="text-green-600 bg-green-50 p-3 rounded border border-green-200 text-sm">{success}</p>}

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} readOnly disabled
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm cursor-not-allowed" />
                        <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                            placeholder="e.g., 555-123-4567"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange}
                            rows="3"
                            placeholder="Street Address, City, State, Zip Code"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading}
                        className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        );
    };

    export default EditProfilePage;
