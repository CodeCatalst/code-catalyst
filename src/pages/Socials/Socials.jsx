import React, { useState, useEffect } from 'react'
import { Github, Instagram, Linkedin, MessageCircle, ExternalLink, Code, Zap, Users, Heart } from 'lucide-react'

const Socials = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleElements, setVisibleElements] = useState({})

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
          setVisibleElements(prev => ({
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

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/codecatalyst',
      description: 'Explore our open-source projects and contribute to the community',
      color: 'from-gray-800 to-gray-900',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800',
      gradient: 'from-gray-600 to-gray-700'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      href: 'https://discord.gg/uW3BthhwDU',
      description: 'Join our community discussions and get real-time support',
      color: 'from-indigo-600 to-purple-600',
      hoverColor: 'hover:from-indigo-500 hover:to-purple-500',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/codecatalyst.jb',
      description: 'Follow us for updates, behind-the-scenes, and tech insights',
      color: 'from-pink-500 to-purple-600',
      hoverColor: 'hover:from-pink-400 hover:to-purple-500',
      gradient: 'from-pink-400 to-purple-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/codecatalystt/',
      description: 'Connect professionally and explore career opportunities',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-500 hover:to-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://chat.whatsapp.com/EQvCUtrg0FDD8WfY7KlGih',
      description: 'Join our WhatsApp group for instant updates and discussions',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-400 hover:to-green-500',
      gradient: 'from-green-400 to-green-500'
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-move 25s linear infinite'
          }} />
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-blue-400/20 font-mono text-xl animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
                transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`
              }}
            >
              {['</>', '{ }', '( )', '[ ]', 'Social Links', 'Whatsapp', 'Instagram', 'LinkedIn', 'Discord', 'Code Catalyst'][Math.floor(Math.random() * 10)]}
            </div>
          ))}
        </div>

        {/* Particle System */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-blue-400/20 animate-spin-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${40 + Math.random() * 60}px`,
                height: `${40 + Math.random() * 60}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
                transform: `translate3d(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px, 0)`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container-max text-center py-20">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-bounce">
              <Code className="text-white" size={32} />
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
              Connect <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">With Us</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Join our vibrant community across all platforms. Stay connected, get involved, and be part of the Code Catalyst journey.
          </p>

          <div className="flex items-center justify-center space-x-6 animate-fade-in">
            <Zap className="text-yellow-400 animate-pulse" size={24} />
            <span className="text-lg font-medium">Follow us on social media</span>
            <Heart className="text-red-400 animate-pulse" size={24} />
          </div>
        </div>
      </section>

      {/* Social Links Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Social Platforms</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with us on your favorite platforms and stay updated with the latest news, events, and opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {socialLinks.map((social, index) => (
              <div
                key={social.name}
                className={`group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  visibleElements.socials ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                data-animate
                id="socials"
              >
                <div className={`relative bg-gradient-to-br ${social.color} ${social.hoverColor} rounded-3xl p-8 border border-white/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '40px 40px'
                    }} />
                  </div>

                  {/* Floating Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${social.gradient} rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl`}>
                      <social.icon className="text-white" size={36} />
                    </div>
                    <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${social.gradient} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                      {social.name}
                    </h3>
                    <p className="text-gray-200 leading-relaxed mb-6 group-hover:text-gray-100 transition-colors duration-300">
                      {social.description}
                    </p>

                    {/* CTA Button */}
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <span>Visit {social.name}</span>
                      <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
    
    </div>
  )
}

export default Socials
