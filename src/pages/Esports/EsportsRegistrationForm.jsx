import React, { useState } from 'react';
import { useToast } from '../hooks/use-toast';
import { createEsportsRegistration } from '../../services/api';

const EsportsRegistrationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gameId: '',
    sport: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.sport) {
      toast({
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      await createEsportsRegistration(formData);
      toast({
        title: "Success",
        description: "Registration submitted successfully!"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gameId: '',
        sport: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit registration"
      });
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Esports Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="13"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your age"
          />
        </div>

        {/* Game ID */}
        <div>
          <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-1">
            Game ID
          </label>
          <input
            type="text"
            id="gameId"
            name="gameId"
            value={formData.gameId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your in-game ID"
          />
        </div>

        {/* Sport Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sport *
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="sport"
                value="Freefire"
                checked={formData.sport === 'Freefire'}
                onChange={handleChange}
                required
                className="mr-2"
              />
              Freefire
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sport"
                value="BGMI"
                checked={formData.sport === 'BGMI'}
                onChange={handleChange}
                required
                className="mr-2"
              />
              BGMI
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default EsportsRegistrationForm;