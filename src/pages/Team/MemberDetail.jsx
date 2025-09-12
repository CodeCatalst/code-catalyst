import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail, Instagram, Link as LinkIcon, ArrowLeft, ExternalLink, Code, Users, Award, Calendar } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'

const MemberDetail = () => {
  const { id } = useParams()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true)
      try {
        const response = await api.get('/team')
        const data = response.data
        // Find member by id from the list
        const foundMember = data.find(m => String(m.id) === String(id))
        if (!foundMember) {
          setError('Member not found')
          setMember(null)
        } else {
          // Parse skills and social fields
          const parsedMember = {
            ...foundMember,
            skills: typeof foundMember.skills === 'string'
              ? (foundMember.skills ? foundMember.skills.split(',').map(s => s.trim()).filter(Boolean) : [])
              : (Array.isArray(foundMember.skills) ? foundMember.skills : []),
            social: typeof foundMember.social === 'string'
              ? (foundMember.social ? JSON.parse(foundMember.social) : {})
              : (foundMember.social || {})
          }
          setMember(parsedMember)
          setError(null)
        }
      } catch (error) {
        console.error('Failed to fetch member:', error)
        setError('Failed to fetch member: ' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMember()
    }
  }, [id])

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'github': return Github
      case 'linkedin': return Linkedin
      case 'twitter': return Twitter
      case 'email': return Mail
      case 'Instagram': return Instagram
      case 'Link': return LinkIcon
      default: return Mail
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading member details..." />
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Member Not Found</h1>
          <p className="text-gray-300 mb-8">The team member you're looking for doesn't exist.</p>
          <Link
            to="/team"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Team</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
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
                animationDuration: `${4 + Math.random() * 6}s`
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

        <div className="container-max text-center relative z-10">
          {/* Back Button */}
          <Link
            to="/team"
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300 mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Team</span>
          </Link>

          {/* Member Profile */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  {imageError || !member.image ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Code size={48} className="mx-auto mb-2" />
                        <p className="text-sm font-medium">{member.name.split(' ')[0]}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Code className="text-white" size={24} />
                </div>
              </div>

              {/* Member Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {member.name}
                </h1>
                <p className="text-xl text-blue-400 font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-lg text-gray-300 mb-6">
                  {member.department}
                </p>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start space-x-4 mb-8">
                  {Object.entries(member.social).map(([platform, url]) => {
                    const IconComponent = getSocialIcon(platform)
                    return (
                      <a
                        key={platform}
                        href={platform.toLowerCase() === 'email' ? (url?.startsWith('mailto:') ? url : `mailto:${url}`) : url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label={platform}
                      >
                        <IconComponent size={20} className="text-white" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Bio Section */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="mr-3 text-blue-600" size={24} />
                  About {member.name.split(' ')[0]}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {member.bio}
                </p>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="mr-3 text-purple-600" size={24} />
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="mr-3 text-green-600" size={24} />
                Member Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Department</h3>
                  <p className="text-gray-600">{member.department}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Role</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ExternalLink className="mr-3 text-orange-600" size={24} />
                Connect with {member.name.split(' ')[0]}
              </h2>
              <div className="flex flex-wrap gap-4">
                {Object.entries(member.social).map(([platform, url]) => {
                  const IconComponent = getSocialIcon(platform)
                  return (
                    <a
                      key={platform}
                      href={platform.toLowerCase() === 'email' ? (url?.startsWith('mailto:') ? url : `mailto:${url}`) : url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 group"
                    >
                      <IconComponent size={20} className="text-gray-600 group-hover:text-blue-600" />
                      <span className="text-gray-700 font-medium capitalize group-hover:text-blue-600">
                        {platform}
                      </span>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default MemberDetail
