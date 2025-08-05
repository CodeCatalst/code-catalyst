import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_OPTIONS = ['pending', 'reviewed', 'resolved'];

const CoreTeamFeedbackResponses = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/core-feedback');
      setFeedbacks(res.data);
    } catch (err) {
      setError('Failed to load feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/core-feedback/${id}/status`, { status });
      setFeedbacks(fbs => fbs.map(fb => fb.id === id ? { ...fb, status } : fb));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/core-feedback/${id}`);
      setFeedbacks(fbs => fbs.filter(fb => fb.id !== id));
    } catch {
      alert('Failed to delete feedback.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-primary-400 text-center">Core Team Feedback Responses</h2>
      {loading ? (
        <div className="text-center text-primary-300">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center text-gray-400">No feedback responses yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Email</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Rating</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Feedback</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Suggestions</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-primary-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {feedbacks.map(fb => (
                <tr key={fb.id} className="hover:bg-gray-800/60 transition">
                  <td className="px-4 py-2 text-primary-100">{fb.name}</td>
                  <td className="px-4 py-2 text-primary-100">{fb.email}</td>
                  <td className="px-4 py-2 text-primary-100">{fb.rating}</td>
                  <td className="px-4 py-2 text-primary-100 max-w-xs break-words">{fb.feedback}</td>
                  <td className="px-4 py-2 text-primary-100 max-w-xs break-words">{fb.suggestions}</td>
                  <td className="px-4 py-2">
                    <select
                      value={fb.status || 'pending'}
                      onChange={e => handleStatusChange(fb.id, e.target.value)}
                      disabled={updatingId === fb.id}
                      className="rounded bg-gray-800 border border-gray-700 text-primary-200 px-2 py-1 focus:ring-primary-500"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(fb.id)}
                      disabled={deletingId === fb.id}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60"
                    >
                      {deletingId === fb.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoreTeamFeedbackResponses;
