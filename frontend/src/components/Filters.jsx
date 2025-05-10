import React, { useState } from 'react';

// Component receives onApplyFilters as a prop to communicate selected filters
const Filters = ({ onApplyFilters }) => {
  const [filterCriteria, setFilterCriteria] = useState({
    species: 'Any',
    age: 'Any',
    size: 'Any',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filters.jsx: handleChange - name: ${name}, value: ${value}`);
    setFilterCriteria(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filters.jsx: handleSubmit called. Criteria:", filterCriteria);
    if (onApplyFilters) {
      console.log("Filters.jsx: Calling onApplyFilters prop.");
      onApplyFilters(filterCriteria);
    } else {
      console.error("Filters.jsx: onApplyFilters prop is undefined! Make sure it's passed from the parent component.");
    }
  };
  return (
    <div className="bg-white p-4 rounded shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-secondary border-b pb-2">Filter Pets</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-text">Species</label>
          <select 
            id="species" 
            name="species" 
            value={filterCriteria.species}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="Any">Any</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            {/* Add more species */}
          </select>
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-text">Age</label>
          <select 
            id="age" 
            name="age" 
            value={filterCriteria.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="Any">Any</option>
            <option value="Puppy/Kitten">Puppy/Kitten</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-text">Size</label>
          <select 
            id="size" 
            name="size" 
            value={filterCriteria.size}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="Any">Any</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="X-Large">X-Large</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-text">Location</label>
          <input 
            type="text" 
            id="location" 
            name="location" 
            value={filterCriteria.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
            placeholder="e.g., City or Zip" 
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default Filters;
