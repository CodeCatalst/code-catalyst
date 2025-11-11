import { useState, useEffect, useRef } from 'react'
import { Github, ExternalLink, GitBranch, Star, Users, Code, CheckCircle, ArrowRight, Sparkles, Rocket, BookOpen, Award } from 'lucide-react'
import { useToast } from '../../components/hooks/use-toast'
import api from '../../services/api'

const OpenSource = () => {
  const { toast } = useToast()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [contributions, setContributions] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    projectName: '',
    projectUrl: '',
    prUrl: '',
    contributionType: 'code',
    description: ''
  })
  const [errors, setErrors] = useState({})

  // Open source projects that need contributions
  const openSourceProjects = [
    {
      id: 1,
      name: 'Movie Recommendation Platform',
      description: 'A web application that recommends movies to users. Browse, search, and rate movies to get personalized recommendations based on popularity and genre.',
      repoUrl: 'https://github.com/codeCatalyst-Jb/Movie-Recommendation-System',
      techStack: ['Python', 'MySQL', 'Flask'],
      issues: 0,
      contributors: 2,
      difficulty: 'Beginner to Intermediate',
      color: 'from-red-500 to-yellow-500'
    }
  ]

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.githubUsername.trim()) {
      newErrors.githubUsername = 'GitHub username is required'
    }

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required'
    }

    if (!formData.projectUrl.trim()) {
      newErrors.projectUrl = 'Project URL is required'
    } else if (!/^https?:\/\/.+\..+/.test(formData.projectUrl)) {
      newErrors.projectUrl = 'Please enter a valid URL'
    }

    if (!formData.prUrl.trim()) {
      newErrors.prUrl = 'Pull Request URL is required'
    } else if (!/^https?:\/\/.+\..+/.test(formData.prUrl)) {
      newErrors.prUrl = 'Please enter a valid URL'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await api.post('/opensource/contributions', formData)
      toast({
        title: "Success!",
        description: "Your contribution has been submitted successfully! Thank you for contributing to open source."
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        githubUsername: '',
        projectName: '',
        projectUrl: '',
        prUrl: '',
        contributionType: 'code',
        description: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to submit contribution:', error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit contribution. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const contributionTypes = [
    { value: 'code', label: 'Code Contribution', icon: Code },
    { value: 'bugfix', label: 'Bug Fix', icon: CheckCircle },
    { value: 'feature', label: 'New Feature', icon: Sparkles },
    { value: 'documentation', label: 'Documentation', icon: BookOpen },
    { value: 'design', label: 'Design/UI', icon: Rocket }
  ]

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
              {['<PR />', '{ }', '<GitHub />', '( )', '[ ]', 'git push', '<contribute />', '&&'][Math.floor(Math.random() * 8)]}
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
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
              <Github className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Open Source <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Contributions</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Contribute to our open source projects and help build amazing things together. Every contribution matters!
          </p>
          <button
            className="group relative mt-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
            onClick={() => {
              const el = document.getElementById('contribute-form')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <span className="relative z-10">Start Contributing</span>
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
        </div>
      </section>

      {/* Open Source Projects Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Open Source Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our projects and find one that interests you. All skill levels welcome!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {openSourceProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{project.issues}</div>
                      <div className="text-xs text-gray-600">Open Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{project.contributors}</div>
                      <div className="text-xs text-gray-600">Contributors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">{project.difficulty}</div>
                      <div className="text-xs text-gray-600">Level</div>
                    </div>
                  </div>

                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <Github size={16} className="mr-2" />
                    View on GitHub
                    <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution Guidelines */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Contribution <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Guidelines</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Follow these guidelines to make your contribution process smooth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: 'Fork & Clone',
                description: 'Fork the repository and clone it to your local machine. Create a new branch for your changes.'
              },
              {
                icon: Code,
                title: 'Make Changes',
                description: 'Write clean, well-documented code. Follow the project\'s coding standards and conventions.'
              },
              {
                icon: CheckCircle,
                title: 'Submit PR',
                description: 'Test your changes thoroughly. Submit a pull request with a clear description of what you\'ve done.'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution Form */}
      <section id="contribute-form" className="py-20 bg-slate-900">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Submit Your <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Contribution</span>
              </h2>
              <p className="text-xl text-gray-300">
                Share your contribution with us! Fill out the form below after you've submitted a PR.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Username *
                  </label>
                  <input
                    type="text"
                    id="githubUsername"
                    name="githubUsername"
                    value={formData.githubUsername}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.githubUsername ? 'border-red-500' : ''}`}
                    placeholder="e.g., @yourusername"
                  />
                  {errors.githubUsername && (
                    <p className="mt-1 text-sm text-red-400">{errors.githubUsername}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.projectName ? 'border-red-500' : ''}`}
                      placeholder="e.g., Code Catalyst Website"
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-sm text-red-400">{errors.projectName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contributionType" className="block text-sm font-medium text-gray-300 mb-2">
                      Contribution Type *
                    </label>
                    <select
                      id="contributionType"
                      name="contributionType"
                      value={formData.contributionType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {contributionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    Project Repository URL *
                  </label>
                  <input
                    type="url"
                    id="projectUrl"
                    name="projectUrl"
                    value={formData.projectUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.projectUrl ? 'border-red-500' : ''}`}
                    placeholder="https://github.com/org/repo"
                  />
                  {errors.projectUrl && (
                    <p className="mt-1 text-sm text-red-400">{errors.projectUrl}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="prUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    Pull Request URL *
                  </label>
                  <input
                    type="url"
                    id="prUrl"
                    name="prUrl"
                    value={formData.prUrl}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.prUrl ? 'border-red-500' : ''}`}
                    placeholder="https://github.com/org/repo/pull/123"
                  />
                  {errors.prUrl && (
                    <p className="mt-1 text-sm text-red-400">{errors.prUrl}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description of Contribution *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe what you contributed, what problem it solves, and any other relevant details..."
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Github size={20} />
                      <span>Submit Contribution</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OpenSource
