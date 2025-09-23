import React from 'react';
import EsportsRegistrationForm from '../../components/EsportsRegistrationForm';

const EsportsRegistration = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Esports Registration
          </h1>
          <p className="text-lg text-gray-600">
            Join our esports community! Register for Freefire or BGMI tournaments.
          </p>
        </div>
        <EsportsRegistrationForm />
      </div>
    </div>
  );
};

export default EsportsRegistration;