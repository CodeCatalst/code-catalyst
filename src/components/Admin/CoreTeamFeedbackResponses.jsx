import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const STATUS_OPTIONS = ['pending', 'reviewed', 'resolved'];

const CoreTeamFeedbackResponses = () => {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // For notes editing UX: local state for editing
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNotesId, setSavingNotesId] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await api.get('/core-feedback');
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((n) => ({
          id: n.id,
          name: n.name || n.full_name || 'Unknown',
          email: n.email || 'No email',
          admin_rating: n.admin_rating ?? 'N/A',
          community_rating: n.community_rating ?? 'N/A',
          admin_suggestions: n.admin_suggestions || 'No suggestions provided',
          community_suggestions: n.community_suggestions || 'No suggestions provided',
          status: n.status || 'pending',
          notes: n.notes || '',
          submitted_at: n.submitted_at || n.submittedAt || null
        }));
        setResponses(mapped);
        // Set editingNotes to current notes for all responses
        const notesMap = {};
        mapped.forEach(r => { notesMap[r.id] = r.notes || ''; });
        setEditingNotes(notesMap);
      } catch (err) {
        setError('Failed to fetch feedback responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [user]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/core-feedback/${id}/status`, { status });
      setResponses(responses => responses.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesInputChange = (id, value) => {
    setEditingNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotesSave = async (id) => {
    setSavingNotesId(id);
    try {
      await api.patch(`/core-feedback/${id}/notes`, { notes: editingNotes[id] });
      setResponses(responses => responses.map(r => r.id === id ? { ...r, notes: editingNotes[id] } : r));
    } catch {
      alert('Failed to update notes.');
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/core-feedback/${id}`);
      setResponses(responses => responses.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete feedback.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading feedback responses..." />;
  if (error) return <div className="text-red-400 p-8 text-center">{error}</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center text-primary-400 tracking-tight drop-shadow">Core Team Feedback Responses</h1>
      <p className="text-center text-gray-400 mb-8">Click on any row to view full feedback details</p>
      {responses.length === 0 ? (
        <div className="text-gray-400 text-lg text-center">No feedback responses yet.</div>
      ) : (
        <div className="overflow-x-auto max-w-8xl rounded-2xl shadow-2xl border border-gray-800 bg-gray-900/80">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-gray-800/80">
                <th className="py-3 px-4 text-left text-primary-300">Name</th>
                <th className="py-3 px-4 text-left text-primary-300">Email</th>
                <th className="py-3 px-4 text-left text-primary-300">Admin Rating</th>
                <th className="py-3 px-4 text-left text-primary-300">Community Rating</th>
                <th className="py-3 px-4 text-left text-primary-300">Admin Suggestions</th>
                <th className="py-3 px-4 text-left text-primary-300">Community Suggestions</th>
                <th className="py-3 px-4 text-left text-primary-300">Status</th>
                <th className="py-3 px-4 text-left text-primary-300">Notes</th>
                <th className="py-3 px-4 text-left text-primary-300">Submitted</th>
                <th className="py-3 px-4 text-left text-primary-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {responses.map((resp, idx) => (
                <tr
                  key={resp.id || idx}
                  className="hover:bg-primary-900/30 transition cursor-pointer"
                  onClick={() => setSelectedResponse(resp)}
                >
                  <td className="py-2 px-4 font-semibold text-primary-400">{resp.name}</td>
                  <td className="py-2 px-4">{resp.email}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      resp.admin_rating >= 4 ? 'bg-green-900/50 text-green-300' :
                      resp.admin_rating >= 3 ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}>
                      {resp.admin_rating}/5
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      resp.community_rating >= 4 ? 'bg-green-900/50 text-green-300' :
                      resp.community_rating >= 3 ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}>
                      {resp.community_rating}/5
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-200 max-w-xs">
                    <div className="truncate" title={resp.admin_suggestions}>
                      {resp.admin_suggestions.length > 50 ? resp.admin_suggestions.slice(0, 50) + '...' : resp.admin_suggestions}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-gray-200 max-w-xs">
                    <div className="truncate" title={resp.community_suggestions}>
                      {resp.community_suggestions.length > 50 ? resp.community_suggestions.slice(0, 50) + '...' : resp.community_suggestions}
                    </div>
                  </td>
                  <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={resp.status}
                      onChange={e => handleStatusChange(resp.id, e.target.value)}
                      disabled={updatingId === resp.id}
                      className="rounded bg-gray-800 border border-gray-700 text-primary-200 px-2 py-1 focus:ring-primary-500 text-sm"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingNotes[resp.id] !== undefined ? editingNotes[resp.id] : (resp.notes || '')}
                        onChange={e => handleNotesInputChange(resp.id, e.target.value)}
                        disabled={savingNotesId === resp.id}
                        placeholder="Add notes..."
                        className="rounded bg-gray-800 border border-gray-700 text-primary-100 px-2 py-1 w-32 text-xs focus:ring-primary-500"
                        title={resp.notes || 'No previous notes'}
                      />
                      <button
                        onClick={() => handleNotesSave(resp.id)}
                        disabled={savingNotesId === resp.id || (editingNotes[resp.id] === resp.notes)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded text-xs font-semibold disabled:opacity-60"
                      >
                        {savingNotesId === resp.id ? '...' : 'Save'}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-xs text-gray-400">{resp.submitted_at ? new Date(resp.submitted_at).toLocaleString() : 'N/A'}</td>
                  <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(resp.id)}
                      disabled={deletingId === resp.id}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60"
                    >
                      {deletingId === resp.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal for expanded view */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedResponse.name}</h2>
                <p className="text-gray-400 text-sm">{selectedResponse.email}</p>
              </div>
              <button
                className="text-gray-400 hover:text-white text-2xl font-bold"
                onClick={() => setSelectedResponse(null)}
              >
                ×
              </button>
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Admin Rating</div>
                <div className="text-2xl font-bold text-primary-400">{selectedResponse.admin_rating}/5</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Community Rating</div>
                <div className="text-2xl font-bold text-primary-400">{selectedResponse.community_rating}/5</div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Admin Suggestions</h3>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-200 min-h-[80px]">
                  {selectedResponse.admin_suggestions || 'No suggestions provided'}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Community Suggestions</h3>
                <div className="bg-gray-800 p-4 rounded-lg text-gray-200 min-h-[80px]">
                  {selectedResponse.community_suggestions || 'No suggestions provided'}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Status: <span className="text-white font-medium">{selectedResponse.status}</span></span>
                <span className="text-gray-400 text-xs">
                  {selectedResponse.submitted_at ? new Date(selectedResponse.submitted_at).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoreTeamFeedbackResponses;
