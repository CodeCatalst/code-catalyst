import React, { useEffect, useState, useRef } from 'react';
import { Play, Filter, Calendar, Eye, ArrowRight, X } from 'lucide-react';
import { getNotices } from '../../services/notices';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Modal from '../../components/Common/Modal';

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
      return tags.split(',').map(t => t.trim()).filter(Boolean);
    } catch {
      return tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }
  if (typeof tags === 'object') {
    return Object.values(tags).map(t => String(t));
  }
  return [];
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    getNotices()
      .then((response) => {
        // Support both array and object with data field
        const arr = Array.isArray(response)
          ? response
          : (response && Array.isArray(response.data) ? response.data : []);
        setNotices(arr);
        setFiltered(arr);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load notices');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(notices);
    } else {
      setFiltered(
        Array.isArray(notices)
          ? notices.filter((notice) =>
              notice.title?.toLowerCase().includes(search.toLowerCase()) ||
              notice.content?.toLowerCase().includes(search.toLowerCase())
            )
          : []
      );
    }
  }, [search, notices]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  const visibleNotices = Array.isArray(filtered)
    ? filtered.filter((n) => !n.hidden)
    : [];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
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
              {['{ }', '< />', '( )', '[ ]', '<code catalyst />', '&&', '<body />', '<div>'][Math.floor(Math.random() * 8)]}
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
            Stay updated with the latest notices, events, and important announcements.
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
      {/* Search Bar */}
      <div className="py-8 border-b border-gray-700 bg-gray-900">
        <div className="container-max">
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Search notices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
      {/* Notices Grid */}
      <section className="section-padding bg-slate-900" id="notices-section">
        <div className="container-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleNotices.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No notices found.</div>
            ) : (
              visibleNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="relative w-full h-48 flex-shrink-0 rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    {notice.images ? (
                      <img
                        src={notice.images}
                        alt={notice.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-lg">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-5 py-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{notice.title}</h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">{notice.content || notice.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {notice.created_at ? new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${notice.hidden ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{notice.hidden ? 'Hidden' : 'Public'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {parseTags(notice.tags).length > 0 ? (
                        parseTags(notice.tags).map(tag => (
                          <span key={tag} className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">{tag}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      {notices.length === 0 && (
        <div className="bg-gray-900 text-center py-12 text-gray-400 text-lg font-semibold">
          There are no notices available at the moment. Please check back soon for updates and announcements!
        </div>
      )}

      {/* Notice Details Modal */}
      {selectedNotice && (
        <Modal onClose={() => setSelectedNotice(null)}>
          <div className="relative mx-auto w-full max-w-4xl bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden animate-fade-in" style={{ minHeight: '400px' }}>
            {/* Image Side */}
            <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
              {selectedNotice.images ? (
                <img src={selectedNotice.images} alt="Notice" className="rounded-xl object-cover w-full h-[260px] md:h-[400px] max-h-[400px] border-2 border-blue-200 shadow-lg" style={{ maxWidth: '100%', maxHeight: '400px' }} />
              ) : (
                <span className="text-gray-400 text-lg">No Image</span>
              )}
            </div>
            {/* Text Side */}
            <div className="md:w-1/2 w-full flex flex-col p-8 overflow-y-auto" style={{ maxHeight: '500px' }}>
              <button
                className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 text-2xl font-bold bg-white/80 rounded-full px-3 py-1 shadow transition-colors duration-200 z-10"
                onClick={() => setSelectedNotice(null)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-3xl font-extrabold text-blue-700 mb-2 leading-tight drop-shadow">{selectedNotice.title}</h2>
              <p className="text-xs text-gray-500 mb-4">
                {selectedNotice.created_at ? new Date(selectedNotice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>
              <p className="text-gray-800 text-lg mb-4 whitespace-pre-line leading-relaxed font-medium" style={{ wordBreak: 'break-word' }}>{selectedNotice.description || selectedNotice.content}</p>
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {parseTags(selectedNotice.tags).length > 0 ? (
                  parseTags(selectedNotice.tags).map(tag => (
                    <span key={tag} className="inline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold shadow mr-1 mb-1">{tag}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
              </div>
              <span className={`mt-2 inline-block px-4 py-2 rounded-full text-sm font-bold shadow ${selectedNotice.hidden ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{selectedNotice.hidden ? 'Hidden' : 'Public'}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notices;