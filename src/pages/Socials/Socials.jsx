import React from 'react'
import { useEffect, useRef } from 'react'
import { 
  Github, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  ExternalLink, 
  Code, 
  Zap, 
  Users, 
  Heart,
  Mail,
  Globe,
  Share2,
  Star,
  TrendingUp,
  Video,
  Send
} from 'lucide-react'
import DiscordIcon from '../../components/Layout/DiscordIcon'
import NeuralWaveAnimation from './NeuralWaveAnimation'

const Socials = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const ctaRef = useRef(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
          entry.target.style.opacity = '1'
        }
      })
    }, observerOptions)

    // Observe all cards
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    // Observe CTA section
    if (ctaRef.current) {
      observer.observe(ctaRef.current)
    }

    // Add parallax scroll effect with requestAnimationFrame for smooth 120fps
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY
          const hero = document.querySelector('.hero-section')
          if (hero) {
            hero.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`
            hero.style.opacity = `${Math.max(0, 1 - scrolled / 800)}`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      username: '@codeCatalyst-Jb',
      href: 'https://github.com/codeCatalyst-Jb',
      description: 'Explore our open-source projects, contribute to code, and collaborate with fellow developers.',
      color: 'from-gray-800 to-gray-900',
      hoverColor: 'hover:from-gray-700 hover:to-gray-800',
      gradient: 'from-gray-600 to-gray-700',
      stats: { label: 'Repositories', value: '2+', icon: Star },
      features: ['Open Source Projects', 'Code Contributions', 'Developer Community', 'Technical Discussions']
    },
    {
      name: 'Discord',
      icon: DiscordIcon,
      username: 'Code Catalyst Server',
      href: 'https://discord.gg/uW3BthhwDU',
      description: 'Join our active community, get real-time help, participate in discussions, and network with peers.',
      color: 'from-indigo-600 to-purple-700',
      hoverColor: 'hover:from-indigo-500 hover:to-purple-600',
      gradient: 'from-indigo-500 to-purple-600',
      stats: { label: 'Members', value: '100+', icon: Users },
      features: ['Real-time Chat', 'Voice Channels', 'Event Notifications', 'Community Support']
    },
    {
      name: 'Instagram',
      icon: Instagram,
      username: '@codecatalyst.jb',
      href: 'https://www.instagram.com/codecatalyst.jb',
      description: 'See our event highlights, behind-the-scenes moments, and stay connected with our journey.',
      color: 'from-pink-600 via-purple-600 to-orange-500',
      hoverColor: 'hover:from-pink-500 hover:via-purple-500 hover:to-orange-400',
      gradient: 'from-pink-500 via-purple-500 to-orange-400',
      stats: { label: 'Followers', value: '450+', icon: Users },
      features: ['Event Highlights', 'Behind-the-Scenes', 'Tech Stories', 'Visual Content']
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      username: 'Code Catalyst',
      href: 'https://www.linkedin.com/company/code-catalyst-s/',
      description: 'Connect professionally, discover opportunities, and build your network with industry experts.',
      color: 'from-blue-700 to-blue-900',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
      gradient: 'from-blue-600 to-blue-800',
      stats: { label: 'Followers', value: '60+', icon: Users },
      features: ['Professional Network', 'Job Opportunities', 'Industry Updates', 'Alumni Connect']
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      username: 'CC Community Hub',
      href: 'https://chat.whatsapp.com/EQvCUtrg0FDD8WfY7KlGih',
      description: 'Join our WhatsApp community for instant updates, quick discussions, and direct communication.',
      color: 'from-green-600 to-green-800',
      hoverColor: 'hover:from-green-500 hover:to-green-700',
      gradient: 'from-green-500 to-green-700',
      stats: { label: 'Members', value: '400+', icon: Users },
      features: ['Instant Updates', 'Quick Announcements', 'Group Discussions', 'Event Reminders']
    },
   
    {
      name: 'Email',
      icon: Mail,
      username: 'contact@codecatalyst.com',
      href: 'mailto:contact@codecatalyst.com',
      description: 'Get in touch with us directly via email for inquiries, partnerships, or support.',
      color: 'from-orange-600 to-red-600',
      hoverColor: 'hover:from-orange-500 hover:to-red-500',
      gradient: 'from-orange-500 to-red-500',
      stats: { label: 'Response Time', value: '24h', icon: TrendingUp },
      features: ['Direct Contact', 'Inquiries', 'Partnerships', 'Support']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-300">
        <NeuralWaveAnimation />
        
        <div className="relative z-10 container-max text-center py-20 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-pulse">
              <Code className="text-white" size={32} />
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              Connect <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">With Us</span>
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
      <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative overflow-hidden transition-all duration-500">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 transform transition-all duration-700">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in">
              Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Social Platforms</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Connect with us on your favorite platforms and stay updated with the latest news, events, and opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              const StatIcon = social.stats.icon
              return (
                <div
                  key={social.name}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="social-card opacity-0 group relative transform transition-all duration-700 hover:scale-105 hover:-translate-y-2"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={`relative bg-gradient-to-br ${social.color} ${social.hoverColor} rounded-3xl p-6 sm:p-8 border border-white/20 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden h-full flex flex-col`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm10 0c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                      }} />
                    </div>

                    {/* Floating Icon */}
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${social.gradient} rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl`}>
                        {social.name === 'Discord' ? (
                          <DiscordIcon className="text-white w-8 h-8 sm:w-9 sm:h-9" />
                        ) : (
                          <Icon className="text-white" size={36} />
                        )}
                      </div>
                      <div className={`absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${social.gradient} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl`} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 group-hover:bg-clip-text transition-all duration-300">
                        {social.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">{social.username}</p>
                      <p className="text-gray-200 leading-relaxed mb-4 group-hover:text-gray-100 transition-colors duration-300 flex-1">
                        {social.description}
                      </p>

                      {/* Stats */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4 border border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatIcon className="w-4 h-4 text-white/80" />
                            <span className="text-xs text-white/80">{social.stats.label}</span>
                          </div>
                          <span className="text-lg font-bold text-white">{social.stats.value}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-2">
                          {social.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                              <span className="text-xs text-white/90">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 mt-auto"
                      >
                        <span>Visit {social.name}</span>
                        <ExternalLink size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </a>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section ref={ctaRef} className="py-20 text-white relative overflow-hidden opacity-0 transition-all duration-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center transform transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 transform transition-all duration-700 hover:scale-105">
              Ready to <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Get Started?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed transition-all duration-700">
              Join thousands of innovators, developers, and tech enthusiasts in our growing community. 
              Choose your favorite platform and start connecting today!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <a
                href="https://discord.gg/uW3BthhwDU"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-110 transform active:scale-95"
              >
                Join Discord Community
              </a>
              <a
                href="https://github.com/codeCatalyst-Jb"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-500 hover:scale-110 border border-white/20 transform active:scale-95"
              >
                View GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:bg-white/10" style={{ animationDelay: '200ms' }}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 transition-all duration-300">
                  500+
                </div>
                <div className="text-gray-300 text-sm">Community Members</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:bg-white/10" style={{ animationDelay: '400ms' }}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 transition-all duration-300">
                  6
                </div>
                <div className="text-gray-300 text-sm">Social Platforms</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-6 transform transition-all duration-500 hover:scale-105 hover:bg-white/10" style={{ animationDelay: '600ms' }}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 transition-all duration-300">
                  24/7
                </div>
                <div className="text-gray-300 text-sm">Active Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Socials
