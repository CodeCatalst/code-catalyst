import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../../services/blogs';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (err) {
        setError('Blog not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner message="Loading blog..." />;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="container-max max-w-2xl mx-auto">
        <Link to="/blog" className="inline-flex items-center mb-6 text-primary-400 hover:underline">
          <ArrowLeft size={20} className="mr-2" /> Back to Blogs
        </Link>
        <div className="rounded-lg overflow-hidden mb-6">
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-64 object-cover" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center space-x-4 text-gray-400 mb-6">
          <span className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{formatDate(blog.publishedAt)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{blog.views || 0} views</span>
          </span>
          <span className="bg-primary-600 text-white px-2 py-1 rounded text-sm font-medium">
            {blog.category}
          </span>
        </div>
        <div className="prose prose-invert max-w-none text-lg mb-8">
          {blog.content}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
