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
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Sem/Year</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">About</th>
                <th className="px-4 py-2">CV</th>
                <th className="px-4 py-2">Submitted</th>
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
                    <td className="px-4 py-2">{req.phone}</td>
                    <td className="px-4 py-2">{req.email}</td>
                    <td className="px-4 py-2">{req.course}</td>
                    <td className="px-4 py-2">{req.sem_year || req.semYear}</td>
                    <td className="px-4 py-2">{req.position}</td>
                    <td className="px-4 py-2 max-w-[120px] truncate">
                      {req.about?.length > 40 ? (
                        <>
                          {req.about.slice(0, 40)}...{' '}
                          <button className="text-blue-400 underline text-xs" onClick={() => openModal(req)}>View</button>
                        </>
                      ) : req.about}
                    </td>
                    <td className="px-4 py-2"><a href={req.cv_link || req.cv} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">CV</a></td>
                    <td className="px-4 py-2">{req.submitted_at ? new Date(req.submitted_at).toLocaleString() : ''}</td>
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
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingNotes[req.id] !== undefined ? editingNotes[req.id] : (req.notes || '')}
                          onChange={e => handleNotesInputChange(req.id, e.target.value)}
                          disabled={savingNotesId === req.id}
                          placeholder={req.notes || 'Add notes...'}
                          className="rounded bg-gray-800 border border-gray-700 text-primary-100 px-2 py-1 w-32 focus:ring-primary-500"
                          title={req.notes || 'No previous notes'}
                        />
                        <button
                          onClick={() => handleNotesSave(req.id)}
                          disabled={savingNotesId === req.id || (editingNotes[req.id] === req.notes)}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded text-xs font-semibold disabled:opacity-60"
                        >
                          {savingNotesId === req.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2">
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
          <div className="p-4 max-w-lg">
            <h3 className="text-xl font-bold mb-2">{modalRequest.name} - {modalRequest.position}</h3>
            <div className="mb-2"><b>Email:</b> {modalRequest.email}</div>
            <div className="mb-2"><b>Phone:</b> {modalRequest.phone}</div>
            <div className="mb-2"><b>Course:</b> {modalRequest.course}</div>
            <div className="mb-2"><b>Sem/Year:</b> {modalRequest.sem_year || modalRequest.semYear}</div>
            <div className="mb-2"><b>About:</b> <pre className="whitespace-pre-wrap bg-gray-800 p-2 rounded mt-1">{modalRequest.about}</pre></div>
            <div className="mb-2"><b>CV:</b> <a href={modalRequest.cv_link || modalRequest.cv} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View CV</a></div>
            <div className="mb-2"><b>Status:</b> {modalRequest.status || 'pending'}</div>
            <div className="mb-2"><b>Notes:</b> <pre className="whitespace-pre-wrap bg-gray-800 p-2 rounded mt-1">{modalRequest.notes}</pre></div>
            <div className="mb-2"><b>Submitted:</b> {modalRequest.submitted_at ? new Date(modalRequest.submitted_at).toLocaleString() : ''}</div>
            <button onClick={closeModal} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminHiringRequests;
