import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Github, Twitter, Instagram, Linkedin } from 'lucide-react'
import api from '../../services/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'contact@codecatalyst.edu',
      action: 'mailto:contact@codecatalyst.edu'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'University Campus, Tech Building Room 205',
      action: '#'
    }
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/codecatalyst', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/codecatalyst', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/codecatalyst', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/codecatalyst', label: 'LinkedIn' },
  ]

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

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
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
      await api.post('/contact', formData)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Failed to send message:', error)
      setErrors({ submit: 'Failed to send message. Please try again.' })
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

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden"
      >
        <div className="relative z-10 container-max text-center py-20 mt-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white">
            Get in <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Touch</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up text-white">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-padding bg-slate-900">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8 card">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Send us a Message</h2>
                <p className="text-gray-300">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {success && (
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                  <p className="text-green-300 font-medium">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>
              )}

              {errors.submit && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-300 font-medium">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input-field ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={`input-field resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Contact Information</h2>
                <p className="text-gray-400">
                  Reach out to us through any of these channels or visit us on campus.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12  border border-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-gray-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-600 mb-1">{info.title}</h3>
                      {info.action !== '#' ? (
                        <a
                          href={info.action}
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-400">{info.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-8 border-t border-gray-700">
                <h3 className="font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 border border-gray-700/50 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon
                        size={20}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="border border-gray-700/50 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-400">
                  <p><span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                  <p><span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM</p>
                  <p><span className="font-medium">Sunday:</span> Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact