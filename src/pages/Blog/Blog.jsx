import { useState, useEffect, useRef } from 'react'
import { Play, Filter, Calendar, Eye, ArrowRight } from 'lucide-react'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { useBlogs } from '../../context/NoticesContext'

const Blogs = () => {
  const { blogs } = useBlogs()
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const [loading, setLoading] = useState(false)

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
    setFilteredBlogs(
      selectedCategory === 'All'
        ? blogs
        : blogs.filter(blog => blog.category === selectedCategory)
    )
  }, [selectedCategory, blogs])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatViews = (views) => {
    if (!views) return '0'
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (loading) {
    return <LoadingSpinner message="Loading blogs..." />
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
            Blogs <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Code Catalyst</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Explore our written content featuring tutorials, tech talks, event highlights, and student success stories.
          </p>
          <button className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
            onClick={() => {
              const el = document.getElementById('blogs-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="relative z-10">See Latest Blogs</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
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
      {/* Blogs Grid */}
      <section className="section-padding bg-slate-900" id="blogs-section">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="card hover:scale-105 transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Read Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <a href={blog.url || '#'} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 font-bold text-primary-600 text-lg">Read</a>
                  </div>
                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                    {blog.duration || ''}
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>
                  {/* Subtitles Badge */}
                  {blog.hasSubtitles && (
                    <div className="absolute top-3 right-12">
                      <span className="bg-secondary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        CC
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(blog.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{formatViews(blog.views)} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blogs found in this category.</p>
            </div>
          )}
        </div>
      </section>
      {blogs.length === 0 && (
        <div className="bg-gray-900 text-center py-12 text-gray-400 text-lg font-semibold">
          There are no blogs available at the moment. Please check back soon for insightful articles and stories!
        </div>
      )}
    </div>
  )
}

export default Blogs