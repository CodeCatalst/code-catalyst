import { useState, useEffect, useRef } from 'react'
import { Calendar, ArrowRight, X, ClipboardCheck } from 'lucide-react'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { getNotices } from '../../services/notices'

const Notices = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalNotice, setModalNotice] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
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

  const handleReadClick = async (id) => {
    setModalLoading(true)
    setModalOpen(true)
    try {
      const api = (await import('../../services/api')).default;
      const res = await api.get(`/notices/${id}`);
      setModalNotice(res.data && res.data.success ? res.data.data : null);
    } catch {
      setModalNotice(null)
    } finally {
      setModalLoading(false)
    }
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
      <section className="section-padding bg-slate-900" id="notices-section">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.filter(notice => !notice.hidden).map((notice) => (
              <div
                key={notice.id}
                className="card hover:scale-105 transition-all duration-300 group cursor-pointer"
                onClick={() => handleReadClick(notice.id)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleReadClick(notice.id); }}
              >
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-800 p-6 min-h-[120px] flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                    {notice.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>{formatDate(notice.date || notice.created_at)}</span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm line-clamp-3 px-2 pb-2">
                  {notice.summary || notice.content?.slice(0, 120) || ''}
                </div>
              </div>
            ))}
          </div>
          {notices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No notices found.</p>
            </div>
          )}
        </div>
      </section>
      {/* Notice Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 relative p-0 text-white animate-fade-in flex flex-col overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
              onClick={() => { setModalOpen(false); setModalNotice(null); }}
              aria-label="Close"
            >
              <X size={28} />
            </button>
            {modalLoading ? (
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <LoadingSpinner message="Loading notice..." />
              </div>
            ) : modalNotice ? (
              <>
                <div className="w-full h-full flex flex-col p-6 overflow-y-auto max-h-[400px]">
                  <h2 className="text-2xl font-bold mb-2">{modalNotice.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-400 mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(modalNotice.date || modalNotice.created_at)}</span>
                    </span>
                  </div>
                  {modalNotice.images && (
                    <div className="mb-4 flex justify-center">
                      <img src={modalNotice.images} alt="Notice" className="rounded-lg max-h-48 object-contain" />
                    </div>
                  )}
                  <div className="mb-2 flex flex-wrap gap-2">
                    {Array.isArray(modalNotice.tags) && modalNotice.tags.length > 0 && modalNotice.tags.map(tag => (
                      <span key={tag} className="inline-block bg-blue-900 text-blue-200 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">{tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-200 mb-4 whitespace-pre-line" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {modalNotice.description}
                  </p>
                  {/* Share Button */}
                  <div className="mt-4 border-t border-gray-700 pt-4 flex gap-3">
                    <button
                      className="inline-flex items-center px-4 py-2 bg-primary-700 text-white rounded hover:bg-primary-800 transition-colors text-sm font-semibold"
                      onClick={async () => {
                        const url = `${window.location.origin}/notices/${modalNotice.id}`;
                        await navigator.clipboard.writeText(url);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      title="Copy notice link"
                    >
                      <ClipboardCheck className="mr-2" size={18} /> Copy Link
                    </button>
                  </div>
                </div>
                {/* Copy Link Success Toast */}
                {copySuccess && (
                  <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-green-700 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in">
                    <ClipboardCheck size={20} />
                    Link copied to clipboard!
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[300px] text-center py-12 text-red-500">Notice not found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notices
