import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Twitter, Linkedin, Copy, Clock, Tag } from 'lucide-react';
import { getBlogById, getBlogs } from '../../services/blogs';
import BlogCard from '../../components/Admin/BlogCard';
import { useToast } from '../../components/hooks/use-toast';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const blogData = await getBlogById(id);
      setBlog(blogData);
      
      // Get related blogs (same category, excluding current blog)
      const allBlogs = await getBlogs();
      const related = allBlogs
        .filter(b => b.id !== id && b.category === blogData.category)
        .slice(0, 3);
      setRelatedBlogs(related);
    } catch (error) {
      console.error('Failed to load blog:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
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
    const title = blog?.title || '';
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/company/code-catalyst-s/?viewAsMember=true`);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The blog link has been copied to your clipboard.",
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

  const handleRelatedBlogClick = (relatedBlog) => {
    window.location.href = `/blog/${relatedBlog.id}`;
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h2>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
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
          src={blog.thumbnail} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Link 
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full mr-4">
                {blog.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-between mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <User size={20} className="text-teal-500" />
              <span className="text-lg font-medium text-gray-900">{blog.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-teal-500" />
              <span className="text-gray-600">{formatDate(blog.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-teal-500" />
              <span className="text-gray-600">5 min read</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              title="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              title="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Copy Link"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              lineHeight: '1.8',
              fontSize: '18px'
            }}
          />
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mt-12 pt-8 border-t border-gray-200">
          <Tag size={20} className="text-gray-400" />
          <span className="text-sm text-gray-600">Tags:</span>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              {blog.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Tutorial
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
              Best Practices
            </span>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more insights and articles in the {blog.category} category
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map(relatedBlog => (
                <BlogCard
                  key={relatedBlog.id}
                  blog={relatedBlog}
                  onClick={() => handleRelatedBlogClick(relatedBlog)}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/blog"
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                View All Articles
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;