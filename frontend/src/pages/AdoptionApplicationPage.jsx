import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AdoptionApplicationPage = () => {
  const { petId } = useParams(); // Get pet ID from URL params
  const { user } = useContext(AuthContext); // Get logged-in user info
  const navigate = useNavigate();
  
  const [pet, setPet] = useState(null);
  const [petLoading, setPetLoading] = useState(true);
  const [petError, setPetError] = useState('');
  
  // Form fields
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    applicantMessage: '',
    homeEnvironment: '',
    petId: petId || null,
    userId: user?.id || null,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      if (!petId) {
        setPetError("No pet specified for application.");
        setPetLoading(false);
        return;
      }
      
      setPetLoading(true);
      setPetError('');
      
      try {
        const res = await axios.get(`${API_URL}/pets/${petId}`);
        if (res.data.adoptionStatus !== 'Available') {
          setPetError(`This pet (${res.data.name}) is no longer available for adoption.`);
          setPet(null);
        } else {
          setPet(res.data);
        }
      } catch (err) {
        setPetError("Could not load pet details.");
        setPet(null);
      } finally {
        setPetLoading(false);
      }
    };
    
    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit an application.');
      return;
    }
    
    // Basic validation
    if (!formData.homeEnvironment.trim()) {
      setError("Please provide a description of your home environment.");
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Prepare payload as expected by backend
      const payload = {
        petId: petId,
        applicantMessage: formData.applicantMessage,
        homeEnvironment: formData.homeEnvironment
      };
      
      // Make the actual API call
      await axios.post(`${API_URL}/applications`, payload, config);
      
      setSuccess(`Application submitted successfully! The shelter will contact you regarding your application.`);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error("Error submitting application:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (petLoading) return <div className="container mx-auto p-6 text-center">Loading pet details...</div>;
  if (petError) return <div className="container mx-auto p-6 text-center text-red-600">{petError}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary text-center">
          Adoption Application {pet ? `for ${pet.name}` : petId ? `for Pet #${petId}` : ''}
        </h1>
        
        {/* Pet Info Header (if pet is loaded) */}
        {pet && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-6 flex items-center gap-4">
            <img 
              src={pet.imageUrl || '/images/placeholder-pet.jpg'} 
              alt={pet.name} 
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-semibold">{pet.name}</h2>
              <p className="text-sm text-gray-600">{pet.breed || pet.species}</p>
              <p className="text-sm text-gray-500">Status: {pet.adoptionStatus}</p>
            </div>
          </div>
        )}
        
        {/* Display messages */}
        {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
        
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={!!user}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!user}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-text mb-1">Full Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Street, City, State, Zip Code"
              />
            </div>
            <div>
              <label htmlFor="homeEnvironment" className="block text-sm font-medium text-text mb-1">Home Environment *</label>
              <textarea
                id="homeEnvironment"
                name="homeEnvironment"
                rows="5"
                value={formData.homeEnvironment}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Describe your living situation (house/apartment, yard, other pets, children, etc.)..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="applicantMessage" className="block text-sm font-medium text-text mb-1">Message to the Shelter (Optional)</label>
              <textarea
                id="applicantMessage"
                name="applicantMessage"
                rows="5"
                value={formData.applicantMessage}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Tell us why you'd be a great home for this pet... (Reason for adoption, experience, etc.)"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-500 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
            
            {!user && (
              <p className="text-center text-sm text-gray-600">
                Already have an account? <a href="/login" className="font-medium text-secondary hover:text-orange-500">Login here</a> to pre-fill your details.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AdoptionApplicationPage;
