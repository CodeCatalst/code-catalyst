import React from 'react';
import { Code } from 'react-feather';

const LoadingSpinner = ({ message = 'Loading Code Catalyst...', size = 24 }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
        <Code className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={size} />
      </div>
      <p className="ml-4 text-gray-300 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
