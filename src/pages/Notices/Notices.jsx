import { useState, useEffect, useRef } from 'react'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { useNotices } from '../../context/NoticesContext'

const Notices = () => {
  const { notices, setNotices, addSubmission } = useNotices()
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
        // Defensive: parse backend notices and map fields for frontend
        const backendNotices = Array.isArray(response.data) ? response.data : [];
        // Minimal mapping: just get title and description from backend
        const mapped = backendNotices.map(n => {
          let content = {};
          try {
            content = typeof n.content === 'string' ? JSON.parse(n.content) : (n.content || {});
          } catch (e) {
            content = {};
          }
          return {
            id: n.id,
            title: n.title,
            description: content.description,
            date: n.created_at,
          };
        });
        setNotices(mapped)
      } catch (error) {
        console.error('Failed to fetch notices:', error)
        setNotices([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const getTypeColor = (type) => {
    const colors = {
      'Registration': 'bg-primary-100 text-primary-800',
      'Workshop': 'bg-secondary-100 text-secondary-800',
      'Event': 'bg-accent-100 text-accent-800',
      'Talk': 'bg-purple-100 text-purple-800',
      'Information': 'bg-gray-100 text-gray-800',
      'Bootcamp': 'bg-green-100 text-green-800',
      'Initiative': 'bg-blue-100 text-blue-800',
      'Partnership': 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityIndicator = (priority) => {
    const colors = {
      'high': 'border-l-red-500',
      'medium': 'border-l-yellow-500',
      'low': 'border-l-green-500'
    }
    return colors[priority] || 'border-l-gray-300'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const handleInputChange = (fieldId, value) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleFormSubmit = (notice) => (e) => {
    e.preventDefault()
    const answers = {}
    notice.form.fields.forEach((field) => {
      answers[field.label] = formValues[field.id] || ''
    })
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Notices</h1>
      {notices.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-lg font-semibold">
          There are currently no notices available. Please check back soon for updates and announcements!
        </div>
      ) : (
        <div className="space-y-8 max-w-2xl mx-auto">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-2">{notice.title}</h2>
              <div className="text-gray-400 mb-2">{notice.date && (new Date(notice.date).toLocaleString())}</div>
              <p className="text-gray-200 whitespace-pre-line">{notice.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notices