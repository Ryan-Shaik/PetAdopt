import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';

// Set base URL for backend API requests using Vite's env variable convention
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const api = axios.create({
  baseURL: API_URL,
});

// Function to set Authorization header for subsequent requests
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user object { id, name, email, role }
  const [loading, setLoading] = useState(true); // To check initial auth status
  const [favoritePetIds, setFavoritePetIds] = useState(new Set()); // State for favorite pet IDs

  // Fetch user's favorite pets
  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return; // Need token and user loaded
    
    console.log('Fetching user favorites...');
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await api.get('/users/me/favorites', config);
      const ids = new Set(res.data.map(pet => pet.id));
      setFavoritePetIds(ids);
      console.log('Favorites loaded:', ids);
    } catch (err) {
      console.error("Error fetching favorites:", err.response?.data?.message || err.message);
      // Keep stale data instead of clearing on error
    }
  }, [user]);

  // Load user from token via backend
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    setLoading(true); // Ensure loading is true at start
    
    if (token) {
      setAuthToken(token); // Set auth header for the /me request
      try {
        console.log('Attempting to load user data from /auth/me');
        // Call the backend endpoint to verify token and get user data
        const res = await api.get('/auth/me');
        setUser(res.data.user); // Set user state with data from backend
        console.log('User data loaded successfully:', res.data.user);
      } catch (err) {
        // Handle errors (e.g., token expired, invalid token, server error)
        console.error("Error loading user from /auth/me:", err.response?.data?.message || err.message);
        setUser(null); // Clear user state
        setAuthToken(null); // Clear invalid token from storage and headers
        setFavoritePetIds(new Set()); // Clear favorites if user load fails
      }
    } else {
      console.log('No token found in local storage.');
      setUser(null);
      setFavoritePetIds(new Set()); // Clear favorites if no token
    }
    setLoading(false); // Loading finished whether user was loaded or not
  }, []);

  // Fetch favorites when user state changes (after login/load)
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
      if (token) {
        setAuthToken(token); // Set token in axios headers
        try {
          const response = await api.get('/auth/me'); // Fetch user data
          setUser(response.data); // Set user state
        } catch (err) {
          console.error("Error loading user:", err);
          setAuthToken(null); // Clear invalid token
          localStorage.removeItem('authToken'); // Remove token
        }
      }
      setLoading(false); // Mark loading as complete
    };

    loadUserFromToken();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        setAuthToken(res.data.token);
        setUser(res.data.user);
        // return res.data.user;
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data?.message || err.message);
      setAuthToken(null);
      setUser(null);
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  // Signup function
  const signup = async (name, email, password, role) => {
    try {
      const payload = { name, email, password, role };
      const res = await api.post('/auth/register', payload);
      console.log('Signup successful:', res.data.message);
      return res.data;
    } catch (err) {
      console.error('Signup Error:', err.response?.data?.message || err.message);
      throw new Error(err.response?.data?.message || 'Signup failed');
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user...');
    setAuthToken(null); // Clear header and remove token from storage
    setUser(null); // Clear user state
    setFavoritePetIds(new Set()); // Clear favorites on logout
  };

  // Add a pet to favorites
  const addFavorite = async (petId) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return; // Need token and user loaded
    
    console.log(`Adding favorite: Pet ID ${petId}`);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await api.post(`/users/me/favorites/${petId}`, {}, config);
      setFavoritePetIds(prev => new Set([...prev, petId])); // Optimistic update
    } catch (err) {
      console.error(`Error adding favorite ${petId}:`, err.response?.data?.message || err.message);
      throw err; // Re-throw for component handling
    }
  };

  // Remove a pet from favorites
  const removeFavorite = async (petId) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user) return; // Need token and user loaded
    
    console.log(`Removing favorite: Pet ID ${petId}`);
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await api.delete(`/users/me/favorites/${petId}`, config);
      setFavoritePetIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(petId);
        return newSet;
      }); // Optimistic update
    } catch (err) {
      console.error(`Error removing favorite ${petId}:`, err.response?.data?.message || err.message);
      throw err; // Re-throw for component handling
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      isAuthenticated: !!user,
      favoritePetIds,
      addFavorite,
      removeFavorite,
      fetchFavorites
    }}>
      {!loading && children} {/* Render children only after initial loading is done */}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
