import { useEffect, useState } from 'react'
import api from '../../services/api'
import * as XLSX from 'xlsx'

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/admin/contact')
        setMessages(res.data)
      } catch (err) {
        setError('Failed to load contact messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

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
        <button
          onClick={handleDownloadExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          disabled={messages.length === 0}
        >
          Download Excel
        </button>
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
