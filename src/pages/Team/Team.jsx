import { useState, useEffect, useRef } from 'react'
import { Github, Linkedin, Twitter, Mail, Filter, Grid, List, Instagram, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import Card from './Card'

const Team = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [teamMembers, setTeamMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [loading, setLoading] = useState(true)
  const heroRef = useRef(null)

  const departments = ['All', 'Executive', 'Technical', 'PR & Marketing', 'HR & Events', 'Design', 'Content', 'E-Sports']


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
            name: 'Divy',
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
            name: 'Gauranshi Bahuguna',
            role: 'Vice President',
            department: 'Executive',
            image: '/Gauranshi_Bahuguna.jpg',
            bio: 'As a seasoned technology leader and Vice President, I bring expertise in Linux, networking, Java, Python, and Data Structures & Algorithms (DSA). Currently expanding my skill set in ethical hacking, I remain dedicated to driving innovation and excellence',
            skills: ['Linux', 'Networking', 'Java', 'Python', 'DSA'],
            social: {

            }
          },
          {
            id: 3,
            name: 'Arjan',
            role: 'Secretary',
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
            name: 'Jeevan',
            role: 'Community Manager',
            department: 'HR & Events',
            image: './Jeevan.png',
            bio: ' Creative Developer',
            skills: ['Event Planning', 'Community Building', 'Public Speaking'],
            social: {
              linkedin: 'https://www.linkedin.com/in/jeevanpant/',
            }
          },
          {
            id: 5,
            name: 'Prashant Thakur',
            role: 'Technical Lead',
            department: 'Technical',
            image: './Prashant_Thakur.jpg',
            bio: 'Full Stack Developer with a passion for building scalable and efficient web applications. ',
            skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'SQL', 'TypeScript', 'Git & Github'],
            social: {
              linkedin: 'https://www.linkedin.com/in/prashanthakurr/',
              github: 'https://github.com/prashantScripter',
            }
          },
          {
            id: 6,
            name: 'Jobin Babu',
            role: 'Graphic Designer',
            department: 'Design',
            image: './Jobin_Babu.jpg',
            bio: 'Tech enthusiast with a passion for Python, AI/ML, and creative design. Leading visual content creation to support innovative and technical projects.',
            skills: ['Python', 'UI/UX Design', 'Figma', 'AI/ML'],
            social: {
              linkedin: 'https://www.linkedin.com/in/jobin-babu-872462325/',
            }
          },
          {
            id: 7,
            name: 'Yogesh Pandey',
            role: 'PR Team Lead',
            department: 'PR & Marketing',
            image: './Yogesh_Pandey.png',
            bio: 'Turning codes into conversations. From drafting posts to hosting events—I handle the buzz. When not online, I\'m probably learning to code and vibing to DHH.',
            skills: ['Digital Marketing', 'Social Media', 'Content Strategy', 'Analytics'],
            social: {
              linkedin: 'https://www.linkedin.com/in/yogesh-pandey-9a07582b3',
              github: ' https://github.com/yogeshpandey9908',
              Instagram: 'https://www.instagram.com/yogeshpandey9908/'
            }
          },
          {
            id: 8,
            name: 'Rahul kumar ',
            role: 'E-Sports Support',
            department: 'E-Sports',
            image: './Rahul_Kumar.jpg',
            bio: 'I have a lot of interest in gaming and I like to learn every development method of gaming and I also like to gain experience of team work, that\'s all',
            skills: ['E-Sports'],
            social: {

            }
          },
          {
            id: 9,
            name: 'Poorvi Panwar ',
            role: 'Event management',
            department: 'HR & Events',
            image: './Poorvi_Panwar.jpg',
            bio: ' I am Poorvi newly inducted member of the event management team in the Code catalyst society, eager to contribute to organizing impactful and engaging technical events.',
            skills: ['Event Management'],
            social: {

            }
          },
          {
            id: 10,
            name: 'Divya',
            role: 'Content Lead',
            department: 'Content',
            image: './Divya.png',
            bio: '  Driving impactful narratives and strategic communication across tech-driven platforms. Passionate about simplifying complex ideas, leading creative teams, and building content that informs, inspires, and engages the developer community.',
            skills: ['Content Writing', 'Content Creation', 'SEO', 'Documentation'],
            social: {

            }
          },
          {
            id: 11,
            name: 'Radha Srivastav',
            role: 'PR lead support',
            department: 'PR & Marketing',
            image: './Radha_Srivastav.jpg',
            bio: 'I am passionate about learning, collaborating, and making a meaningful impact across academic, technical, and public relations environments.',
            skills: ['PR', 'Marketing', 'Content Creation'],
            social: {

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
      case 'Instagram': return Instagram
      default: return Mail
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading team members..." />
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

        <div className="container-max text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Meet Our <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Team</span>
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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Filter and View Controls */}
      <section className="py-8 border-b border-gray-700/50 bg-gray-900">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Department Filter */}
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <Filter size={20} className="text-gray-400 flex-shrink-0" />
              <div className="flex gap-2 overflow-x-auto flex-nowrap scrollbar-hide min-w-0 flex-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${selectedDepartment === dept
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
            <div className="flex items-center space-x-2 bg-gray-900 rounded-lg p-1 border border-gray-700/50 flex-shrink-0">
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
      <section className="section-padding bg-white" id="team-section">
        <div className="container-max">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMembers.map((member) => (
                <Card key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} member={member} layout="list" />
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