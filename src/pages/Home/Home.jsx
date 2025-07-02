import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Users, Video, Bell } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'

const Home = () => {
  const [latestContent, setLatestContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
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
    const fetchLatestContent = async () => {
      try {
        const response = await api.get('/latest')
        setLatestContent(response.data)
      } catch (error) {
        console.error('Failed to fetch latest content:', error)
        // Set mock data for demo
        setLatestContent({
          events: [
            { id: 1, title: 'Tech Talk: AI in 2024', date: '2024-01-15', image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { id: 2, title: 'Hackathon Weekend', date: '2024-01-20', image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400' },
          ],
          notices: [
            { id: 1, title: 'New Member Registration Open', date: '2024-01-10' },
            { id: 2, title: 'Workshop: React Fundamentals', date: '2024-01-12' },
          ],
          blogs: [
            { id: 1, title: 'Behind the Scenes: Code Catalyst', thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' },
            { id: 2, title: 'Student Success Stories', thumbnail: 'https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=400' },
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLatestContent()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight

      // Calculate scroll progress (0 to 1)
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading latest content..." />
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
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

        <div className="relative z-20 max-w-4xl w-full mx-auto p-10 animate-fade-in text-center">
          <h1 className="#22c55e text-5xl sm:text-6xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Welcome to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_2px_16px_rgba(168,85,247,0.5)]">Code Catalyst</span>
          </h1>
          <p className="text-md sm:text-xl text-gray-100 leading-relaxed mb-8 drop-shadow">
            Empowering students through technology, innovation, and collaboration.
            Join our community of passionate developers and tech enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="group relative flex flex-row items-center justify-center bg-white/10 border border-white/50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-md px-4 py-2 sm:px-8 sm:py-3 rounded-lg overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center">
                <ArrowRight className="mr-2" size={22} />
                Join Our Community
              </span>
            </Link>
            <Link to="/about" className="group relative flex flex-row items-center justify-center bg-white/10 border border-white/50 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-md px-4 py-2 sm:px-8 sm:py-3 rounded-lg overflow-hidden font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center">
                <Users className="mr-2" size={22} />
                Learn More
              </span>
            </Link>
          </div>
        </div>


        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>


      {/* Highlights Section */}
      <section className="section-padding bg-slate-900 relative">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What's Happening at <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_2px_16px_rgba(168,85,247,0.5)]">Code Catalyst</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stay updated with our latest events, announcements, and community highlights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Events */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-400" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-white">Latest Events</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.events?.map((event) => (
                  <div key={event.id} className="card hover:scale-105 transition-transform">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                    <p className="text-gray-300 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              <Link to="/gallery" className="inline-flex items-center text-gray-300 font-medium hover:text-primary-700 transition-colors">
                View All Events <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Notices */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Bell className="text-accent-600" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Recent Notices</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.notices?.map((notice) => (
                  <div key={notice.id} className="card hover:scale-105 transition-transform">
                    <h4 className="font-semibold text-gray-300 mb-2">{notice.title}</h4>
                    <p className="text-gray-300 text-sm">{new Date(notice.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              <Link to="/notices" className="inline-flex items-center text-gray-300 font-medium hover:text-primary-700 transition-colors">
                View All Notices <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Blogs */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Video className="text-secondary-600" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Latest Blogs</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.blogs?.map((blog) => (
                  <div key={blog.id} className="card hover:scale-105 transition-transform">
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-gray-300">{blog.title}</h4>
                  </div>
                ))}
              </div>

              <Link to="/blog" className="inline-flex items-center text-gray-300 font-medium hover:text-primary-700 transition-colors">
                Read All Blogs <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding flex items-center justify-center bg-purple-900 text-white overflow-hidden">
        <div className="container-max text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-xl text-gray-100">
              Join Code Catalyst today and connect with like-minded students,
              participate in exciting projects, and grow your technical skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="group relative bg-gray-900/50 text-white border border-gray-700 hover:bg-gray-950/50 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative z-10 flex items-center justify-center">
                  <Users className="inline mr-2" size={20} />
                  Become a Member
                </span>
              </Link>
              <Link to="/contact" className="group relative bg-gray-900/50 text-white border border-gray-700 hover:bg-gray-950/50 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative z-10">Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home