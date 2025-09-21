import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, X, ClipboardCheck } from 'lucide-react'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { getNotices } from '../../services/notices'

const Notices = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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
      setLoading(true)
      try {
        const response = await getNotices();
        const noticesArr = Array.isArray(response)
          ? response
          : (response && Array.isArray(response.data) ? response.data : []);
        setNotices(noticesArr);
      } catch {
        setNotices([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }


  if (loading) {
    return <LoadingSpinner message="Loading notices..." />
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col gap-10 items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }} />
        </div>
        {/* Floating Code Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-blue-400/30 font-mono text-lg animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                transform: `translate3d(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px, 0)`
              }}
            >
              {['{ }', '< />', '( )', '[ ]', '<notice />', '&&', '<body />', '<div>'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 container-max text-center py-20 mt-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Notices <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Code Catalyst</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Stay updated with the latest notices, announcements, and important information.
          </p>
          <button className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
            onClick={() => {
              const el = document.getElementById('notices-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="relative z-10">See Latest Notices</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
        </div>
      </section>
      {/* Notices Grid */}
      <section className="py-20 bg-slate-900" id="notices-section">
        <div className="container-max px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Latest Notices</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay informed with important announcements, updates, and community news
            </p>
          </div>

          {notices.filter(notice => !notice.hidden).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No notices yet</h3>
              <p className="text-gray-500">Check back later for updates and announcements.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.filter(notice => !notice.hidden).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="group bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-blue-500/50 hover:-translate-y-1"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar size={16} className="mr-2" />
                        <span>{formatDate(notice.date || notice.created_at)}</span>
                      </div>
                      {Array.isArray(notice.tags) && notice.tags.length > 0 && (
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full font-medium">
                          {notice.tags[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-4 leading-tight flex-grow">
                      {notice.title}
                    </h3>

                    <div className="text-gray-300 text-sm line-clamp-3 leading-relaxed mb-4 flex-grow">
                      {notice.summary || notice.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'Click to read the full notice...'}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300 font-medium">
                        <span>Read full notice</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                      {notice.images && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-1">📎</span>
                          <span>Attachment</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Notices
