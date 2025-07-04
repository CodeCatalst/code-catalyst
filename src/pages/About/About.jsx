import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Target, Eye, Heart, Award, Users, Calendar, Code, Zap, Rocket, Star, ArrowRight } from 'lucide-react'

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState({})
  const heroRef = useRef(null)
  const statsRef = useRef(null)

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const values = [
    {
      icon: Target,
      title: 'Our Purpose',
      description: 'To create a thriving community where students can explore, learn, and excel in technology while building lasting connections and practical skills for their future careers.',
      color: 'from-blue-500 to-purple-600',
      delay: '0ms'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading student tech society that bridges the gap between academic learning and industry demands, fostering innovation and technical excellence.',
      color: 'from-purple-500 to-pink-600',
      delay: '200ms'
    },
    {
      icon: Heart,
      title: 'Our Mission',
      description: 'Empowering students through hands-on workshops, collaborative projects, industry mentorship, and a supportive community that encourages continuous learning and growth.',
      color: 'from-pink-500 to-red-600',
      delay: '400ms'
    }
  ]

  const stats = [
    { number: '1000+', label: 'Active Members', icon: Users },
    { number: '5+', label: 'Events per Sem', icon: Calendar },
    { number: '15+', label: 'Associated Industry experts', icon: Award },
    { number: '95%', label: 'Skill Acquiring', icon: Star }
  ]


  const teamMembers = [
    {
      name: 'Divy',
      role: 'President',
      image: '/divy.jpg',
      bio: 'CS Senior passionate about AI and community building',
      specialty: 'Data Analytics & AI'
    },
    {
      name: 'Gauranshi Bahuguna',
      role: 'Vice President',
      image: '/Gauranshi_Bahuguna.jpg',
      bio: 'As a seasoned technology leader and Vice President, I bring expertise in Linux, networking, Java, Python, and Data Structures & Algorithms (DSA). Currently expanding my skill set in ethical hacking, I remain dedicated to driving innovation and excellence',
      specialty: 'Ethical Hacking'
    },
    {
      name: 'Arjan',
      role: 'Secretary',
      image: '/arjan.jpg',
      bio: 'A passionate Full-Stack Developer, lead digital innovation, event strategy, and creative tech initiatives for our vibrant tech community.',
      specialty: 'Executive & Technical'
    },
    {
      name: 'Jeevan',
      role: 'Community Manager',
      image: './Jeevan.png',
      bio: 'Event coordinator with a passion for bringing people together',
      specialty: 'Community Management'
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Hero Banner Section (from previous Home.jsx) */}
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
          <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            About <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_2px_16px_rgba(168,85,247,0.5)]">Code Catalyst</span>
          </h1>
          <p className="text-md sm:text-xl text-gray-100 leading-relaxed mb-8 drop-shadow">
            We are more than just a tech society - we're a community of innovators, learners, and future leaders who believe in the power of technology to change the world.
          </p>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section
        ref={statsRef}
        className="py-20 bg-gray-900 relative overflow-hidden"
        id="stats"
        data-animate
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 hover:scale-110 ${isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative group">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <stat.icon className="text-white" size={32} />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2 counter" data-target={stat.number}>
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Values Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: value.delay }}
              >
                <div className="relative bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-700">
                  {/* 3D Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <value.icon className="text-white" size={32} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl transform translate-y-2`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {value.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* 3D Team Cards */}
      <section className="py-20 bg-gray-900">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Meet Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Leadership</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals driving Code Catalyst forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group relative perspective-1000"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-y-12 preserve-3d">
                  {/* Image Container with Overlay */}
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Specialty Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium transform translate-x-full group-hover:translate-x-0 transition-transform duration-500">
                      {member.specialty}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/team"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform-gpu"
            >
              Meet the Full Team
              <CheckCircle className="ml-2 group-hover:rotate-12 transition-transform duration-300" size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About