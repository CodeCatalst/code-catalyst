import React, { useState, useEffect } from 'react';
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../../services/notices';

const AdminNoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: '',
    tags: [],
    hidden: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices();
      // Support both array and object with data field
      const noticesArr = Array.isArray(response)
        ? response
        : (response && Array.isArray(response.data) ? response.data : []);
      setNotices(noticesArr);
    } catch (err) {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, images: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) return parsed;
        // Otherwise, treat as comma-separated string
        return tags.split(',').map(t => t.trim()).filter(Boolean);
      } catch {
        return tags.split(',').map(t => t.trim()).filter(Boolean);
      }
    }
    if (typeof tags === 'object') {
      // If tags is an object, get its values
      return Object.values(tags).map(t => String(t));
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const noticePayload = {
        title: formData.title,
        description: formData.description,
        images: formData.images || '',
        hidden: !!formData.hidden,
        tags: parseTags(formData.tags),
      };
      let response;
      if (editingNotice) {
        response = await updateNotice(editingNotice.id, noticePayload);
      } else {
        response = await createNotice(noticePayload);
      }
      await fetchNotices();
      resetForm();
    } catch (err) {
      setError(editingNotice ? 'Failed to update notice' : 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', images: '', tags: [], hidden: false });
    setEditingNotice(null);
    setShowForm(false);
    setImagePreview(null);
    setNewTag('');
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      description: notice.description || '',
      images: notice.images || '',
      tags: parseTags(notice.tags),
      hidden: !!notice.hidden,
    });
    setImagePreview(notice.images || null);
    setEditingNotice(notice);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await deleteNotice(id);
        await fetchNotices();
      } catch (err) {
        setError('Failed to delete notice');
      }
    }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    setError(null);
    setSubmitting(true);
    try {
      const notice = notices.find(n => n.id === id);
      if (!notice) throw new Error('Notice not found');
      const noticePayload = {
        title: notice.title,
        content: notice.content,
        images: notice.images || '',
        hidden: !currentStatus,
        tags: parseTags(notice.tags).join(','),
      };
      await updateNotice(id, noticePayload);
      await fetchNotices();
    } catch (err) {
      setError('Failed to update notice visibility');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : '';
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Notice Management</h1>
        <button
          className={`px-5 py-2 rounded-lg font-semibold shadow transition bg-blue-600 text-white hover:bg-blue-700 ${showForm ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Notice'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8 shadow flex flex-col gap-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1 text-blue-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  maxLength={100}
                  placeholder="Notice title"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-700">Content</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400 min-h-[80px]"
                  maxLength={1000}
                  placeholder="Notice content"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-700">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a custom tag"
                    className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    maxLength={20}
                    onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null)}
                  />
                  <button type="button" className="px-3 py-2 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200" onClick={handleAddTag}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parseTags(formData.tags).map(tag => (
                    <span key={tag} className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
                      {tag}
                      <button type="button" className="ml-2 text-blue-500 hover:text-red-500" onClick={() => handleRemoveTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  name="hidden"
                  checked={formData.hidden}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                />
                <label className="font-medium text-blue-700">Hide this notice</label>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[180px]">
              <label className="block font-medium mb-1 text-blue-700">Attach Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              {imagePreview && (
                <div className="relative mt-2 w-28 h-28 rounded-lg overflow-hidden shadow border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs" onClick={() => { setFormData(prev => ({ ...prev, images: '' })); setImagePreview(null); }}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition" disabled={submitting}>
              {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
          {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
        </form>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Published Notices</h2>
        {loading ? (
          <div className="text-blue-600 font-semibold">Loading notices...</div>
        ) : notices.length === 0 ? (
          <p className="text-gray-500">No notices found</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {notices.map((notice) => (
              <div key={notice.id} className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-200 ${notice.hidden ? 'opacity-50' : ''}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${notice.hidden ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{notice.hidden ? 'Hidden' : 'Public'}</span>
                    {notice.images ? (
                      <img src={notice.images} alt="Notice" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    ) : (
                      <span className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg border border-gray-200">No Image</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2">{notice.title}</h2>
                  <p className="text-sm text-gray-400 mb-2">{formatDate(notice.created_at)}</p>
                  <p className="text-gray-700 mb-4 line-clamp-4">{notice.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {parseTags(notice.tags).length > 0 ? (
                      parseTags(notice.tags).map(tag => (
                        <span key={tag} className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">{tag}</span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No tags</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(notice)} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-xs">Edit</button>
                  <button onClick={() => handleDelete(notice.id)} className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-xs">Delete</button>
                  <button onClick={() => handleToggleVisibility(notice.id, notice.hidden)} className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition text-xs">{notice.hidden ? 'Unhide' : 'Hide'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default AdminNoticeManager;
