import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/hooks/use-toast';
import { createEsportsRegistration } from '../../services/api';

const EsportsRegistrationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gameId: '',
    sport: '',
    teamSize: 1,
    teamMembers: []
  });

  // Update team members array when team size changes
  useEffect(() => {
    const currentSize = formData.teamMembers.length;
    const newSize = parseInt(formData.teamSize) || 1;

    if (newSize > currentSize) {
      // Add new members
      const newMembers = Array.from({ length: newSize - currentSize }, () => ({
        name: '',
        gameUserId: '',
        inGameName: ''
      }));
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, ...newMembers]
      }));
    } else if (newSize < currentSize) {
      // Remove members
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.slice(0, newSize)
      }));
    }
  }, [formData.teamSize]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
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

    // Validate team members if team size > 1
    if (formData.teamSize > 1) {
      for (let i = 0; i < formData.teamMembers.length; i++) {
        const member = formData.teamMembers[i];
        if (!member.name || !member.gameUserId || !member.inGameName) {
          toast({
            title: "Error",
            description: `Please fill in all fields for team member ${i + 1}`
          });
          return;
        }
      }
    }

    try {
      const submissionData = {
        ...formData,
        teamMembers: formData.teamSize > 1 ? formData.teamMembers : null
      };

      await createEsportsRegistration(submissionData);
      toast({
        title: "Success",
        description: "Registration submitted successfully!"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        gameId: '',
        sport: '',
        teamSize: 1,
        teamMembers: []
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
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 p-8 rounded-2xl shadow-2xl text-gray-100 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mt-4 mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Esports Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Phone and Game ID Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="gameId" className="block text-sm font-medium text-gray-300 mb-2">
              Game ID
            </label>
            <input
              type="text"
              id="gameId"
              name="gameId"
              value={formData.gameId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
              placeholder="Enter your in-game ID"
            />
          </div>
        </div>

        {/* Sport Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Select Sport *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 ${
              formData.sport === 'Freefire'
                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="sport"
                value="Freefire"
                checked={formData.sport === 'Freefire'}
                onChange={handleChange}
                required
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2"><img src="/freefire.png" alt="" srcset="" /></div>
                <div className="font-semibold text-gray-100">Freefire</div>
                <div className="text-sm text-gray-400">Battle Royale</div>
              </div>
            </label>
            <label className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105 ${
              formData.sport === 'BGMI'
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}>
              <input
                type="radio"
                name="sport"
                value="BGMI"
                checked={formData.sport === 'BGMI'}
                onChange={handleChange}
                required
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-2xl mb-2"><img src="/bgmi.png" alt="" srcset="" /></div>
                <div className="font-semibold text-gray-100">BGMI</div>
                <div className="text-sm text-gray-400">Mobile Gaming</div>
              </div>
            </label>
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Team Members *
          </label>
          <select
            id="teamSize"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-800"
          >
            {[1, 2, 3, 4].map(size => (
              <option key={size} value={size} className="bg-gray-800 text-gray-100">{size} Member{size > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Team Members */}
        {formData.teamSize > 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Team Members
            </h3>
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
                <h4 className="text-lg font-medium text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  Member {index + 1}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
                      placeholder="Enter member name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Game User ID *
                    </label>
                    <input
                      type="text"
                      value={member.gameUserId}
                      onChange={(e) => handleMemberChange(index, 'gameUserId', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
                      placeholder="Enter game user ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      In-Game Name *
                    </label>
                    <input
                      type="text"
                      value={member.inGameName}
                      onChange={(e) => handleMemberChange(index, 'inGameName', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 text-gray-100 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-gray-800"
                      placeholder="Enter in-game name"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rule Book Download */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Esports Rule Book</h3>
                <p className="text-sm text-gray-400">Read the complete rules and regulations before registering</p>
              </div>
            </div>
            <a
              href="https://code-catalyst.pages.dev/esports_rulebook.pdf.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <span>📖</span>
              View Rule Book
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          🚀 Register for Esports
        </button>
      </form>
    </div>
  );
};

export default EsportsRegistrationForm;