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

  if (loading) return <div className="text-gray-300">Loading...</div>
  if (error) return <div className="text-red-400 bg-red-900/40 border border-red-700 rounded p-4 mb-4">{error}</div>

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-400">Contact Messages</h2>
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
        <div className="text-gray-400">No messages received yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Name</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Email</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Subject</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Message</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Received At</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Status</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Notes</th>
                <th className="px-4 py-2 border-b border-gray-700 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">{msg.name}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">{msg.email}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100">{msg.subject}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-100 max-w-xs break-words">{msg.message}</td>
                  <td className="px-4 py-2 border-b border-gray-700 text-gray-400">{msg.created_at}</td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    <select
                      value={msg.status}
                      onChange={e => handleStatusChange(msg.id, e.target.value)}
                      disabled={updatingStatusId === msg.id}
                      className="rounded bg-gray-800 border border-gray-700 text-primary-200 px-2 py-1 focus:ring-primary-500"
                    >
                      {['pending', 'reviewed', 'resolved'].map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingNotes[msg.id] !== undefined ? editingNotes[msg.id] : (msg.notes || '')}
                        onChange={e => handleNotesInputChange(msg.id, e.target.value)}
                        disabled={savingNotesId === msg.id}
                        placeholder={msg.notes || 'Add notes...'}
                        className="rounded bg-gray-800 border border-gray-700 text-primary-100 px-2 py-1 w-36 focus:ring-primary-500"
                        title={msg.notes || 'No previous notes'}
                      />
                      <button
                        onClick={() => handleNotesSave(msg.id)}
                        disabled={savingNotesId === msg.id || (editingNotes[msg.id] === msg.notes)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-2 py-1 rounded text-xs font-semibold disabled:opacity-60"
                      >
                        {savingNotesId === msg.id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded shadow text-xs font-semibold disabled:opacity-60"
                    >
                      {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminContactMessages
