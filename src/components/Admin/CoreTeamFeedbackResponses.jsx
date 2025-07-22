
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const CoreTeamFeedbackResponses = () => {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);

 

  useEffect(() => {
    
    const fetchResponses = async () => {
      try {
        const res = await api.get('/core-feedback');
        console.log('API response:', res);
        // Defensive mapping: ensure each response has expected fields
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((n) => ({
          name: n.name || n.full_name || 'Unknown',
          email: n.email || 'No email',
          rating: n.rating ?? 'N/A',
          feedback: n.feedback ?? 'N/A',
          suggestions: n.suggestions ?? 'N/A',
          submitted_at: n.submitted_at || n.submittedAt || null
        }));
        setResponses(mapped);
      } catch (err) {
        console.error('API error:', err);
        setError('Failed to fetch feedback responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [user]);

  if (loading) return <LoadingSpinner message="Loading feedback responses..." />;
  if (error) return <div className="text-red-400 p-8 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Core Team Feedback Responses</h1>
      {responses.length === 0 ? (
        <div className="text-gray-400 text-lg">No feedback responses yet.</div>
      ) : (
        <div className="overflow-x-auto max-w-5xl mx-auto">
          <table className="min-w-full bg-gray-800 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Rating</th>
                <th className="py-3 px-4 text-left">Feedback</th>
                <th className="py-3 px-4 text-left">Suggestions</th>
                <th className="py-3 px-4 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((resp, idx) => (
                <tr key={idx} className="hover:bg-primary-900 cursor-pointer" onClick={() => setSelectedResponse(resp)}>
                  <td className="py-2 px-4 font-semibold text-primary-400">{resp.name}</td>
                  <td className="py-2 px-4">{resp.email}</td>
                  <td className="py-2 px-4">{resp.rating}</td>
                  <td className="py-2 px-4 text-gray-200">{resp.feedback.length > 40 ? resp.feedback.slice(0, 40) + '...' : resp.feedback}</td>
                  <td className="py-2 px-4 text-gray-200">{resp.suggestions.length > 40 ? resp.suggestions.slice(0, 40) + '...' : resp.suggestions}</td>
                  <td className="py-2 px-4 text-xs text-gray-400">{resp.submitted_at ? new Date(resp.submitted_at).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal for expanded view */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              onClick={() => setSelectedResponse(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-primary-400">{selectedResponse.name} ({selectedResponse.email})</h2>
            <div className="mb-2">Rating: <span className="font-bold">{selectedResponse.rating}</span></div>
            <div className="mb-2">Feedback: <span className="text-gray-200">{selectedResponse.feedback}</span></div>
            <div className="mb-2">Suggestions: <span className="text-gray-200">{selectedResponse.suggestions}</span></div>
            <div className="text-xs text-gray-400">Submitted: {selectedResponse.submitted_at ? new Date(selectedResponse.submitted_at).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreTeamFeedbackResponses;
