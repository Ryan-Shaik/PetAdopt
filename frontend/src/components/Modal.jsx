import React from 'react';

// Expect isOpen, onClose, title, children as props
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {/* Optional: Add footer for actions */}
        {/* <div className="flex justify-end p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2">Close</button>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-teal-700">Save</button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;