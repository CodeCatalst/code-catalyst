import { useEffect, useState, useCallback } from 'react'
import api from '../../services/api'
import * as XLSX from 'xlsx'

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // For notes editing UX: local state for editing
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  // Move fetchMessages outside useEffect so it can be called from Refresh button
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/contact')
      const msgs = res.data.map(msg => ({
        ...msg,
        status: msg.status || 'pending',
        notes: msg.notes || '',
      }));
      setMessages(msgs);
      // Set editingNotes to current notes for all messages
      const notesMap = {};
      msgs.forEach(m => { notesMap[m.id] = m.notes || ''; });
      setEditingNotes(notesMap);
    } catch (err) {
      setError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleNotesInputChange = (id, value) => {
    setEditingNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotesSave = async (id) => {
    setSavingNotesId(id);
    try {
      await api.patch(`/admin/contact/${id}/notes`, { notes: editingNotes[id] });
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, notes: editingNotes[id] } : m));
    } catch {
      alert('Failed to update notes.');
    } finally {
      setSavingNotesId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingStatusId(id);
    try {
      await api.patch(`/admin/contact/${id}/status`, { status });
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status } : m));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/contact/${id}`);
      setMessages(msgs => msgs.filter(m => m.id !== id));
    } catch {
      alert('Failed to delete contact message.');
    } finally {
      setDeletingId(null);
    }
  };

  // Excel download handler
  const handleDownloadExcel = () => {
    const wsData = [
      ['Name', 'Email', 'Subject', 'Message', 'Received At'],
      ...messages.map(msg => [
        msg.name,
        msg.email,
        msg.subject,
        msg.message,
        msg.created_at
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ContactMessages');
    XLSX.writeFile(wb, 'contact_messages.xlsx');
  };

  const openModal = (msg) => setModalMessage(msg);
  const closeModal = () => setModalMessage(null);

  if (loading) return <div className="text-gray-300">Loading...</div>
  if (error) return <div className="text-red-400 bg-red-900/40 border border-red-700 rounded p-4 mb-4">{error}</div>

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-300">Contact Messages</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchMessages}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-60"
            disabled={loading}
            title="Refresh messages"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleDownloadExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
            disabled={messages.length === 0}
          >
            Download Excel
          </button>
        </div>
      </div>
      {messages.length === 0 ? (
        <div className="text-gray-400 text-center">No messages received yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg text-center">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Name</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Email</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Subject</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Received At</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Status</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Notes</th>
                <th className="px-4 py-2 border-b border-gray-700 text-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} className="hover:bg-gray-700 transition-colors" style={{ height: '72px' }}>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100 align-middle text-center">{msg.name}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100 align-middle text-center">{msg.email}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100 align-middle text-center">{msg.subject}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-400 align-middle text-center">{msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</td>
                  <td className="px-4 py-2 border-b border-gray-700 align-middle text-center">
                    <div className="flex justify-center items-center">
                      <select
                        value={msg.status}
                        onChange={e => handleStatusChange(msg.id, e.target.value)}
                        disabled={updatingStatusId === msg.id}
                        className="rounded bg-gray-800 border border-gray-700 text-blue-200 px-2 py-1 focus:ring-blue-500 text-center"
                        style={{ minWidth: '100px' }}
                      >
                        {['pending', 'reviewed', 'resolved'].map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 align-middle text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <textarea
                        value={editingNotes[msg.id] !== undefined ? editingNotes[msg.id] : (msg.notes || '')}
                        onChange={e => handleNotesInputChange(msg.id, e.target.value)}
                        disabled={savingNotesId === msg.id}
                        placeholder={msg.notes || 'Add notes...'}
                        className="rounded bg-gray-800 border border-gray-700 text-white px-2 w-full  resize-y focus:ring-blue-500 text-center"
                        style={{ fontFamily: 'inherit', fontSize: '1rem', minWidth: '120px' }}
                        rows={Math.max(2, (editingNotes[msg.id] || msg.notes || '').split('\n').length)}
                      />
                      <button
                        onClick={() => handleNotesSave(msg.id)}
                        disabled={savingNotesId === msg.id || (editingNotes[msg.id] === msg.notes)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-60 mt-1 mx-auto"
                        style={{ minWidth: '70px' }}
                      >
                        {savingNotesId === msg.id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 align-middle text-center">
                    <div className="flex gap-2 justify-center items-center h-full" style={{ minHeight: '56px' }}>
                      <button
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => openModal(msg)}
                        title="View Full Message"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        disabled={deletingId === msg.id}
                        className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60"
                      >
                        {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for full message details */}
      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="p-6 max-w-lg w-full bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-700 mx-auto flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold mb-3 text-blue-300 text-center">{modalMessage.name} - {modalMessage.subject}</h3>
            <div className="mb-2 text-center"><b className="text-blue-200">Email:</b> {modalMessage.email}</div>
            <div className="mb-2 text-center"><b className="text-blue-200">Received:</b> {modalMessage.created_at ? new Date(modalMessage.created_at).toLocaleString() : ''}</div>
            <div className="mb-2 text-center"><b className="text-blue-200">Status:</b> {modalMessage.status || 'pending'}</div>
            <div className="mb-2 w-full flex flex-col items-center justify-center"><b className="text-blue-200 text-center">Message:</b>
              <pre className="whitespace-pre-wrap break-words bg-gray-800 p-2 rounded mt-1 text-white max-h-64 overflow-y-auto w-full max-w-full text-center">{modalMessage.message}</pre>
            </div>
            <div className="mb-2 w-full flex flex-col items-center justify-center"><b className="text-blue-200 text-center">Notes:</b>
              <pre className="whitespace-pre-wrap break-words bg-gray-800 p-2 rounded mt-1 text-white max-h-32 overflow-y-auto w-full max-w-full text-center">{modalMessage.notes || 'No notes added.'}</pre>
            </div>
            <button onClick={closeModal} className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded shadow mx-auto">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminContactMessages
