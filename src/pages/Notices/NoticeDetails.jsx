import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Copy, Tag } from 'lucide-react';
import { getNotices, getNotice } from '../../services/notices';
import { useToast } from '../../components/hooks/use-toast';

const NoticeDetails = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [relatedNotices, setRelatedNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNoticeDetails();
  }, [id]);

  const fetchNoticeDetails = async () => {
    setLoading(true);
    try {
      // Get the specific notice
      const noticeResponse = await getNotice(id);
      if (!noticeResponse.success) {
        throw new Error(noticeResponse.error || 'Notice not found');
      }

      const noticeData = noticeResponse.data;
      setNotice(noticeData);

      // Get all notices for related content
      const allNoticesResponse = await getNotices();
      const allNotices = Array.isArray(allNoticesResponse) ? allNoticesResponse : (allNoticesResponse.data || []);

      // Get related notices (same tags, excluding current notice)
      const related = allNotices
        .filter(n => n.id !== noticeData.id && Array.isArray(n.tags) && Array.isArray(noticeData.tags) &&
          n.tags.some(tag => noticeData.tags.includes(tag)))
        .slice(0, 3);
      setRelatedNotices(related);
    } catch (error) {
      console.error('Failed to load notice:', error);
      toast({
        title: "Error",
        description: "Failed to load notice",
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
            description: "The notice link has been copied to your clipboard.",
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

  if (!notice) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notice not found</h2>
          <Link
            to="/notices"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Notices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Back Button */}
        <div className="absolute top-16 left-8">
          <Link
            to="/notices"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Notices
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full mr-4">
                Notice
              </span>
              {Array.isArray(notice.tags) && notice.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {notice.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {notice.title}
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
              <Calendar size={20} className="text-blue-500" />
              <span className="text-gray-600">{formatDate(notice.created_at || notice.date)}</span>
            </div>
            {Array.isArray(notice.tags) && notice.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag size={20} className="text-blue-500" />
                <span className="text-gray-600">{notice.tags.length} tags</span>
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

        {/* Notice Image */}
        {notice.images && (
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <img
                src={notice.images}
                alt={notice.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Notice Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notice Details</h2>
            <div
              className="text-gray-700 leading-relaxed text-lg prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: notice.description }}
            />
          </div>

          {/* Tags */}
          {Array.isArray(notice.tags) && notice.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {notice.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Notices */}
      {relatedNotices.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Notices</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                More notices with similar tags
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNotices.map(relatedNotice => (
                <Link
                  key={relatedNotice.id}
                  to={`/notices/${relatedNotice.id}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    {relatedNotice.images ? (
                      <img
                        src={relatedNotice.images}
                        alt={relatedNotice.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                        Notice
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedNotice.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {relatedNotice.description?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        {formatDate(relatedNotice.created_at || relatedNotice.date)}
                      </div>
                      {Array.isArray(relatedNotice.tags) && relatedNotice.tags.length > 0 && (
                        <span className="text-xs text-blue-600 font-medium">
                          {relatedNotice.tags.length} tag{relatedNotice.tags.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/notices"
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                View All Notices
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeDetails;