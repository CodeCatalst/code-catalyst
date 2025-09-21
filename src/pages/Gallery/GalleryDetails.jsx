import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Copy, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { getGallery } from '../../services/gallery';
import { useToast } from '../../components/hooks/use-toast';

const GalleryDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const allEvents = await getGallery();
      const eventData = allEvents.find(e => e.id.toString() === id);

      if (!eventData) {
        throw new Error('Event not found');
      }

      setEvent(eventData);

      // Get related events (same category, excluding current event)
      const related = allEvents
        .filter(e => e.id !== eventData.id && e.category === eventData.category)
        .slice(0, 3);
      setRelatedEvents(related);
    } catch (error) {
      console.error('Failed to load event:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async (platform) => {
    const url = window.location.href;

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The gallery link has been copied to your clipboard.",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to copy link to clipboard",
            variant: "destructive",
          });
        }
        break;
    }
  };

  const nextImage = () => {
    if (event && event.images) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
    }
  };

  const prevImage = () => {
    if (event && event.images) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery event not found</h2>
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.images ? event.images[0] : event.image_url}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-16 left-8">
          <Link
            to="/gallery"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Gallery
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mr-4">
                {event.category}
              </span>
              {event.images && event.images.length > 1 && (
                <span className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                  {event.images.length} Photos
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {event.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-between mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-teal-500" />
              <span className="text-gray-600">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-teal-500" />
              <span className="text-gray-600">{event.category}</span>
            </div>
            {event.images && event.images.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  {currentImageIndex + 1} of {event.images.length} photos
                </span>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Copy Link"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-12">
          {event.images && event.images.length > 0 ? (
            <div className="space-y-6">
              {/* Main Image Display */}
              <div className="relative max-w-4xl mx-auto">
                <img
                  src={event.images[currentImageIndex]}
                  alt={`${event.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
                />

                {/* Navigation Arrows */}
                {event.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors text-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors text-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {event.images.length > 1 && (
                <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <img
                src={event.image_url}
                alt={event.name}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Event Description */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
            <div
              className="text-gray-700 leading-relaxed text-lg prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        </div>
      </div>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Events</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more events in the {event.category} category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map(relatedEvent => (
                <Link
                  key={relatedEvent.id}
                  to={`/gallery/${relatedEvent.id}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedEvent.images ? relatedEvent.images[0] : relatedEvent.image_url}
                      alt={relatedEvent.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {relatedEvent.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedEvent.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {relatedEvent.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(relatedEvent.date)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/gallery"
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                View All Events
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDetails;