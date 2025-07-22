import { useState } from 'react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'

const CoreTeamFeedback = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ rating: '', feedback: '', suggestions: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!user?.full_name || !user?.email) {
      setError('Your name or email is missing. Please log in again or contact support.');
      return;
    }
    setLoading(true)
    try {
      await api.post('/core-feedback', {
        name: user.full_name,
        email: user.email,
        rating: form.rating,
        feedback: form.feedback,
        suggestions: form.suggestions
      })
      setSuccess(true)
      setForm({ rating: '', feedback: '', suggestions: '' })
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Core Team Feedback</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow space-y-6">
        <div className="mb-4">
          <span className="text-lg block mb-2">Your Rating</span>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          >
            <option value="">Select rating</option>
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3">Average</option>
            <option value="2">Below Average</option>
            <option value="1">Poor</option>
          </select>
        </div>
        <div className="mb-4">
          <span className="text-lg block mb-2">Feedback</span>
          <textarea
            name="suggestions"
            value={form.suggestions}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={5}
            placeholder="Share your feedback..."
            required
          />
        </div>
        <div className="mb-4">
          <span className="text-lg block mb-2">Suggestions</span>
          <textarea
            name="suggestions"
            value={form.suggestions}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            rows={5}
            placeholder="Share your suggestions or comments..."
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
        {success && <div className="mt-4 text-green-400">Feedback submitted successfully!</div>}
        {error && <div className="mt-4 text-red-400">{error}</div>}
      </form>
    </div>
  )
}

export default CoreTeamFeedback
