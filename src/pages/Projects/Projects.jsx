import { useState, useEffect, useRef } from 'react'
import { ExternalLink, Github, Calendar, Users, Code, Database, Cloud, Zap, Bot, Globe, CheckCircle, Clock, ArrowRight, Sparkles, Star, Rocket } from 'lucide-react'
import LoadingSpinner from '../../components/Common/LoadingSpinner'


const Projects = () => {
  const [activeProject, setActiveProject] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleElements, setVisibleElements] = useState({})
  const projectsRef = useRef(null)
  const [loading, setLoading] = useState(true)
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

  const completedProjects = [
    {
      id: 1,
      name: 'Mukhota Website',
      description: 'A comprehensive drama society website built to establish their online presence and showcase their theatrical performances.',
      status: 'completed',
      category: 'Web Development',
      link: 'https://mukhauta.vercel.app/',
      image: '/mukhauta.png',
      techStack: {
        frontend: ['React', 'TailwindCSS', 'Shadcn UI'],
        backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
        other: ['Clerk', 'Cloudinary'],
        deployment: ['Vercel (Frontend)', 'Render (Backend)']
      },
      features: [
        'Responsive design for all devices',
        'User authentication with Clerk',
        'Image management with Cloudinary',
        'Performance optimized',
        'SEO friendly structure'
      ],
      impact: {
        users: '500+',
        performance: '95%',
        uptime: '99.9%'
      },
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const ongoingProjects = [
    {
      id: 2,
      name: 'Eve Chatbot',
      description: 'An intelligent chatbot designed to provide community information, college details, and career guidance to students.',
      status: 'ongoing',
      category: 'AI/ML & Web Dev',
      link: 'https://eve-higv.onrender.com/?next=/cc-chatbot/', // Placeholder link for ongoing project
      image: '/eve.jpg',
      techStack: {
        frontend: ['React', 'TailwindCSS'],
        backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'LLM API'],
        other: ['Vector Database', 'Natural Language Processing'],
        deployment: ['Vercel (Frontend)', 'Render (Backend)']
      },
      features: [
        'Community information queries',
        'College details and guidance',
        'Career counseling assistance',
        'Natural language processing',
        'Context-aware responses',
        'Multi-language support (planned)'
      ],
      progress: 75,
      expectedCompletion: 'Q2 2025',
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  const allProjects = [...completedProjects, ...ongoingProjects]

  const techIcons = {
    'React': Code,
    'TailwindCSS': Sparkles,
    'Shadcn UI': Star,
    'Node.js': Database,
    'Express': Zap,
    'PostgreSQL': Database,
    'Prisma': Database,
    'Clerk': Users,
    'Cloudinary': Cloud,
    'Vercel (Frontend)': Globe,
    'Render (Backend)': Cloud,
    'LLM API': Bot,
    'Vector Database': Database,
    'Natural Language Processing': Bot
  }

  const getTechIcon = (tech) => {
    return techIcons[tech] || Code
  }

  const stats = [
    { number: '3+', label: 'Active Projects', icon: Rocket },
    { number: '8+', label: 'Technologies Used', icon: Code },
    { number: '500+', label: 'Users Impacted', icon: Users },
    { number: '99.9%', label: 'Uptime Achieved', icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Banner */}
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
              {['{ }', '< />', '( )', '[ ]', '<notice />', '&&', '<body />', '<div>'][Math.floor(Math.random() * 8)]}
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
            Projects <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Code Catalyst</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Where we turn theory into code.
          </p>
          <button className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="relative z-10">See Latest Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Projects Showcase */}
      <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Project Portfolio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the innovative solutions we've built and the exciting projects currently in development
            </p>
          </div>

          {/* Project Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveProject(0)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeProject === 0
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CheckCircle className="inline mr-2" size={18} />
                  Completed Projects
                </button>
                <button
                  onClick={() => setActiveProject(1)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeProject === 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="inline mr-2" size={18} />
                  Ongoing Projects
                </button>
              </div>
            </div>
          </div>

          {/* Project Display */}
          <div className="space-y-12">
            {/* Completed Projects */}
            {activeProject === 0 && (
              <div className="space-y-8">
                {completedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Project Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-80 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                            <CheckCircle size={16} className="mr-2" />
                            Completed
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <div className="text-sm opacity-80">Category</div>
                              <div className="font-semibold">{project.category}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="p-8 lg:p-12">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                              {project.name}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              {project.description}
                            </p>
                          </div>

                          {/* Tech Stack */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 text-lg">Tech Stack</h4>
                            
                            {/* Frontend */}
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Frontend</div>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.frontend.map((tech, techIndex) => {
                                  const IconComponent = getTechIcon(tech)
                                  return (
                                    <span
                                      key={techIndex}
                                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                    >
                                      <IconComponent size={14} className="mr-1" />
                                      {tech}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Backend */}
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Backend</div>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.backend.map((tech, techIndex) => {
                                  const IconComponent = getTechIcon(tech)
                                  return (
                                    <span
                                      key={techIndex}
                                      className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                    >
                                      <IconComponent size={14} className="mr-1" />
                                      {tech}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Other & Deployment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Other Tools</div>
                                <div className="flex flex-wrap gap-2">
                                  {project.techStack.other.map((tech, techIndex) => {
                                    const IconComponent = getTechIcon(tech)
                                    return (
                                      <span
                                        key={techIndex}
                                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                      >
                                        <IconComponent size={14} className="mr-1" />
                                        {tech}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Deployment</div>
                                <div className="flex flex-wrap gap-2">
                                  {project.techStack.deployment.map((tech, techIndex) => {
                                    const IconComponent = getTechIcon(tech)
                                    return (
                                      <span
                                        key={techIndex}
                                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                      >
                                        <IconComponent size={14} className="mr-1" />
                                        {tech}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Key Features */}
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-3">Key Features</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {project.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center space-x-2">
                                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                  <span className="text-gray-600 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Impact Metrics */}
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <h4 className="font-semibold text-gray-900 text-lg mb-4">Project Impact</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{project.impact.users}</div>
                                <div className="text-sm text-gray-600">Users</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{project.impact.performance}</div>
                                <div className="text-sm text-gray-600">Performance</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{project.impact.uptime}</div>
                                <div className="text-sm text-gray-600">Uptime</div>
                              </div>
                            </div>
                          </div>

                          {project.link && project.link !== '#' && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                            >
                              <ExternalLink size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                              View Project
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ongoing Projects */}
            {activeProject === 1 && (
              <div className="space-y-8">
                {ongoingProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Project Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-80 lg:h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                            <Clock size={16} className="mr-2" />
                            In Progress
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="text-white">
                            <div className="text-sm opacity-80 mb-2">Progress</div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="text-sm mt-2">{project.progress}% Complete</div>
                          </div>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="p-8 lg:p-12">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                              {project.name}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                              {project.description}
                            </p>
                          </div>

                          {/* Expected Completion */}
                          <div className="bg-blue-50 rounded-2xl p-4">
                            <div className="flex items-center space-x-2">
                              <Calendar className="text-blue-600" size={20} />
                              <div>
                                <div className="font-semibold text-blue-900">Expected Completion</div>
                                <div className="text-blue-700">{project.expectedCompletion}</div>
                              </div>
                            </div>
                          </div>

                          {/* Tech Stack - Similar to completed projects */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 text-lg">Tech Stack</h4>
                            
                            {/* Frontend */}
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Frontend</div>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.frontend.map((tech, techIndex) => {
                                  const IconComponent = getTechIcon(tech)
                                  return (
                                    <span
                                      key={techIndex}
                                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                    >
                                      <IconComponent size={14} className="mr-1" />
                                      {tech}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Backend */}
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Backend</div>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.backend.map((tech, techIndex) => {
                                  const IconComponent = getTechIcon(tech)
                                  return (
                                    <span
                                      key={techIndex}
                                      className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                    >
                                      <IconComponent size={14} className="mr-1" />
                                      {tech}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Other & Deployment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Other Tools</div>
                                <div className="flex flex-wrap gap-2">
                                  {project.techStack.other.map((tech, techIndex) => {
                                    const IconComponent = getTechIcon(tech)
                                    return (
                                      <span
                                        key={techIndex}
                                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                      >
                                        <IconComponent size={14} className="mr-1" />
                                        {tech}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Deployment</div>
                                <div className="flex flex-wrap gap-2">
                                  {project.techStack.deployment.map((tech, techIndex) => {
                                    const IconComponent = getTechIcon(tech)
                                    return (
                                      <span
                                        key={techIndex}
                                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                      >
                                        <IconComponent size={14} className="mr-1" />
                                        {tech}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Planned Features */}
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg mb-3">Planned Features</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {project.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center space-x-2">
                                  <Clock size={16} className="text-blue-500 flex-shrink-0" />
                                  <span className="text-gray-600 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {project.link && project.link !== '#' && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                            >
                              <ExternalLink size={18} className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                              View Project
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
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
              Want to Collaborate on Our Next Project?
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed">
              Join our team of passionate developers and contribute to innovative projects that make a real impact. 
              Whether you're a beginner or experienced, there's a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <a 
                href="/contact" 
                className="group px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:shadow-2xl transform-gpu"
              >
                <span className="flex items-center justify-center">
                  <Users className="mr-2" size={20} />
                  Join Our Team
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
              </a>
              <a 
                href="/about" 
                className="group px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center">
                  Learn More About Us
                  <ExternalLink className="ml-2 group-hover:scale-110 transition-transform duration-300" size={20} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Projects