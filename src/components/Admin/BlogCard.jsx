import React from 'react';
import { Calendar, User, Eye,Trash2 } from 'lucide-react';

const BlogCard = ({ blog, onClick, showActions = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100">
      <div className="relative overflow-hidden" onClick={onClick}>
        <img 
          src={blog.thumbnail} 
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
            {blog.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200"
          onClick={onClick}
        >
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User size={16} className="text-teal-500" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} className="text-teal-500" />
              <span>{formatDate(blog.date)}</span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(blog);
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Edit Blog"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(blog.id);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete Blog"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;