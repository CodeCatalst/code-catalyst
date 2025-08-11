import { useState, useEffect, useRef } from 'react'
import { Calendar, User, Tag, ArrowRight, Mail } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { useNotices } from '../../context/NoticesContext'
import { useAuth } from '../../context/AuthContext'

const Notices = () => {
  const { notices, setNotices, addSubmission } = useNotices()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const [activeForm, setActiveForm] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [submittedNoticeId, setSubmittedNoticeId] = useState(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/notices')
        setNotices(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setNotices([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleInputChange = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleFormSubmit = (notice) => (e) => {
    e.preventDefault()
    const answers = {}
    if (notice.form && Array.isArray(notice.form.fields)) {
      notice.form.fields.forEach((field) => {
        answers[field.label] = formValues[field.id] || ''
      })
    }
    addSubmission(notice.id, {
      id: 's' + Date.now(),
      name: formValues.name || '',
      email: formValues.email || '',
      answers,
    })
    setSubmittedNoticeId(notice.id)
    setFormValues({})
    setActiveForm(null)
  }

  if (loading) {
    return <LoadingSpinner message="Loading notices..." />
  }

  // Debug: log all notices
  console.log('All notices from backend:', notices);
  // Only show notices where hidden is not true
  const visibleNotices = notices.filter(n => !n.hidden);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Notices</h1>
      {visibleNotices.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-lg font-semibold">
          There are currently no notices available. Please check back soon for updates and announcements!
        </div>
      ) : (
        <div className="space-y-8 max-w-2xl mx-auto">
          {visibleNotices.map((notice) => (
            <div key={notice.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 mb-6 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1 sm:mb-0 tracking-tight">{notice.title}</h2>
                {notice.tags && notice.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notice.tags.map(tag => (
                      <span key={tag} className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{notice.date && formatDate(notice.date)}</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-3 text-base leading-relaxed">{notice.content || notice.description}</p>
              {Array.isArray(notice.images) && notice.images.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {notice.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Notice" className="h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow" />
                  ))}
                </div>
              )}
              {notice.hasForm && (
                <div className="mt-6">
                  {isAuthenticated ? (
                    <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
                      <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2"><Tag className="w-5 h-5" /> Submit your response</h4>
                      {submittedNoticeId === notice.id ? (
                        <div className="text-green-600 dark:text-green-400 font-semibold">Thank you! Your response has been submitted.</div>
                      ) : (
                        <form onSubmit={handleFormSubmit(notice)} className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Name</label>
                              <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
                                value={formValues.name || user?.name || ''}
                                onChange={e => handleInputChange('name', e.target.value)}
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <input
                                type="email"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
                                value={formValues.email || user?.email || ''}
                                onChange={e => handleInputChange('email', e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          {(Array.isArray(notice.form?.fields) ? notice.form.fields : []).map((field, idx) => (
                            <div key={field.id || idx}>
                              <label className="block text-sm font-medium mb-1">{field.label}</label>
                              <input
                                type={field.type || 'text'}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
                                value={formValues[field.id] || ''}
                                onChange={e => handleInputChange(field.id, e.target.value)}
                                required={field.required}
                              />
                            </div>
                          ))}
                          <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition-colors duration-150"
                          >
                            Submit
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-yellow-800 dark:text-yellow-200 text-sm font-medium flex items-center gap-2">
                      <Mail className="w-5 h-5" /> Please log in to submit your response to this notice.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notices
