import { useState, useEffect, useRef } from 'react'
import { Play, Filter, Calendar, Eye, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'

const Vlogs = () => {
  const [vlogs, setVlogs] = useState([])
  const [filteredVlogs, setFilteredVlogs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const categories = ['All', 'Tech Talks', 'Events', 'Tutorials', 'Behind the Scenes', 'Student Stories']


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
    const fetchVlogs = async () => {
      try {
        const response = await api.get('/vlogs')
        setVlogs(response.data)
        setFilteredVlogs(response.data)
      } catch (error) {
        console.error('Failed to fetch vlogs:', error)
        // Set mock data for demo
        const mockVlogs = [
          {
            id: 1,
            title: 'Code Catalyst: Behind the Scenes',
            description: 'Get an exclusive look at how Code Catalyst organizes events and builds the tech community on campus.',
            category: 'Behind the Scenes',
            thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '12:45',
            views: 1250,
            publishedAt: '2024-01-15',
            hasSubtitles: true
          },
          {
            id: 2,
            title: 'Student Success Stories: From Novice to Developer',
            description: 'Meet Sarah and Alex as they share their journey from complete beginners to landing internships at top tech companies.',
            category: 'Student Stories',
            thumbnail: 'https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '18:32',
            views: 2150,
            publishedAt: '2024-01-10',
            hasSubtitles: true
          },
          {
            id: 3,
            title: 'React Fundamentals: Building Your First App',
            description: 'Learn the basics of React by building a simple todo application from scratch.',
            category: 'Tutorials',
            thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '25:18',
            views: 3420,
            publishedAt: '2024-01-08',
            hasSubtitles: false
          },
          {
            id: 4,
            title: 'Annual Hackathon 2024 Highlights',
            description: 'Relive the excitement of our biggest hackathon yet with 120+ participants and amazing innovations.',
            category: 'Events',
            thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '15:22',
            views: 1850,
            publishedAt: '2024-01-22',
            hasSubtitles: true
          },
          {
            id: 5,
            title: 'AI in 2024: Industry Expert Panel Discussion',
            description: 'Leading AI researchers and industry professionals discuss the future of artificial intelligence.',
            category: 'Tech Talks',
            thumbnail: 'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '45:15',
            views: 4200,
            publishedAt: '2024-01-16',
            hasSubtitles: true
          },
          {
            id: 6,
            title: 'Git and GitHub for Beginners',
            description: 'Master version control with Git and learn how to collaborate on projects using GitHub.',
            category: 'Tutorials',
            thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '22:40',
            views: 2890,
            publishedAt: '2024-01-05',
            hasSubtitles: false
          }
        ]
        setVlogs(mockVlogs)
        setFilteredVlogs(mockVlogs)
      } finally {
        setLoading(false)
      }
    }

    fetchVlogs()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredVlogs(vlogs)
    } else {
      setFilteredVlogs(vlogs.filter(vlog => vlog.category === selectedCategory))
    }
  }, [selectedCategory, vlogs])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (loading) {
    return <LoadingSpinner message="Loading vlogs..." />
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
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

        <section className="section-padding text-white">
          <div className="container-max text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Code Catalyst <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Vlogs</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Explore our video content featuring tutorials, tech talks, event highlights, and student success stories.
            </p>
          </div>
        </section>

        <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
          onClick={() => {
            const el = document.getElementById('vlogs-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="relative z-10">See Latest Vlogs</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
        </button>


        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 border-b border-gray-700 bg-gray-900">
        <div className="container-max">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Filter size={20} className="text-gray-400 flex-shrink-0" />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-950/50 border border-gray-700/50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vlogs Grid */}
      <section className="section-padding" id="vlogs-section">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVlogs.map((vlog) => (
              <div key={vlog.id} className="card hover:scale-105 transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={vlog.thumbnail}
                    alt={vlog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="text-primary-600 ml-1" size={24} />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                    {vlog.duration}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {vlog.category}
                    </span>
                  </div>

                  {/* Subtitles Badge */}
                  {vlog.hasSubtitles && (
                    <div className="absolute top-3 right-12">
                      <span className="bg-secondary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        CC
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {vlog.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-3">
                    {vlog.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(vlog.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{formatViews(vlog.views)} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No vlogs found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Playlist Section
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured <span className="text-gradient">Playlists</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Curated collections of our best content organized by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:scale-105 transition-transform">
              <div className="w-full h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg mb-4 flex items-center justify-center">
                <Play className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Complete Web Development</h3>
              <p className="text-gray-400 text-sm mb-3">12 videos • 4 hours</p>
              <p className="text-gray-400">Learn web development from basics to advanced concepts</p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-full h-32 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg mb-4 flex items-center justify-center">
                <Play className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Event Highlights</h3>
              <p className="text-gray-400 text-sm mb-3">8 videos • 2 hours</p>
              <p className="text-gray-400">Best moments from our workshops and hackathons</p>
            </div>

            <div className="card hover:scale-105 transition-transform">
              <div className="w-full h-32 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-lg mb-4 flex items-center justify-center">
                <Play className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Career Success</h3>
              <p className="text-gray-400 text-sm mb-3">6 videos • 3 hours</p>
              <p className="text-gray-400">Tips and stories from successful alumni</p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  )
}

export default Vlogs