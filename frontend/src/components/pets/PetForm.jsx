import React, { useState, useEffect } from 'react';

    // initialData: Optional object with pet data for editing
    // onSubmit: Function to call when form is submitted (receives form data)
    // isLoading: Boolean to disable form during submission
    const PetForm = ({ initialData = null, onSubmit, isLoading = false }) => {
        const [formData, setFormData] = useState({
            name: '',
            species: '',
            breed: '',
            age: '',
            gender: 'Unknown',
            size: '',
            description: '',
            medicalHistory: '',
            adoptionStatus: 'Available',
            imageUrl: '',
        });

        // Populate form if initialData is provided (for editing)
        useEffect(() => {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    species: initialData.species || '',
                    breed: initialData.breed || '',
                    age: initialData.age || '',
                    gender: initialData.gender || 'Unknown',
                    size: initialData.size || '',
                    description: initialData.description || '',
                    medicalHistory: initialData.medicalHistory || '',
                    adoptionStatus: initialData.adoptionStatus || 'Available',
                    imageUrl: initialData.imageUrl || '',
                });
            }
        }, [initialData]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData); // Pass the current form data to the parent handler
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Pet Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm" />
                </div>

                {/* Species */}
                <div>
                    <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">Species *</label>
                    <input type="text" id="species" name="species" value={formData.species} onChange={handleChange} required placeholder="e.g., Dog, Cat, Rabbit"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm" />
                </div>

                {/* Breed */}
                <div>
                    <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                    <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} placeholder="e.g., Golden Retriever, Siamese"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm" />
                </div>

                {/* Age */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input type="text" id="age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., Puppy, Young, 2 years, Senior"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm" />
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm">
                        <option value="Unknown">Unknown</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Size */}
                 <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <select id="size" name="size" value={formData.size} onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm">
                        <option value="">Select Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        <option value="X-Large">X-Large</option>
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Personality, habits, background..."
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm"></textarea>
                </div>

                 {/* Medical History */}
                <div>
                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                    <textarea id="medicalHistory" name="medicalHistory" rows="3" value={formData.medicalHistory} onChange={handleChange} placeholder="Vaccinations, spayed/neutered, known conditions..."
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm"></textarea>
                </div>

                {/* Adoption Status */}
                <div>
                    <label htmlFor="adoptionStatus" className="block text-sm font-medium text-gray-700 mb-1">Adoption Status</label>
                    <select id="adoptionStatus" name="adoptionStatus" value={formData.adoptionStatus} onChange={handleChange} required
                        className="block w-full px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm">
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Adopted">Adopted</option>
                    </select>
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm" />
                    {/* TODO: Implement proper file upload later */}
                    <p className="mt-1 text-xs text-gray-500">Enter the full URL of the pet's image. File upload coming soon.</p>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading}
                    className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Saving...' : (initialData ? 'Update Pet' : 'Add Pet')}
                </button>
            </form>
        );
    };

    export default PetForm;