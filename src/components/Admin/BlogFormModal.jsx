import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import { X, Upload, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const BlogFormModal = ({ isOpen, onClose, blog, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '',
    date: '',
    thumbnail: '',
    content: ''
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const TOTAL_STEPS = 3;

  // --- Helpers ---
  const stripHtml = (html = '') => {
    const withoutTags = html.replace(/<[^>]*>/g, '');
    return withoutTags.replace(/\u00A0|&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const formatDateForInput = (d) => {
    if (!d) return new Date().toISOString().split('T')[0];
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return new Date().toISOString().split('T')[0];
    return parsed.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
      const initialFormData = blog ? {
        title: blog.title || '',
        category: blog.category || '',
        author: blog.author || '',
        date: formatDateForInput(blog.date),
        thumbnail: blog.thumbnail || '',
        content: blog.content || ''
      } : {
        title: '',
        category: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        thumbnail: '',
        content: ''
      };

      setFormData(initialFormData);
      setThumbnailPreview(blog ? blog.thumbnail || '' : '');
      setCurrentStep(1); // Reset steps configuration
      setValidationError('');
  
      // Ensure content remains visible during updates
      if (blog && blog.content) {
        setFormData((prev) => ({ ...prev, content: blog.content }));
      }
    }
  }, [blog, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'content' && currentStep === 3) {
      setValidationError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setThumbnailPreview(result);
        handleInputChange('thumbnail', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Only handle submission on the final step
    if (currentStep !== TOTAL_STEPS) {
      return;
    }
    
    const plain = stripHtml(formData.content);
    if (!plain) {
      setValidationError('Content is required');
      setCurrentStep(3);
      return;
    }
    if (plain.length < 50) {
      setValidationError('Content must be at least 50 characters');
      setCurrentStep(3);
      return;
    }
    onSave(formData);
    onClose();
  };

  const nextStep = (e) => {
    // Prevent any form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isStepValid()) {
      console.log('Step validation failed:', currentStep);
      return;
    }
    
    if (currentStep < TOTAL_STEPS) {
      const nextStepNumber = currentStep + 1;
      console.log('Moving to next step:', nextStepNumber);
      setValidationError('');
      sessionStorage.setItem('blogFormStep', nextStepNumber.toString());
      setCurrentStep(nextStepNumber);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1;
      setValidationError('');
      sessionStorage.setItem('blogFormStep', prevStepNumber.toString());
      setCurrentStep(prevStepNumber);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(
          formData.title.trim() &&
          formData.category.trim() &&
          formData.author.trim() &&
          formData.date
        );
      case 2:
        return true;
      case 3:
        return Boolean(stripHtml(formData.content).length >= 50);
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  const plainContentLength = stripHtml(formData.content).length;

  return (
    <div className="fixed text-gray-900 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {blog ? 'Edit Blog' : 'Create New Blog'}
            </h2>
            {/* Step indicators */}
            <div className="flex items-center mt-2 space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? <Check size={16} /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-1 ${
                        currentStep > step ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden" noValidate>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter blog title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Tech">Tech</option>
                      <option value="Design">Design</option>
                      <option value="Backend">Backend</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thumbnail Image</h3>
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {thumbnailPreview && (
                    <div className="mt-4">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Content</h3>
                <div className="space-y-4">
                  <RichTextEditor
                    value={formData.content}
                    onChange={(val) => {
                      handleInputChange('content', val);
                      setValidationError('');
                    }}
                  />
                  {validationError && (
                    <div className="text-red-500 text-sm mt-2">{validationError}</div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div>Content length (plain text): {plainContentLength} characters</div>
                    {plainContentLength >= 50 && (
                      <div className="text-green-500">✓ Minimum length met</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {currentStep !== TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={(e) => nextStep(e)}
                  disabled={!isStepValid()}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStepValid()}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
                >
                  {blog ? 'Update Blog' : 'Create Blog'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
