import React, { useState } from 'react';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import axios from 'axios';

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    const ResetPasswordPage = () => {
        const { token } = useParams(); // Get token from URL parameter
        const navigate = useNavigate();
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [message, setMessage] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage('');
            setError('');

            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }

            setLoading(true);

            try {
                const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
                setMessage(response.data.message + ' Redirecting to login...');
                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate('/login', { state: { message: 'Password reset successfully! Please log in.' } });
                }, 3000);
            } catch (err) {
                console.error('Reset Password Error:', err);
                setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-teal-50 to-amber-50 p-4">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-6">
                        <h1 className="text-2xl font-bold text-teal-600 text-center mb-4">Reset Your Password</h1>

                        {message && <p className="text-green-600 text-sm text-center bg-green-100 p-3 rounded-md">{message}</p>}
                        {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}

                        {!message && ( // Hide form after success
                            <>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </>
                        )}
                         {message && ( // Show login link after success
                             <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                                <Link to="/login" className="font-medium text-amber-500 hover:text-amber-600">Back to Login</Link>
                            </p>
                         )}
                    </form>
                </div>
            </div>
        );
    };

    export default ResetPasswordPage;