// eslint-disable-next-line no-undef
const API_URL = import.meta.env.VITE_API_BASE;
import { useEffect, useState } from 'react';
// Add xlsx for Excel export
import * as XLSX from 'xlsx';
import Modal from '../Common/Modal'; // You may need to create this if not present

const AdminHiringRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [modalRequest, setModalRequest] = useState(null);

  // Fetch requests (refactored for refresh)
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/hiring`);
      if (!res.ok) throw new Error('Failed to fetch hiring requests');
      const data = await res.json();
      setRequests(data.requests || []);
      // Set editingNotes to current notes for all requests
      const notesMap = {};
      (data.requests || []).forEach(r => { notesMap[r.id] = r.notes || ''; });
      setEditingNotes(notesMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // Notes editing
  const handleNotesInputChange = (id, value) => {
    setEditingNotes(prev => ({ ...prev, [id]: value }));
  };
  const handleNotesSave = async (id) => {
    setSavingNotesId(id);
    try {
      await fetch(`${API_URL}/api/hiring/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: editingNotes[id] })
      });
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, notes: editingNotes[id] } : r));
    } catch {
      alert('Failed to update notes.');
    } finally {
      setSavingNotesId(null);
    }
  };

  // Status editing
  const handleStatusChange = async (id, status) => {
    setUpdatingStatusId(id);
    try {
      await fetch(`${API_URL}/api/hiring/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hiring request?')) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/hiring/${id}`, { method: 'DELETE' });
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete request.');
    } finally {
      setDeletingId(null);
    }
  };

  // Modal for full details
  const openModal = (req) => setModalRequest(req);
  const closeModal = () => setModalRequest(null);

  // Excel download handler
  const handleDownloadExcel = () => {
    // Prepare worksheet data
    const wsData = [
      [
        'Name', 'Phone', 'Email', 'Course', 'Sem/Year', 'Position', 'About', 'CV', 'Submitted'
      ],
      ...requests.map(req => [
        req.name,
        req.phone,
        req.email,
        req.course,
        req.sem_year || req.semYear,
        req.position,
        req.about,
        req.cv_link || req.cv,
        req.submitted_at ? new Date(req.submitted_at).toLocaleString() : ''
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HiringRequests');
    XLSX.writeFile(wb, 'hiring_requests.xlsx');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Hiring Requests</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchRequests}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-60"
            disabled={loading}
            title="Refresh requests"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleDownloadExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            disabled={requests.length === 0}
          >
            Download Excel
          </button>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto max-h-[420px] min-h-[320px] border border-gray-700 rounded-lg">
          <table className="min-w-full bg-gray-900 text-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-4">No hiring requests found.</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-700">
                    <td className="px-4 py-2">{req.name}</td>
                    <td className="px-4 py-2">{req.email}</td>
                    <td className="px-4 py-2">{req.position}</td>
                    <td className="px-4 py-2">
                      <select
                        value={req.status || 'pending'}
                        onChange={e => handleStatusChange(req.id, e.target.value)}
                        disabled={updatingStatusId === req.id}
                        className="rounded bg-gray-800 border border-gray-700 text-primary-200 px-2 py-1 focus:ring-primary-500"
                      >
                        {['pending', 'reviewed', 'rejected', 'accepted'].map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => openModal(req)}
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        disabled={deletingId === req.id}
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60"
                      >
                        {deletingId === req.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for full details */}
      {modalRequest && (
        <Modal onClose={closeModal}>
          <div className="max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 border-b border-gray-200 pb-2">{modalRequest.name} <span className="text-base font-medium text-gray-500">({modalRequest.position})</span></h3>
            <div className="space-y-3">
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Email:</span> <span className="text-gray-900">{modalRequest.email}</span></div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Phone:</span> <span className="text-gray-900">{modalRequest.phone}</span></div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Course:</span> <span className="text-gray-900">{modalRequest.course}</span></div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Sem/Year:</span> <span className="text-gray-900">{modalRequest.sem_year || modalRequest.semYear}</span></div>
              <div>
                <div className="font-semibold text-gray-600 mb-1">About:</div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 whitespace-pre-wrap text-sm max-h-40 overflow-auto">{modalRequest.about}</div>
              </div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">CV:</span> <a href={modalRequest.cv_link || modalRequest.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">View CV</a></div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Status:</span> <span className="text-gray-900 capitalize">{modalRequest.status || 'pending'}</span></div>
              <div>
                <div className="font-semibold text-gray-600 mb-1">Notes:</div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 whitespace-pre-wrap text-sm max-h-32 overflow-auto">{modalRequest.notes}</div>
              </div>
              <div className="flex items-center"><span className="w-28 font-semibold text-gray-600">Submitted:</span> <span className="text-gray-900">{modalRequest.submitted_at ? new Date(modalRequest.submitted_at).toLocaleString() : ''}</span></div>
            </div>
            <button onClick={closeModal} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition-colors duration-150">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminHiringRequests;
