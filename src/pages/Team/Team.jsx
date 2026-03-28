import { useState, useEffect, useRef } from 'react'
import { Github, Linkedin, Twitter, Mail, Filter, Grid, List, Instagram, ArrowRight, Link } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import Card from './Card'
import AdminTeamManager from '../../components/Admin/AdminTeamManager'
import Watermark from '../../components/Layout/Watermark'

const Team = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [teamMembers, setTeamMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const heroRef = useRef(null)

  const departments = ['All', 'Executive', 'AI/ML', 'Full Stack', 'PR & Marketing', 'Events', 'Design', 'Content', 'E-Sports']


  // Helper function to normalize department names
  const normalizeDepartment = (dept, role) => {
    if (!dept) return 'Other'
    const d = dept.toLowerCase()
    const r = role ? role.toLowerCase() : ''

    // Leadership/Executive mapping
    if (d.includes('executive') || d.includes('visionary') || d.includes('leadership') ||
      r.includes('president') || r.includes('secretary') || r.includes('treasurer')) {
      return 'Executive'
    }

    // Design mapping
    if (d.includes('design') || d.includes('ui/ux') || d.includes('creative') || d.includes('art')) {
      return 'Design'
    }

    // AI/ML mapping
    if (d.includes('ai') || d.includes('ml') || d.includes('data') || d.includes('analytics') || d.includes('python')) {
      return 'AI/ML'
    }

    // Full Stack mapping (replaces Technical)
    if (d.includes('technical') || d.includes('tech') || d.includes('development') ||
      d.includes('code') || d.includes('software') || d.includes('web') || d.includes('stack') || d.includes('app')) {
      return 'Full Stack'
    }

    // Content mapping
    if (d.includes('content') || d.includes('writing') || d.includes('video') || d.includes('editor')) {
      return 'Content'
    }

    // PR & Marketing mapping
    if (d.includes('pr') || d.includes('marketing') || d.includes('public relations') || d.includes('media')) {
      return 'PR & Marketing'
    }

    // HR & Events mapping
    if (d.includes('hr') || d.includes('events') || d.includes('human resources') || d.includes('management')) {
      return 'Events'
    }

    // E-Sports mapping
    if (d.includes('sport') || d.includes('gaming') || d.includes('player')) {
      return 'E-Sports'
    }

    return dept // Fallback to original if no match found
  }

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
    const fetchTeamMembers = async () => {
      setLoading(true)
      try {
        const response = await api.get('/team')
        // Parse skills and social fields for all members
        const data = response.data.map(m => ({
          ...m,
          skills: typeof m.skills === 'string' ? (m.skills ? m.skills.split(',').map(s => s.trim()).filter(Boolean) : []) : (Array.isArray(m.skills) ? m.skills : []),
          social: typeof m.social === 'string' ? (m.social ? JSON.parse(m.social) : {}) : (m.social || {}),
          // Store original department for display if needed, but use normalized for filtering
          originalDepartment: m.department,
          department: normalizeDepartment(m.department, m.role)
        }))
        setTeamMembers(data)
        setFilteredMembers(data)
      } catch (error) {
        setTeamMembers([])
        setFilteredMembers([])
      } finally {
        setLoading(false)
      }
    }
    fetchTeamMembers()
  }, [])

  useEffect(() => {
    if (selectedDepartment === 'All') {
      setFilteredMembers(teamMembers)
    } else {
      setFilteredMembers(teamMembers.filter(member => member.department === selectedDepartment))
    }
  }, [selectedDepartment, teamMembers])

  // Separate leaders from other members
  // Only separate leaders when viewing all departments
  const leaderRoles = ['President', 'Vice President', 'Secretary']

  const leaders = selectedDepartment === 'All'
    ? filteredMembers
      .filter(member => leaderRoles.includes(member.role))
      .sort((a, b) => leaderRoles.indexOf(a.role) - leaderRoles.indexOf(b.role))
    : []

  const otherMembers = selectedDepartment === 'All'
    ? filteredMembers.filter(member => !leaderRoles.includes(member.role))
    : []

  // const getSocialIcon = (platform) => {
  //   switch (platform) {
  //     case 'github': return Github
  //     case 'linkedin': return Linkedin
  //     case 'twitter': return Twitter
  //     case 'email': return Mail
  //     case 'Instagram': return Instagram
  //     case 'Link': return Link
  //     default: return Mail
  //   }
  // }

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Admin Button */}

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

        <div className="container-max text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Meet the <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Team</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            The passionate individuals who make Code Catalyst a vibrant and thriving community.
          </p>
        </div>

        <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25 transform-gpu"
          onClick={() => {
            const el = document.getElementById('team-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="relative z-10">See Our Team</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
        </button>

        <Watermark />
      </section>

      {/* Filter and View Controls */}
      <section className="sticky top-0 z-40 py-6 bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/10">
        <div className="container-max">
          <div className="flex flex-col space-y-4">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Our Team</h2>
                <p className="text-gray-400 text-sm">
                  {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                  {selectedDepartment !== 'All' && ` in ${selectedDepartment}`}
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 hidden sm:inline">View:</span>
                <div className="flex items-center space-x-1 bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                  >
                    <Grid size={16} />
                    <span className="hidden sm:inline text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                  >
                    <List size={16} />
                    <span className="hidden sm:inline text-sm font-medium">List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Department Filter with Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Filter size={18} className="text-purple-400 flex-shrink-0" />
              <div className="flex gap-2 flex-nowrap">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`group relative px-5 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${selectedDepartment === dept
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                      : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50 hover:border-purple-500/30'
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {dept}
                      {selectedDepartment === dept && (
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      )}
                    </span>
                    {selectedDepartment !== dept && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" id="team-section">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          {selectedDepartment !== 'All' && (
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-purple-500/20 mb-4">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="text-purple-400 font-medium">{selectedDepartment} Department</span>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Meet the {selectedDepartment} Team
              </h3>
            </div>
          )}

          {viewMode === 'grid' ? (
            <>
              {selectedDepartment === 'All' ? (
                <>
                  {/* Leadership Section - President, Vice President, Secretary */}
                  {leaders.length > 0 && (
                    <div className="mb-16">
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Leadership Team
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-8 mb-12 team-grid">
                        {leaders.map((member, index) => (
                          <div
                            key={member.id}
                            className="animate-fade-in-up max-w-sm card-hover-wrapper"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Card member={member} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Team Members */}
                  {otherMembers.length > 0 && (
                    <>
                      {leaders.length > 0 && (
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-white mb-2">Team Members</h3>
                          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>
                      )}
                      <div className="flex flex-wrap justify-center gap-6 lg:gap-8 team-grid">
                        {otherMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="animate-fade-in-up card-hover-wrapper"
                            style={{ animationDelay: `${(leaders.length + index) * 50}ms` }}
                          >
                            <Card member={member} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* When filtering by department, show all members in grid */
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8 team-grid">
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="animate-fade-in-up card-hover-wrapper"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Card member={member} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {selectedDepartment === 'All' ? (
                <>
                  {/* Leadership Section - List View */}
                  {leaders.length > 0 && (
                    <div className="mb-12">
                      <div className="text-center mb-6">
                        <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Leadership Team
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                      </div>
                      <div className="space-y-4 max-w-5xl mx-auto">
                        {leaders.map((member, index) => (
                          <div
                            key={member.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <Card member={member} layout="list" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Team Members - List View */}
                  {otherMembers.length > 0 && (
                    <>
                      {leaders.length > 0 && (
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white mb-2">Team Members</h3>
                          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>
                      )}
                      <div className="space-y-4 max-w-5xl mx-auto">
                        {otherMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${(leaders.length + index) * 50}ms` }}
                          >
                            <Card member={member} layout="list" />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* When filtering by department, show all members in list */
                <div className="space-y-4 max-w-5xl mx-auto">
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Card member={member} layout="list" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {filteredMembers.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6">
                <Filter size={32} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Members Found</h3>
              <p className="text-gray-400 text-lg mb-8">
                No team members found in the {selectedDepartment} department.
              </p>
              <button
                onClick={() => setSelectedDepartment('All')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:scale-105 transition-transform duration-300"
              >
                View All Members
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add custom animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hover Effects */
        /* Hover Effects */
        /* Only apply dimming interactions when a card is actually hovered */
        .team-grid:has(.card-hover-wrapper:hover) .card-hover-wrapper:not(:hover) {
          opacity: 0.5;
          filter: blur(2px) grayscale(80%);
          transform: scale(0.95);
          transition: all 0.4s ease;
        }

        .team-grid .card-hover-wrapper:hover {
          opacity: 1;
          filter: blur(0) grayscale(0%);
          transform: scale(1.1);
          z-index: 10;
          transition: all 0.4s ease;
        }
      `}</style>
    </div>
  )
}

export default Team