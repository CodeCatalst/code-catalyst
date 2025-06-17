import { useState, useEffect } from 'react'
import { Calendar, Users, ExternalLink, X } from 'lucide-react'
import api from '../../services/api'
import LoadingSpinner from '../../components/Common/LoadingSpinner'

const Gallery = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/gallery')
        setEvents(response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        // Set mock data for demo
        setEvents([
          {
            id: 1,
            name: 'Tech Talk: AI in 2024',
            date: '2024-01-15',
            description: 'An inspiring session about the future of artificial intelligence and its impact on various industries.',
            thumbnail: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184633/pexels-photo-3184633.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 85,
            category: 'Workshop'
          },
          {
            id: 2,
            name: 'Annual Hackathon 2024',
            date: '2024-01-20',
            description: '48-hour coding marathon where teams compete to build innovative solutions to real-world problems.',
            thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 120,
            category: 'Competition'
          },
          {
            id: 3,
            name: 'Web Development Bootcamp',
            date: '2024-01-25',
            description: 'Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and database design.',
            thumbnail: 'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/3184356/pexels-photo-3184356.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 45,
            category: 'Bootcamp'
          },
          {
            id: 4,
            name: 'Industry Networking Night',
            date: '2024-02-01',
            description: 'Connect with industry professionals, alumni, and fellow students in an informal networking environment.',
            thumbnail: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 60,
            category: 'Networking'
          },
          {
            id: 5,
            name: 'Mobile App Development Workshop',
            date: '2024-02-10',
            description: 'Learn to build cross-platform mobile applications using React Native and Flutter.',
            thumbnail: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 35,
            category: 'Workshop'
          },
          {
            id: 6,
            name: 'Open Source Contribution Day',
            date: '2024-02-15',
            description: 'Learn how to contribute to open source projects and make your mark in the developer community.',
            thumbnail: 'https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=600',
            images: [
              'https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            attendees: 25,
            category: 'Workshop'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const openLightbox = (event) => {
    setSelectedEvent(event)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
    document.body.style.overflow = 'unset'
  }

  if (loading) {
    return <LoadingSpinner message="Loading event gallery..." />
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Event <span className="text-secondary-300">Gallery</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Explore the highlights from our workshops, hackathons, networking events, and community gatherings.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="card group cursor-pointer hover:scale-105 transition-all duration-300"
                   onClick={() => openLightbox(event)}>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={event.thumbnail}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {event.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{selectedEvent.attendees} attendees</span>
                  </div>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>
              <button
                onClick={closeLightbox}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedEvent.description}
              </p>

              {/* Event Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedEvent.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedEvent.name} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery