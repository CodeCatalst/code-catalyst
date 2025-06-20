import { useState, useEffect } from 'react'
import { Github, Linkedin, Twitter, Mail, Filter, Grid, List } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)

  const departments = ['All', 'Executive', 'Technical', 'PR & Marketing', 'HR & Events', 'Design', 'Content']

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get('/team')
        setTeamMembers(response.data)
        setFilteredMembers(response.data)
      } catch (error) {
        console.error('Failed to fetch team members:', error)
        // Set mock data for demo
        const mockData = [
          {
            id: 1,
            name: 'Sarah Johnson',
            role: 'President',
            department: 'Executive',
            image: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Computer Science senior passionate about AI and machine learning. Leading Code Catalyst with a vision to bridge the gap between academic learning and industry requirements.',
            skills: ['Leadership', 'AI/ML', 'Python', 'Project Management'],
            social: {
              github: 'https://github.com/sarahjohnson',
              linkedin: 'https://linkedin.com/in/sarahjohnson',
              twitter: 'https://twitter.com/sarahjohnson',
              email: 'sarah.johnson@codecatalyst.edu'
            }
          },
          {
            id: 2,
            name: 'Alex Chen',
            role: 'Vice President',
            department: 'Executive',
            image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and mentoring fellow students.',
            skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
            social: {
              github: 'https://github.com/alexchen',
              linkedin: 'https://linkedin.com/in/alexchen',
              email: 'alex.chen@codecatalyst.edu'
            }
          },
          {
            id: 3,
            name: 'Maya Patel',
            role: 'Technical Lead',
            department: 'Technical',
            image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'DevOps enthusiast and open source contributor. Specializes in containerization, CI/CD pipelines, and infrastructure automation.',
            skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
            social: {
              github: 'https://github.com/mayapatel',
              linkedin: 'https://linkedin.com/in/mayapatel',
              email: 'maya.patel@codecatalyst.edu'
            }
          },
          {
            id: 4,
            name: 'Jordan Smith',
            role: 'Community Manager',
            department: 'HR & Events',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Event coordinator with a passion for bringing people together. Experienced in organizing workshops, hackathons, and networking events.',
            skills: ['Event Planning', 'Community Building', 'Public Speaking', 'Marketing'],
            social: {
              linkedin: 'https://linkedin.com/in/jordansmith',
              twitter: 'https://twitter.com/jordansmith',
              email: 'jordan.smith@codecatalyst.edu'
            }
          },
          {
            id: 5,
            name: 'Emily Rodriguez',
            role: 'Design Lead',
            department: 'Design',
            image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'UX/UI designer focused on creating intuitive and accessible digital experiences. Advocates for user-centered design principles.',
            skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'User Research'],
            social: {
              linkedin: 'https://linkedin.com/in/emilyrodriguez',
              twitter: 'https://twitter.com/emilyrodriguez',
              email: 'emily.rodriguez@codecatalyst.edu'
            }
          },
          {
            id: 6,
            name: 'David Kim',
            role: 'Backend Developer',
            department: 'Technical',
            image: 'https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Backend developer specializing in database design and API development. Interested in distributed systems and microservices architecture.',
            skills: ['Python', 'PostgreSQL', 'Django', 'Redis'],
            social: {
              github: 'https://github.com/davidkim',
              linkedin: 'https://linkedin.com/in/davidkim',
              email: 'david.kim@codecatalyst.edu'
            }
          },
          {
            id: 7,
            name: 'Lisa Wang',
            role: 'Marketing Director',
            department: 'PR & Marketing',
            image: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Digital marketing strategist with experience in social media management, content creation, and brand development.',
            skills: ['Digital Marketing', 'Social Media', 'Content Strategy', 'Analytics'],
            social: {
              linkedin: 'https://linkedin.com/in/lisawang',
              twitter: 'https://twitter.com/lisawang',
              email: 'lisa.wang@codecatalyst.edu'
            }
          },
          {
            id: 8,
            name: 'Michael Brown',
            role: 'Frontend Developer',
            department: 'Technical',
            image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Frontend developer passionate about modern JavaScript frameworks and responsive design. Loves creating smooth user experiences.',
            skills: ['React', 'Vue.js', 'CSS', 'JavaScript'],
            social: {
              github: 'https://github.com/michaelbrown',
              linkedin: 'https://linkedin.com/in/michaelbrown',
              email: 'michael.brown@codecatalyst.edu'
            }
          },
          {
            id: 9,
            name: 'Sophia Martinez',
            role: 'Content Writer',
            department: 'Content',
            image: 'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=400',
            bio: 'Technical writer and content creator focused on making complex technology concepts accessible to everyone.',
            skills: ['Technical Writing', 'Content Creation', 'SEO', 'Documentation'],
            social: {
              linkedin: 'https://linkedin.com/in/sophiamartinez',
              twitter: 'https://twitter.com/sophiamartinez',
              email: 'sophia.martinez@codecatalyst.edu'
            }
          }
        ]
        setTeamMembers(mockData)
        setFilteredMembers(mockData)
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

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return Github
      case 'linkedin': return Linkedin
      case 'twitter': return Twitter
      case 'email': return Mail
      default: return Mail
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      {/* Hero Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Meet Our <span className="text-secondary-300">Team</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            The passionate individuals who make Code Catalyst a vibrant and thriving community.
          </p>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="py-8 border-b border-gray-700/50">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Department Filter */}
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${selectedDepartment === dept
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-950/50 border border-gray-700/50'
                      }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1 border border-gray-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-100'
                  }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-100'
                  }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding">
        <div className="container-max">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMembers.map((member) => (
                <div key={member.id} className="card text-center hover:scale-105 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-1">{member.role}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.department}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{member.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-gray-900 border border-gray-700 text-gray-400 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-2">
                    {Object.entries(member.social).map(([platform, url]) => {
                      const IconComponent = getSocialIcon(platform)
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-900 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                        >
                          <IconComponent
                            size={16}
                            className="text-gray-400 group-hover:text-white transition-colors"
                          />
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="card hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover flex-shrink-0 mx-auto lg:mx-0"
                    />
                    <div className="flex-grow text-center lg:text-left">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white">{member.name}</h3>
                          <p className="text-primary-600 font-medium">{member.role}</p>
                          <p className="text-gray-400 text-sm">{member.department}</p>
                        </div>
                        <div className="flex justify-center lg:justify-end space-x-2 mt-2 lg:mt-0">
                          {Object.entries(member.social).map(([platform, url]) => {
                            const IconComponent = getSocialIcon(platform)
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-gray-900 border border-gray-700/50 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 group"
                              >
                                <IconComponent
                                  size={16}
                                  className="text-gray-400 group-hover:text-white transition-colors"
                                />
                              </a>
                            )
                          })}
                        </div>
                      </div>

                      <p className="text-gray-400 mb-3">{member.bio}</p>

                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {member.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-900 border border-gray-700/50 text-gray-400 px-3 py-1 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No team members found in this department.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Team