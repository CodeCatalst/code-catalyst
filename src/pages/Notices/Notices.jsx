import { useState, useEffect, useRef } from 'react'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { useNotices } from '../../context/NoticesContext'

const Notices = () => {
  const { notices, addSubmission } = useNotices()
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
        setNotices(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      } catch (error) {
        console.error('Failed to fetch notices:', error)
        // Set mock data for demo
        const mockNotices = [
          {
            id: 1,
            title: 'New Member Registration Open for Spring 2024',
            description: 'We are excited to announce that registration for new members is now open! Join Code Catalyst and be part of our growing tech community. Registration deadline is February 15th, 2024.',
            author: 'Sarah Johnson',
            date: '2024-01-28',
            type: 'Registration',
            priority: 'high',
            details: 'Visit our registration portal and complete the application form. No prior coding experience required - we welcome students from all backgrounds!'
          },
          {
            id: 2,
            title: 'Workshop: React Fundamentals - February 5th',
            description: 'Join us for an intensive React fundamentals workshop. Perfect for beginners looking to learn modern web development.',
            author: 'Alex Chen',
            date: '2024-01-25',
            type: 'Workshop',
            priority: 'medium',
            details: 'Date: February 5th, 2024\nTime: 2:00 PM - 5:00 PM\nLocation: Tech Building, Room 205\nPrerequisites: Basic HTML, CSS, and JavaScript knowledge'
          },
          {
            id: 3,
            title: 'Hackathon 2024: Innovation Challenge',
            description: 'Our annual hackathon is back! 48 hours of coding, innovation, and collaboration. Amazing prizes await the winners.',
            author: 'Maya Patel',
            date: '2024-01-22',
            type: 'Event',
            priority: 'high',
            details: 'Date: March 15-17, 2024\nTheme: Sustainable Technology Solutions\nPrizes: $5000 for first place, $3000 for second, $1000 for third\nTeam size: 2-4 members'
          },
          {
            id: 4,
            title: 'Guest Speaker: AI in Industry - January 30th',
            description: 'Dr. Jennifer Lee from Google AI will be speaking about the current state and future of artificial intelligence in industry applications.',
            author: 'Jordan Smith',
            date: '2024-01-20',
            type: 'Talk',
            priority: 'medium',
            details: 'Date: January 30th, 2024\nTime: 6:00 PM - 7:30 PM\nLocation: Main Auditorium\nQ&A session will follow the presentation'
          },
          {
            id: 5,
            title: 'Office Hours Schedule Update',
            description: 'Updated office hours for Spring 2024 semester. Our team leads will be available for mentoring and project guidance.',
            author: 'Emily Rodriguez',
            date: '2024-01-18',
            type: 'Information',
            priority: 'low',
            details: 'Monday: 2-4 PM (Technical Help)\nWednesday: 3-5 PM (Career Guidance)\nFriday: 1-3 PM (Project Mentoring)\nLocation: Code Catalyst Office, Tech Building Room 301'
          },
          {
            id: 6,
            title: 'Web Development Bootcamp - Applications Open',
            description: 'Applications are now open for our intensive 3-day web development bootcamp. Limited seats available.',
            author: 'David Kim',
            date: '2024-01-15',
            type: 'Bootcamp',
            priority: 'medium',
            details: 'Duration: 3 days intensive\nDates: February 20-22, 2024\nCoverage: HTML, CSS, JavaScript, React, Node.js\nApplication deadline: February 10th, 2024'
          },
          {
            id: 7,
            title: 'Code Review Sessions Starting Soon',
            description: 'New initiative: Weekly code review sessions where experienced developers will review and provide feedback on your projects.',
            author: 'Michael Brown',
            date: '2024-01-12',
            type: 'Initiative',
            priority: 'low',
            details: 'Every Thursday 4:00 PM - 6:00 PM\nBring your code for review and feedback\nGreat opportunity to learn best practices\nAll skill levels welcome'
          },
          {
            id: 8,
            title: 'Partnership with TechCorp for Internships',
            description: 'Exciting news! Code Catalyst has partnered with TechCorp to provide exclusive internship opportunities for our members.',
            author: 'Lisa Wang',
            date: '2024-01-10',
            type: 'Partnership',
            priority: 'high',
            details: 'Internship positions available in:\n- Software Development\n- UI/UX Design\n- Data Analytics\n- DevOps\nApplications open to all active members'
          }
        ]
        setNotices(mockNotices)
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
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}

      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col gap-10 items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
      >
        <div className="container-max text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            Notice <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Board</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Stay updated with the latest announcements, events, and opportunities from Code Catalyst.
          </p>
        </div>

        <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
          onClick={() => {
            const el = document.getElementById('notices-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="relative z-10">See Latest Notices</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="section-padding bg-gray-900" id="notices-section">
        <div className="container-max max-w-4xl">
          <div className="space-y-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`card border-l-4 ${getPriorityIndicator(notice.priority)} hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(notice.type)}`}>
                        <Tag size={14} className="inline mr-1" />
                        {notice.type}
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatRelativeDate(notice.date)}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3 hover:text-primary-600 transition-colors">
                      {notice.title}
                    </h2>

                    <p className="text-gray-400 leading-relaxed mb-4">
                      {notice.description}
                    </p>

                    {notice.details && (
                      <details className="mb-4">
                        <summary className="cursor-pointer font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center">
                          More Details
                          <ArrowRight size={16} className="ml-1 transform transition-transform duration-200" />
                        </summary>
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                          <pre className="text-gray-400 whitespace-pre-wrap font-sans">
                            {notice.details}
                          </pre>
                        </div>
                      </details>
                    )}

                    {notice.hasForm && (
                      <div className="mb-2">
                        <button
                          className="btn-primary mb-2"
                          onClick={() => setActiveForm(activeForm === notice.id ? null : notice.id)}
                        >
                          {activeForm === notice.id ? 'Hide Form' : 'Fill Form'}
                        </button>
                        {activeForm === notice.id && (
                          <form
                            className="bg-gray-800 p-4 rounded-lg mt-2"
                            onSubmit={handleFormSubmit(notice)}
                          >
                            <div className="mb-2">
                              <label className="block mb-1">Name</label>
                              <input
                                className="w-full p-2 rounded bg-gray-900 text-white"
                                value={formValues.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                              />
                            </div>
                            <div className="mb-2">
                              <label className="block mb-1">Email</label>
                              <input
                                type="email"
                                className="w-full p-2 rounded bg-gray-900 text-white"
                                value={formValues.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                              />
                            </div>
                            {notice.form.fields.map((field) => (
                              <div className="mb-2" key={field.id}>
                                <label className="block mb-1">{field.label}</label>
                                <input
                                  className="w-full p-2 rounded bg-gray-900 text-white"
                                  type={field.type === 'email' ? 'email' : 'text'}
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  required={field.required}
                                />
                              </div>
                            ))}
                            <button type="submit" className="btn-primary mt-2">Submit</button>
                            {submittedNoticeId === notice.id && (
                              <div className="mt-2 text-green-400">Form submitted successfully!</div>
                            )}
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700/50 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>Posted by {notice.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(notice.date)}</span>
                    </div>
                  </div>

                  {notice.priority === 'high' && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                      High Priority
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {notices.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-lg font-semibold">
              There are currently no notices available. Please check back soon for updates and announcements!
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      {/* <section className="section-padding bg-gray-50">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Never Miss an Update
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our notifications to get the latest notices delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow input-field"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Notices