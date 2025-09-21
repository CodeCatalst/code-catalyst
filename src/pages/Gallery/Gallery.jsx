import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, ExternalLink, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import LoadingSpinner from '../../components/Common/LoadingSpinner'


import { getGallery as fetchGalleryFromApi } from '../../services/gallery'

const Gallery = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

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
    (async () => {
      setLoading(true)
      try {
        const data = await fetchGalleryFromApi();
        setEvents(data);
      } catch (err) {
        setEvents([]);
      }
      setLoading(false);
    })();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }


  if (loading) {
    return <LoadingSpinner />
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
            Event <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Gallery</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Explore the highlights from our workshops, hackathons, networking events, and community gatherings.
          </p>
          {/* Scroll Indicator removed as requested */}
        </div>

        
      </section>

      {/* Events Grid */}
      <section className="section-padding bg-gray-900" id="highlights-section">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/gallery/${event.id}`}
                className="card group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={event.image_url}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                  {event.images && event.images.length > 1 && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                        {event.images.length} photos
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-600 transition-colors">
                    {event.name}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {events.length === 0 && (
        <div className="bg-gray-900 text-center py-12 text-gray-400 text-lg font-semibold">
          No gallery highlights are available at the moment. Please check back later for exciting event moments!
        </div>
      )}
    </div>
  )
}

export default Gallery