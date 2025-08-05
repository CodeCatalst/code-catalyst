import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CoreTeamFeedback = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: '',
    suggestions: ''
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
      setFormData({ rating: 5, feedback: '', suggestions: '' });
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
    <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-primary-400 tracking-tight drop-shadow">Core Team Feedback</h2>
      {submitStatus.message && (
        <div className={`mb-6 p-4 rounded-lg font-semibold text-center shadow transition-all ${submitStatus.success ? 'bg-green-700/20 text-green-300 border border-green-500' : 'bg-red-700/20 text-red-300 border border-red-500'}`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-300 mb-1">Name</label>
          <input type="text" value={user?.full_name || ''} disabled className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-primary-200 p-2 cursor-not-allowed focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-300 mb-1">Email</label>
          <input type="email" value={user?.email || ''} disabled className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-primary-200 p-2 cursor-not-allowed focus:outline-none" />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-primary-300 mb-1">Rating (1-5) *</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-primary-100 p-2 focus:ring-2 focus:ring-primary-500"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-primary-300 mb-1">Feedback *</label>
          <textarea
            id="feedback"
            name="feedback"
            rows={3}
            value={formData.feedback}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-primary-100 p-2 focus:ring-2 focus:ring-primary-500"
            placeholder="Share your feedback..."
          />
        </div>
        <div>
          <label htmlFor="suggestions" className="block text-sm font-medium text-primary-300 mb-1">Suggestions for Improvement *</label>
          <textarea
            id="suggestions"
            name="suggestions"
            rows={3}
            value={formData.suggestions}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-primary-100 p-2 focus:ring-2 focus:ring-primary-500"
            placeholder="Share your suggestions..."
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 rounded-lg shadow font-semibold text-base transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${isSubmitting ? 'bg-primary-400/60 text-primary-100 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CoreTeamFeedback;