import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogs';
import AdminAccessWrapper from './AdminAccessWrapper';
import BlogCard from './BlogCard';
import BlogFormModal from './BlogFormModal';
import { useToast } from '../hooks/use-toast';

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await getBlogs();
      setBlogs(blogsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditBlog(null);
    setShowModal(true);
  };

  const handleEdit = (blog) => {
    setEditBlog(blog);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(b => b.id !== id));
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (blogData) => {
    try {
      if (editBlog) {
        const updated = await updateBlog(editBlog.id, blogData);
        setBlogs(blogs.map(b => b.id === editBlog.id ? updated : b));
        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        const created = await createBlog(blogData);
        setBlogs([created, ...blogs]);
        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog",
        variant: "destructive",
      });
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const title = blog.title || '';
    const author = blog.author || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).map(blog => ({
    ...blog,
    thumbnail: blog.thumbnail || 'default-thumbnail.png',
    date: blog.date || new Date().toISOString()
  }));

  const categories = ['All', 'Tech', 'Design', 'Backend', 'Frontend', 'Mobile'];

  return (
    <AdminAccessWrapper permission="blogs_management">
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Blog Management</h1>
            <p className="text-gray-600">Create, edit, and manage your blog posts</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-gray-900 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search blogs by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 text-gray-900  rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm text-gray-900 whitespace-nowrap">
                  {filteredBlogs.length} of {blogs.length} blogs
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'All' ? 'No blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'All' 
                    ? 'Try adjusting your search criteria or filters'
                    : 'Get started by creating your first blog post'
                  }
                </p>
                {(!searchTerm && selectedCategory === 'All') && (
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Plus size={20} className="mr-2" />
                    Create First Blog
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, idx) => (
                <BlogCard
                  key={blog.id || `blog-${idx}`}
                  blog={blog}
                  showActions={true}
                  onEdit={() => handleEdit(blog)}
                  onDelete={() => handleDelete(blog.id)}
                  onClick={() => handleEdit(blog)}
                />
              ))}
            </div>
          )}

          {/* Floating Add Button */}
          <button
            onClick={handleAdd}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
            title="Add New Blog"
          >
            <Plus size={24} />
          </button>

          {/* Blog Form Modal */}
          <BlogFormModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            blog={editBlog}
            onSave={handleSave}
          />
        </div>
      </div>
    </AdminAccessWrapper>
  );
};

export default AdminBlogManager;

<div className="flex items-center space-x-4">
  <button
    onClick={() => fetchBlogs()}
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
  >
    Refresh Blogs
  </button>
</div>