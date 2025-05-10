import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useAuth } from '../../context/AuthContext'; // Use custom hook
    import ApplicationReviewCard from '../../components/applications/ApplicationReviewCard'; // Import the card component

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const ShelterApplicationsPage = () => {
        const [applications, setApplications] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');
        const { user } = useAuth();
        const token = localStorage.getItem('authToken');

        const fetchApplications = async () => {
            if (!user || !token) {
                setError("Authentication required.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get(`${API_URL}/applications/shelter`, config);
                setApplications(response.data);
            } catch (err) {
                console.error('Error fetching shelter applications:', err);
                setError(err.response?.data?.message || 'Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        useEffect(() => {
            fetchApplications();
        }, [user, token]); // Refetch if user/token changes

        // Callback function for ApplicationReviewCard to update the list state
        const handleApplicationUpdate = (updatedApplication) => {
            setApplications(prevApps =>
                prevApps.map(app =>
                    app.id === updatedApplication.id ? updatedApplication : app
                )
            );
        };

        return (
            <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-teal-600">Review Adoption Applications</h1>

                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

                {loading ? (
                    <p className="text-center text-gray-500">Loading applications...</p>
                ) : applications.length === 0 ? (
                    <p className="text-center text-gray-500 bg-white p-6 rounded shadow border">No applications received yet.</p>
                ) : (
                    <div className="space-y-6">
                        {applications.map(app => (
                            <ApplicationReviewCard
                                key={app.id}
                                application={app}
                                onUpdate={handleApplicationUpdate} // Pass callback to update state
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    export default ShelterApplicationsPage;