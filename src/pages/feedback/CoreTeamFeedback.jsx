import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CoreTeamFeedback = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    admin_rating: 5,
    community_rating: 5,
    admin_suggestions: '',
    community_suggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    if (!user?.full_name || !user?.email) {
      setSubmitStatus({ success: false, message: 'User info missing. Please re-login.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/core-feedback', {
        name: user.full_name,
        email: user.email,
        ...formData
      });
      setSubmitStatus({
        success: true,
        message: 'Feedback submitted successfully!',
        data: response.data.entry
      });
      setFormData({ admin_rating: 5, community_rating: 5, admin_suggestions: '', community_suggestions: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit feedback';
      setSubmitStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your <span className="text-primary-400">Feedback</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Help us improve Code Catalyst by sharing your thoughts about our community and administration
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Core Team Feedback</h2>
            <p className="text-slate-400">Your feedback helps us grow and improve</p>
          </div>

          {/* Status Message */}
          {submitStatus.message && (
            <div className={`mb-8 p-4 rounded-xl font-semibold text-center shadow-lg transition-all ${
              submitStatus.success
                ? 'bg-green-900/20 text-green-300 border border-green-700/50'
                : 'bg-red-900/20 text-red-300 border border-red-700/50'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* User Info Section */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    disabled
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 p-4 cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 p-4 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Ratings Section */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Rate Your Experience
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="admin_rating" className="block text-sm font-medium text-slate-300">
                    How satisfied are you with Community admins? <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="admin_rating"
                    name="admin_rating"
                    value={formData.admin_rating}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-slate-500"
                  >
                    <option value="" disabled>Select rating</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num} className="bg-slate-800 text-white">
                        {num} {num === 1 ? '⭐ - Very Dissatisfied' : num === 2 ? '⭐⭐ - Dissatisfied' : num === 3 ? '⭐⭐⭐ - Neutral' : num === 4 ? '⭐⭐⭐⭐ - Satisfied' : '⭐⭐⭐⭐⭐ - Very Satisfied'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label htmlFor="community_rating" className="block text-sm font-medium text-slate-300">
                    How satisfied are you with the Community overall? <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="community_rating"
                    name="community_rating"
                    value={formData.community_rating}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-slate-500"
                  >
                    <option value="" disabled>Select rating</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num} className="bg-slate-800 text-white">
                        {num} {num === 1 ? '⭐ - Very Dissatisfied' : num === 2 ? '⭐⭐ - Dissatisfied' : num === 3 ? '⭐⭐⭐ - Neutral' : num === 4 ? '⭐⭐⭐⭐ - Satisfied' : '⭐⭐⭐⭐⭐ - Very Satisfied'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Suggestions Section */}
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Share Your Suggestions
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="admin_suggestions" className="block text-sm font-medium text-slate-300">
                    Suggestions for Admins or specific admin improvements <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="admin_suggestions"
                    name="admin_suggestions"
                    rows={5}
                    value={formData.admin_suggestions}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-slate-500 resize-vertical"
                    placeholder="What can the admins do better? Any specific suggestions for particular admins?"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="community_suggestions" className="block text-sm font-medium text-slate-300">
                    Suggestions for community development <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="community_suggestions"
                    name="community_suggestions"
                    rows={5}
                    value={formData.community_suggestions}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-600 bg-slate-800 text-white p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-slate-500 resize-vertical"
                    placeholder="How can we improve the community? What events, features, or changes would you like to see?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl ${
                  isSubmitting
                    ? 'bg-slate-600 text-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                    Submitting Feedback...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🚀</span>
                    Submit Feedback
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoreTeamFeedback;