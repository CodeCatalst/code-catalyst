import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-gray-900 rounded-lg shadow-lg max-w-full max-h-full overflow-auto relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
        aria-label="Close"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
