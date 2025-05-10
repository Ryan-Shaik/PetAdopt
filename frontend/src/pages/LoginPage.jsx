import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || 
                      new URLSearchParams(location.search).get('redirect') || 
                      '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      console.log('Login successful, user data:', loggedInUser);
      
      let finalRedirectPath = redirectPath;
      if (redirectPath === '/dashboard' || redirectPath === '/') {
        if (loggedInUser?.role === 'Admin') finalRedirectPath = '/admin/dashboard';
        else if (loggedInUser?.role === 'Shelter') finalRedirectPath = '/shelter/dashboard';
        else finalRedirectPath = '/dashboard';
      }

      console.log(`Navigating to: ${finalRedirectPath}`);
      navigate(finalRedirectPath, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-teal-50 to-orange-50 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-6">
          <h1 className="text-3xl font-bold text-primary text-center mb-2">Welcome Back!</h1>
          <p className="text-center text-gray-600 mb-6">Log in to continue your journey.</p>
          
          {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10S6.477 0 12 0c1.05 0 2.062.15 3.025.425M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.05 10.05 0 0112 4c5.523 0 10 4.477 10 10s-4.477 10-10 10a10.05 10.05 0 01-8.02-4.223M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
          
          <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            Don't have an account? <Link to="/signup" className="font-medium text-secondary hover:text-orange-500">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
