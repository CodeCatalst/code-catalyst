import React, { useState, useEffect, useRef } from 'react'
import { Lightbulb, Users, Target, Rocket, Star, ChevronRight, Code, Zap, Award, BookOpen, ArrowRight, CheckCircle, Sparkles, Brain, Heart, Globe } from 'lucide-react'

const Innovation = () => {
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleElements, setVisibleElements] = useState({})
  const sectionsRef = useRef([])

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

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Lightbulb,
      content: 'The Innovation Cell is a dedicated space where creativity meets learning. It is built to inspire students to think differently and go beyond classroom knowledge. Here, ideas are not just discussed but also shaped into practical solutions. In short, it\'s a place where imagination turns into reality.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'purpose',
      title: 'Our Purpose',
      icon: Target,
      content: 'The purpose of the Innovation Cell is to give students the right platform to explore their ideas and talents. Through the Cell, students get an environment where they can discuss problems, think of solutions, and try new approaches. It\'s about developing confidence to create something new and useful. It helps students to grow their skills for both academics and real-world needs.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'join',
      title: 'Who Can Join?',
      icon: Users,
      content: 'The Innovation Cell is open to everyone who is curious and willing to learn. Whether you are from Electrical, IT, Mechanical, or any other stream, you can be a part of this community. If you bring an idea, the Cell will support you in making it more impactful. It\'s about giving every student a chance to explore innovation in their own way.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'provide',
      title: 'What We Provide',
      icon: Rocket,
      content: 'The Innovation Cell provides students with the tools, resources, and support they need to succeed. We offer guidance from mentors, and hands-on opportunities to work on projects. For students with ideas, we help in refining and developing them into practical innovations. With Code Catalyst also being a part of this journey, students gain even more exposure and community support.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    {
      icon: Brain,
      title: 'Problem-Solving Skills',
      description: 'Develop critical thinking and analytical abilities through real-world challenges.'
    },
    {
      icon: Sparkles,
      title: 'Creativity Enhancement',
      description: 'Unleash your creative potential in a supportive and inspiring environment.'
    },
    {
      icon: Users,
      title: 'Teamwork & Leadership',
      description: 'Build essential collaboration skills and leadership qualities.'
    },
    {
      icon: BookOpen,
      title: 'Practical Experience',
      description: 'Apply theoretical knowledge to real projects and gain hands-on experience.'
    },
    {
      icon: Heart,
      title: 'Confidence Building',
      description: 'Develop self-confidence through successful project completion.'
    },
    {
      icon: Globe,
      title: 'Community Support',
      description: 'Join a network of like-minded innovators and mentors.'
    }
  ]

  const uniqueFeatures = [
    {
      title: 'Open for All Streams',
      description: 'Students from Electrical, IT, Mechanical, or any branch can join and contribute.',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Idea to Reality',
      description: 'It\'s not just about discussing ideas, but actually building and testing them.',
      icon: Rocket,
      color: 'bg-purple-500'
    },
    {
      title: 'Strong Support System',
      description: 'Guidance, resources, and mentorship are always provided.',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      title: 'Part of a Community',
      description: 'With Code Catalyst connected, students get more exposure and opportunities.',
      icon: Star,
      color: 'bg-orange-500'
    },
    {
      title: 'Focus on Real-World Skills',
      description: 'Helps in improving teamwork, problem-solving, and leadership skills along with academics.',
      icon: Target,
      color: 'bg-pink-500'
    }
  ]

  const stats = [
    { number: '500+', label: 'Students Impacted', icon: Users },
    { number: '100+', label: 'Projects Completed', icon: Rocket },
    { number: '50+', label: 'Mentors Available', icon: Award },
    { number: '15+', label: 'Departments Involved', icon: BookOpen }
  ]

  return (
    <div className="min-h-screen pt-0 overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section
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
              {['{ }', '< />', '( )', '[ ]', '<innovation />', '&&', '<body />', '<div>'][Math.floor(Math.random() * 8)]}
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
            Innovation <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Cell</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Where Ideas Come to Life - Your creative space from the Code Catalyst community at JB Knowledge Park.
          </p>
          <button className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
            onClick={() => {
              const el = document.getElementById('stats');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="relative z-10">Explore Innovation</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 hover:scale-110 ${
                  visibleElements.stats ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                data-animate
                id="stats"
              >
                <div className="relative group">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <stat.icon className="text-white" size={32} />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Sections */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Innovation Cell</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes our Innovation Cell special
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Interactive Navigation */}
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeSection === index ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setActiveSection(index)}
                >
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    activeSection === index 
                      ? 'bg-white shadow-2xl border-blue-500' 
                      : 'bg-white/50 hover:bg-white hover:shadow-lg border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeSection === index 
                          ? `bg-gradient-to-r ${section.color}` 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <section.icon 
                          className={`transition-colors duration-300 ${
                            activeSection === index ? 'text-white' : 'text-gray-600'
                          }`} 
                          size={24} 
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg font-bold transition-colors duration-300 ${
                          activeSection === index ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {section.title}
                        </h3>
                      </div>
                      <ChevronRight 
                        className={`transition-all duration-300 ${
                          activeSection === index 
                            ? 'text-blue-600 rotate-90' 
                            : 'text-gray-400 group-hover:text-gray-600'
                        }`} 
                        size={20} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Display */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${sections[activeSection].color} rounded-xl flex items-center justify-center`}>
                      {React.createElement(sections[activeSection].icon, { className: "text-white", size: 32 })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {sections[activeSection].title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {sections[activeSection].content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Importance & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Benefits</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Innovation Cell plays a very important role in a student's overall growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                      <benefit.icon className="text-white" size={32} />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl transform translate-y-2" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {benefit.description}
                  </p>

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Makes Innovation Cell <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Unique?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that set us apart from other innovation programs
            </p>
          </div>

          <div className="space-y-8">
            {uniqueFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className={`w-24 h-24 ${feature.color} rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-2xl`}>
                      <feature.icon className="text-white" size={40} />
                    </div>
                    <div className={`absolute inset-0 w-24 h-24 ${feature.color} rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl`} />
                  </div>
                </div>
                
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pattern-move 20s linear infinite'
          }} />
        </div>

        <div className="container-max px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Turn Your Ideas into Reality?
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed">
              Every idea deserves a chance to grow. Innovation Cell exists to provide students with the courage, 
              resources, and community to think differently. Join us today and be part of something extraordinary!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <a 
                href="/signup" 
                className="group px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-2xl transform-gpu"
              >
                <span className="flex items-center justify-center">
                  <Rocket className="mr-2" size={20} />
                  Join Innovation Cell
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
              </a>
              <a 
                href="/contact" 
                className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  Learn More
                  <ChevronRight className="ml-2 group-hover:scale-110 transition-transform duration-300" size={20} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      
    </div>
  )
}

export default Innovation