import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { usePets } from '../context/PetContext';
import PetCard from '../components/PetCard';
import { Search, Heart, Home, PawPrint, Shield, Users } from 'lucide-react';

// Define API_URL with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const HomePage = () => {
    // Get featured pets, loading state, and error from context
    const { featuredPets, setFeaturedPets, isLoading, error, setIsLoading, setError } = usePets();

    useEffect(() => {
        const fetchPets = async () => {
            // Conditionally call setIsLoading if it's a function
            if (typeof setIsLoading === 'function') {
                setIsLoading(true);
            }
            try {
                const response = await axios.get(`${API_URL}/pets`);
                // Conditionally call setFeaturedPets if it's a function
                if (typeof setFeaturedPets === 'function') {
                    setFeaturedPets(response.data);
                }
                // Conditionally call setError if it's a function
                if (typeof setError === 'function') {
                    setError(null); // Clear any previous error
                }
            } catch (err) {
                console.error("Error fetching pets:", err);
                if (typeof setError === 'function') {
                    setError(err.message || "Failed to fetch pets for homepage");
                }
                if (typeof setFeaturedPets === 'function') {
                    setFeaturedPets([]); // Clear pets on error
                }
            } finally {
                if (typeof setIsLoading === 'function') {
                    setIsLoading(false);
                }
            }
        };

        fetchPets(); // Initial fetch

        const interval = setInterval(fetchPets, 10000); // Fetch every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [setFeaturedPets, setIsLoading, setError]);

    return (
        <div>
            {/* Hero Section */}
            <section
                className="relative bg-center bg-cover h-[700px]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(3, 77, 59, 0.4), rgba(3, 77, 59, 0.4)), url(https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
                }}
            >
                <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            Find Your Perfect Companion
                        </h1>
                        <p className="text-xl text-white mb-8 opacity-90 drop-shadow-md">
                            Connect with shelters and rescue organizations to adopt pets in need of loving homes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/pets"
                                className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-8 rounded-md font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Search className="h-5 w-5" />
                                Find a Pet
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-white hover:bg-gray-100 text-gray-800 py-3 px-8 rounded-md font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Heart className="h-5 w-5 text-rose-500" />
                                Start Adopting
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Pets Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Pets Looking for a Home</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Meet some of our adorable pets currently available for adoption. Each one is waiting for their forever home.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                            <p className="ml-4 text-gray-600">Loading pets...</p>
                        </div>
                    ) : error ? (
                        <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</p>
                    ) : featuredPets.length === 0 ? (
                        <p className="text-center text-gray-500">No featured pets available right now.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredPets.slice(0, 6).map(pet => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            to="/pets"
                            className="inline-block bg-amber-500 hover:bg-amber-600 text-white py-3 px-8 rounded-md font-medium text-lg transition-colors"
                        >
                            View All Pets
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our adoption process is designed to be simple and straightforward, connecting loving homes with pets in need.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-teal-100 rounded-full mb-4">
                                <Search className="h-8 w-8 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Search</h3>
                            <p className="text-gray-600">
                                Browse our database of pets from shelters and rescue organizations across the region.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mb-4">
                                <Heart className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect</h3>
                            <p className="text-gray-600">
                                Submit an adoption request for your perfect match and connect with the shelter.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-100">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                                <Home className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Adopt</h3>
                            <p className="text-gray-600">
                                Complete the adoption process and welcome your new companion into your home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-teal-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose PetAdopt</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            We're dedicated to making pet adoption simple, safe, and rewarding for both pets and adopters.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-4 text-teal-600">
                                <PawPrint className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Wide Selection</h3>
                            <p className="text-gray-600">
                                Browse pets from multiple shelters and rescue organizations in one convenient place.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-4 text-teal-600">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Verified Shelters</h3>
                            <p className="text-gray-600">
                                All our partner shelters and rescues are vetted to ensure the highest standards of animal care.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <div className="mb-4 text-teal-600">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Support Community</h3>
                            <p className="text-gray-600">
                                Join our community of pet lovers and get advice from experienced pet owners and professionals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-teal-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Find Your New Best Friend?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Thousands of pets are waiting for their forever homes. Start your adoption journey today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/pets"
                            className="bg-white text-teal-600 hover:bg-gray-100 py-3 px-8 rounded-md font-medium text-lg transition-colors shadow-md"
                        >
                            Browse Pets
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-amber-500 text-white hover:bg-amber-600 py-3 px-8 rounded-md font-medium text-lg transition-colors shadow-md"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
