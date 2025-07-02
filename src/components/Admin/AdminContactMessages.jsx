import { useEffect, useState } from 'react'
import api from '../../services/api'

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


  if (loading) return <div className="text-gray-300">Loading...</div>
  if (error) return <div className="text-red-400 bg-red-900/40 border border-red-700 rounded p-4 mb-4">{error}</div>

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary-400">Contact Messages</h2>
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
