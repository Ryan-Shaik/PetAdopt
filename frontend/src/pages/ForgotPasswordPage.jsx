import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import axios from 'axios'; // Use axios directly or via context

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const ForgotPasswordPage = () => {
        const [email, setEmail] = useState('');
        const [message, setMessage] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage('');
            setError('');
            setLoading(true);

            try {
                // Use axios directly here, or call a context function if you add one
                const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
                setMessage(response.data.message); // Display the generic success message from backend
            } catch (err) {
                console.error('Forgot Password Error:', err);
                // Use a generic error message unless the backend provides specific safe ones
                setError('An error occurred. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-teal-50 to-amber-50 p-4">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-6">
                        <h1 className="text-2xl font-bold text-teal-600 text-center mb-4">Forgot Your Password?</h1>
                        <p className="text-center text-gray-600 mb-6">Enter your email address below, and we'll send you a link to reset your password.</p>

                        {message && <p className="text-green-600 text-sm text-center bg-green-100 p-3 rounded-md">{message}</p>}
                        {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}

                        {!message && ( // Hide form after success message is shown
                            <>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </>
                        )}

                        <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                            Remember your password? <Link to="/login" className="font-medium text-amber-500 hover:text-amber-600">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    };

    export default ForgotPasswordPage;