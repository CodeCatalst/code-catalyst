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
    { number: '50+', label: 'Events Annually', icon: Calendar },
    { number: '25+', label: 'Industry Partners', icon: Award },
    { number: '95%', label: 'Job Placement Rate', icon: Star }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'Foundation',
      description: 'Code Catalyst was founded by a group of passionate computer science students with a vision to create a collaborative tech community.',
      icon: Rocket,
      color: 'bg-blue-500'
    },
    {
      year: '2020',
      title: 'First Workshop Series',
      description: 'Launched our signature workshop series covering web development, mobile apps, and data science fundamentals.',
      icon: Code,
      color: 'bg-green-500'
    },
    {
      year: '2021',
      title: 'Hackathon Success',
      description: 'Organized our first annual hackathon with 200+ participants and partnerships with leading tech companies.',
      icon: Zap,
      color: 'bg-yellow-500'
    },
    {
      year: '2022',
      title: 'Industry Partnerships',
      description: 'Established partnerships with major tech companies for internships, mentorship programs, and guest speaker series.',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 1000+ active members and launched our alumni network program for continuous career support.',
      icon: Award,
      color: 'bg-pink-500'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Opened our dedicated innovation lab and launched the startup incubation program for student entrepreneurs.',
      icon: Star,
      color: 'bg-indigo-500'
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'President',
      image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'CS Senior passionate about AI and community building',
      specialty: 'AI/ML'
    },
    {
      name: 'Alex Chen',
      role: 'Vice President',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Full-stack developer with expertise in React and Node.js',
      specialty: 'Web Development'
    },
    {
      name: 'Maya Patel',
      role: 'Technical Lead',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'DevOps enthusiast and open source contributor',
      specialty: 'DevOps'
    },
    {
      name: 'Jordan Smith',
      role: 'Community Manager',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Event coordinator with a passion for bringing people together',
      specialty: 'Community'
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with 3D Parallax */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Geometric Shapes */}
          <div 
            className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${20 + mousePosition.x * 0.02}%`,
              top: `${10 + mousePosition.y * 0.02}%`,
              transform: `translate3d(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px, 0)`
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/15 to-red-500/15 rounded-full blur-2xl animate-pulse delay-1000"
            style={{
              right: `${10 + mousePosition.x * 0.03}%`,
              bottom: `${20 + mousePosition.y * 0.03}%`,
              transform: `translate3d(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px, 0)`
            }}
          />
          
          {/* Floating Code Elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400 font-mono text-sm animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              >
                {['<div>', '</div>', 'function()', 'const', 'return', '{}', '[]', '=>'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-max px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div 
              className="transform transition-all duration-1000 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
              }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                  Code Catalyst
                </span>
              </h1>
            </div>
            
            <div className="relative">
              <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed transform transition-all duration-700 hover:scale-105">
                We are more than just a tech society - we're a community of innovators, learners, 
                and future leaders who believe in the power of technology to change the world.
              </p>
              
              {/* Glowing Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>

            {/* Interactive CTA Button */}
            <div className="pt-8">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu">
                <span className="relative z-10">Explore Our Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden"
        id="stats"
        data-animate
      >
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 hover:scale-110 ${
                  isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
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
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100">
                  {/* 3D Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <value.icon className="text-white" size={32} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl transform translate-y-2`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
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

      {/* Interactive Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From humble beginnings to a thriving tech community
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Animated Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 animate-timeline-grow" />
              
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-16 ${
                    index % 2 === 0 ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-125 hover:rotate-12 border-4 border-white`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 ${item.color} rounded-full opacity-0 hover:opacity-50 transition-opacity duration-500 blur-xl`} />
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                      <div className="text-blue-400 font-bold text-xl mb-2">{item.year}</div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Team Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
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
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-y-12 preserve-3d">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
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