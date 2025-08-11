import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 animate-fadeIn">
    <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-lg w-full mx-4 p-0 overflow-hidden animate-modalPop">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 transition-colors duration-200 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full bg-white p-1 shadow hover:shadow-md"
        aria-label="Close"
        tabIndex={0}
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="p-8 sm:p-10 bg-white">
        {children}
      </div>
    </div>
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease;
      }
      @keyframes modalPop {
        from { transform: translateY(40px) scale(0.98); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      .animate-modalPop {
        animation: modalPop 0.25s cubic-bezier(.4,2,.6,1);
      }
    `}</style>
  </div>
);

export default Modal;
