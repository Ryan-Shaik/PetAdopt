import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark-gray text-light-gray mt-12 py-6"> {/* Use dark-gray bg and light-gray text */}
      <div className="container mx-auto px-4 text-center text-sm"> {/* Adjusted text size */}
        <p>&copy; {new Date().getFullYear()} PetAdopt. All rights reserved.</p>
        {/* Add other links if needed */}
      </div>
    </footer>
  );
};

export default Footer;
