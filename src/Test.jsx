import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Users, Video, Bell, Code, Zap, Rocket, Star, Play, ChevronDown, Github, ExternalLink, TrendingUp, Award, BookOpen, Coffee } from 'lucide-react'
import api from './services/api'
import LoadingSpinner from './components/Common/LoadingSpinner'

const Test = () => {
  const [latestContent, setLatestContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [typedText, setTypedText] = useState('')
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  const techWords = ['Innovation', 'Collaboration', 'Excellence', 'Growth', 'Community']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const response = await api.get('/latest')
        setLatestContent(response.data)
        setError(null)
      } catch (error) {
        // Removed: // Check if it's a backend unavailable error
        if (error.message === 'BACKEND_UNAVAILABLE') {
          // Removed: console.info('Backend server not available, using demo content')
          setError('Running in demo mode - backend server not connected.')
        } else {
          // Removed: console.error('Failed to fetch latest content:', error)
          setError('Unable to load content. Showing demo content.')
        }

        // Set mock data for demo when API is not available
        setLatestContent({
          events: [
            { id: 1, title: 'AI Workshop 2024', date: '2024-01-15', image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400', attendees: 85 },
            { id: 2, title: 'Hackathon Weekend', date: '2024-01-20', image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400', attendees: 120 },
            { id: 3, title: 'React Bootcamp', date: '2024-01-25', image: 'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=400', attendees: 45 },
          ],
          notices: [
            { id: 1, title: 'New Member Registration Open', date: '2024-01-10', priority: 'high' },
            { id: 2, title: 'Workshop: React Fundamentals', date: '2024-01-12', priority: 'medium' },
            { id: 3, title: 'Industry Networking Night', date: '2024-01-14', priority: 'low' },
          ],
          blogs: [
            { id: 1, title: 'Behind the Scenes: Code Catalyst', thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400', views: 1250 },
            { id: 2, title: 'Student Success Stories', thumbnail: 'https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=400', views: 2150 },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLatestContent()
  }, [])

  // Mouse tracking for parallax effects
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

  // Typing animation effect
  useEffect(() => {
    const currentWord = techWords[currentWordIndex]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex <= currentWord.length) {
        setTypedText(currentWord.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % techWords.length)
        }, 2000)
      }
    }, 150)

    return () => clearInterval(typeInterval)
  }, [currentWordIndex])

  // Auto-slide for featured content
  useEffect(() => {
    if (latestContent?.events?.length > 0) {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % latestContent.events.length)
      }, 4000)
      return () => clearInterval(slideInterval)
    }
  }, [latestContent])

  const features = [
    {
      icon: Code,
      title: 'Hands-on Workshops',
      description: 'Learn cutting-edge technologies through practical, project-based workshops led by industry experts.',
      color: 'from-blue-500 to-cyan-500',
      stats: '50+ workshops annually'
    },
    {
      icon: Users,
      title: 'Vibrant Community',
      description: 'Connect with like-minded students, share ideas, and collaborate on exciting projects.',
      color: 'from-purple-500 to-pink-500',
      stats: '1000+ active members'
    },
    {
      icon: Rocket,
      title: 'Career Acceleration',
      description: 'Get mentorship, internship opportunities, and career guidance from our industry partners.',
      color: 'from-green-500 to-emerald-500',
      stats: '95% job placement rate'
    },
    {
      icon: Star,
      title: 'Innovation Hub',
      description: 'Access our state-of-the-art lab and resources to bring your innovative ideas to life.',
      color: 'from-orange-500 to-red-500',
      stats: '25+ startup projects'
    }
  ]

  const achievements = [
    { icon: Award, label: 'Best Student Org', value: '2023' },
    { icon: TrendingUp, label: 'Growth Rate', value: '300%' },
    { icon: BookOpen, label: 'Courses Offered', value: '15+' },
    { icon: Coffee, label: 'Coffee Consumed', value: '∞' }
  ]

  if (loading) {
    return <LoadingSpinner message="Loading latest content..." />
  }

  return (
    <div className="min-h-screen overflow-hidden">

      {/* Hero Section with Advanced Animations */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-purple-900 to-slate-900 text-white overflow-hidden"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 60% 40%, rgba(99,102,241,0.15) 0%, transparent 70%), linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
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

        {/* Main Hero Content */}
        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Animated Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-2xl">
                  <Code className="text-white" size={40} />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-0 hover:opacity-50 transition-opacity duration-500 blur-xl" />
              </div>
            </div>

            {/* Dynamic Title with Typing Effect */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">Welcome to</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                  Code Catalyst
                </span>
              </h1>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-300">
                Empowering{' '}
                <span className="inline-block min-w-[200px] text-left">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {typedText}
                  </span>
                  <span className="animate-pulse">|</span>
                </span>
              </div>
            </div>

            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join our community of passionate developers, innovators, and tech enthusiasts.
              Build the future, one line of code at a time.
            </p>

            {/* Interactive CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link
                to="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/25 transform-gpu overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Join Our Community
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                to="/about"
                className="group px-8 py-4 border-2 border-white/30 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
              >
                <span className="flex items-center">
                  Explore More
                  <ExternalLink className="ml-2 group-hover:scale-110 transition-transform duration-300" size={20} />
                </span>
              </Link>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center transform transition-all duration-500 hover:scale-110"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <achievement.icon className="text-blue-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-white">{achievement.value}</div>
                  <div className="text-gray-400 text-sm">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-white/60">
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown size={24} className="animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section
        ref={featuresRef}
        className="py-20 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 relative overflow-hidden"
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Code Catalyst?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover what makes our community special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative perspective-1000"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative bg-slate-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-y-12 preserve-3d border border-gray-700">
                  {/* 3D Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <feature.icon className="text-white" size={32} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl transform translate-y-2`} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="text-sm font-semibold text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full inline-block">
                    {feature.stats}
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Content Showcase */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What's Happening at <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Code Catalyst</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with our latest events, announcements, and community highlights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Events Carousel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <h3 className="text-2xl font-bold">Featured Events</h3>
              </div>

              {latestContent?.events && latestContent.events.length > 0 && (
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                    <div className="relative h-64">
                      <img
                        src={latestContent.events[currentSlide].image}
                        alt={latestContent.events[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-xl font-bold text-white mb-2">
                          {latestContent.events[currentSlide].title}
                        </h4>
                        <div className="flex items-center space-x-4 text-gray-300">
                          <span className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(latestContent.events[currentSlide].date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users size={16} />
                            <span>{latestContent.events[currentSlide].attendees} attendees</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {latestContent.events.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-500 scale-125' : 'bg-white/30 hover:bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Link to="/gallery" className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                View All Events
                <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Notices & Blogs */}
            <div className="space-y-8">
              {/* Recent Notices */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Bell className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Recent Notices</h3>
                </div>

                <div className="space-y-3">
                  {latestContent?.notices?.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1 text-sm">{notice.title}</h4>
                          <p className="text-gray-300 text-xs">{new Date(notice.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${notice.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          notice.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                          {notice.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/notices" className="inline-flex items-center text-orange-400 font-medium hover:text-orange-300 transition-colors group text-sm">
                  View All Notices
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Latest Blogs */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Video className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Latest Blogs</h3>
                </div>

                <div className="space-y-3">
                  {latestContent?.blogs?.map((blog) => (
                    <div key={blog.id} className="group bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <div className="relative">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={20} />
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-white text-sm mb-1">{blog.title}</h4>
                        <p className="text-gray-300 text-xs">{blog.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/blog" className="inline-flex items-center text-green-400 font-medium hover:text-green-300 transition-colors group text-sm">
                  Read All Blogs
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pattern-move 20s linear infinite'
          }} />
        </div>

        <div className="container-max px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed">
              Join Code Catalyst today and connect with like-minded students,
              participate in exciting projects, and accelerate your career in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-2xl transform-gpu"
              >
                <span className="flex items-center justify-center">
                  <Users className="mr-2" size={20} />
                  Become a Member
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
              </Link>
              <Link
                to="/contact"
                className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  Get in Touch
                  <ExternalLink className="ml-2 group-hover:scale-110 transition-transform duration-300" size={20} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Test