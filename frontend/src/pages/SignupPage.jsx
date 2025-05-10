import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Adopter',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Call signup function from context/API
      await signup(formData.name, formData.email, formData.password, formData.role);
      console.log('Signup successful');
      // Redirect to login page after successful signup
      navigate('/login', { state: { message: 'Signup successful! Please log in.' } });
    } catch (err) {
      console.error('Signup failed:', err);
      // Set error message based on actual API response
      setError(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-teal-50 to-orange-50 p-8">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-6">
          <h1 className="text-3xl font-bold text-primary text-center mb-2">Create Your Account</h1>
          <p className="text-center text-gray-600 mb-6">Join PetAdopt today!</p>
          
          {error && <p className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-md mb-6">{error}</p>}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              autoComplete="new-password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              autoComplete="new-password"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-text mb-2">Register as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="Adopter">Adopter</option>
              <option value="Shelter">Shelter</option>
              {/* Admin role likely assigned manually or through specific process */}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200 mt-8">
            Already have an account? <Link to="/login" className="font-medium text-secondary hover:text-orange-500">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
