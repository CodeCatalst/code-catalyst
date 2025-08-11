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
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    images: [],
    tags: [],
    isHidden: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices();
      if (Array.isArray(response)) {
        setNotices(response);
      } else if (response && Array.isArray(response.data)) {
        setNotices(response.data);
      } else {
        setNotices([]);
      }
    } catch (err) {
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result, images: [reader.result] }));
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
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const noticePayload = {
        ...formData,
        images: formData.image ? [formData.image] : [],
        image: formData.image || '',
        description: formData.content,
        publishedAt: editingNotice ? (formData.publishedAt || new Date().toISOString()) : new Date().toISOString(),
      };
      if (editingNotice) {
        await updateNotice(editingNotice.id, noticePayload);
      } else {
        await createNotice(noticePayload);
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
    setFormData({
      title: '',
      content: '',
      image: null,
      images: [],
      tags: [],
      isHidden: false
    });
    setEditingNotice(null);
    setShowForm(false);
    setNewTag('');
    setImagePreview(null);
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      content: notice.content || notice.description || '',
      image: notice.image || (Array.isArray(notice.images) ? notice.images[0] : null),
      images: Array.isArray(notice.images) ? notice.images : (notice.image ? [notice.image] : []),
      tags: notice.tags || [],
      isHidden: notice.isHidden,
      publishedAt: notice.publishedAt
    });
    setImagePreview(notice.image || (Array.isArray(notice.images) ? notice.images[0] : null));
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
    try {
      await updateNotice(id, { isHidden: !currentStatus });
      await fetchNotices();
    } catch (err) {
      setError('Failed to update notice visibility');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
<<<<<<< HEAD
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 text-white">
=======
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-2xl">
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-blue-300">Notice Management</h1>
        <button
          className={`px-5 py-2 rounded-lg font-semibold shadow transition bg-blue-700 text-white hover:bg-blue-600 ${showForm ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Notice'}
        </button>
      </div>

      {showForm && (
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 mb-8 shadow flex flex-col gap-6 border border-gray-700 text-white">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1 text-blue-300">Title</label>
=======
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8 shadow flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
                  maxLength={100}
                  placeholder="Notice title"
                />
              </div>
              <div>
<<<<<<< HEAD
                <label className="block font-medium mb-1 text-blue-300">Content</label>
=======
                <label className="block font-medium mb-1">Content</label>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 min-h-[80px] bg-gray-900 text-white placeholder-gray-400"
                  maxLength={1000}
                  placeholder="Notice content"
                />
              </div>
              <div>
<<<<<<< HEAD
                <label className="block font-medium mb-1 text-blue-300">Tags</label>
=======
                <label className="block font-medium mb-1">Tags</label>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a custom tag"
                    className="rounded border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white placeholder-gray-400"
                    maxLength={20}
                    onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null)}
                  />
                  <button type="button" className="px-3 py-2 rounded bg-blue-900 text-blue-300 font-semibold hover:bg-blue-800" onClick={handleAddTag}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
<<<<<<< HEAD
                  {parseTags(formData.tags).map(tag => (
                    <span key={tag} className="inline-flex items-center bg-blue-800 text-blue-200 rounded-full px-3 py-1 text-sm font-medium">
=======
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
                      {tag}
                      <button type="button" className="ml-2 text-blue-400 hover:text-red-400" onClick={() => handleRemoveTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  name="isHidden"
                  checked={formData.isHidden}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-400 border-gray-700 rounded focus:ring-blue-400 bg-gray-900"
                />
<<<<<<< HEAD
                <label className="font-medium text-blue-300">Hide this notice</label>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[180px]">
              <label className="block font-medium mb-1 text-blue-300">Attach Image</label>
=======
                <label className="font-medium">Hide this notice</label>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[180px]">
              <label className="block font-medium mb-1">Attach Image</label>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="rounded border border-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white"
              />
              {imagePreview && (
                <div className="relative mt-2 w-28 h-28 rounded-lg overflow-hidden shadow border border-gray-700">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
<<<<<<< HEAD
                  <button type="button" className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs" onClick={() => { setFormData(prev => ({ ...prev, images: '' })); setImagePreview(null); }}>
=======
                  <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs" onClick={() => { setFormData(prev => ({ ...prev, image: null, images: [] })); setImagePreview(null); }}>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-600 transition" disabled={submitting}>
              {submitting ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg bg-gray-700 text-gray-200 font-semibold shadow hover:bg-gray-600 transition">
              Cancel
            </button>
          </div>
          {error && <div className="text-red-400 font-semibold mt-2">{error}</div>}
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Published Notices</h2>
        {loading ? (
          <div className="text-blue-300 font-semibold">Loading notices...</div>
        ) : notices.length === 0 ? (
          <p className="text-gray-400">No notices found</p>
        ) : (
<<<<<<< HEAD
          <div className="grid gap-8 md:grid-cols-2">
            {notices.map((notice) => (
              <div key={notice.id} className={`bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-700 ${notice.hidden ? 'opacity-50' : ''}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${notice.hidden ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>{notice.hidden ? 'Hidden' : 'Public'}</span>
                    {notice.images ? (
                      <img src={notice.images} alt="Notice" className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
                    ) : (
                      <span className="w-16 h-16 flex items-center justify-center bg-gray-900 text-gray-500 rounded-lg border border-gray-700">No Image</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold text-blue-200 mb-2">{notice.title}</h2>
                  <p className="text-sm text-gray-400 mb-2">{formatDate(notice.created_at)}</p>
                  <p className="text-gray-200 mb-4 line-clamp-4">{notice.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {parseTags(notice.tags).length > 0 ? (
                      parseTags(notice.tags).map(tag => (
                        <span key={tag} className="inline-block bg-blue-900 text-blue-200 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">{tag}</span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No tags</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(notice)} className="px-3 py-1 rounded bg-blue-900 text-blue-200 font-semibold hover:bg-blue-800 transition text-xs">Edit</button>
                  <button onClick={() => handleDelete(notice.id)} className="px-3 py-1 rounded bg-red-900 text-red-200 font-semibold hover:bg-red-800 transition text-xs">Delete</button>
                  <button onClick={() => handleToggleVisibility(notice.id, notice.hidden)} className="px-3 py-1 rounded bg-yellow-900 text-yellow-200 font-semibold hover:bg-yellow-800 transition text-xs">{notice.hidden ? 'Unhide' : 'Hide'}</button>
                </div>
              </div>
            ))}
=======
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-full bg-white rounded-xl">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="py-3 px-4 text-left font-semibold">Title</th>
                  <th className="py-3 px-4 text-left font-semibold">Content</th>
                  <th className="py-3 px-4 text-left font-semibold">Image</th>
                  <th className="py-3 px-4 text-left font-semibold">Published</th>
                  <th className="py-3 px-4 text-left font-semibold">Tags</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(notices) ? notices : []).map((notice) => {
                  const content = typeof notice.content === 'string' ? notice.content : (notice.description || '');
                  const tags = Array.isArray(notice.tags) ? notice.tags : [];
                  const imageSrc = notice.image || (Array.isArray(notice.images) ? notice.images[0] : null);
                  return (
                    <tr key={notice.id} className={notice.isHidden ? 'bg-gray-100 text-gray-400' : ''}>
                      <td className="py-3 px-4 font-medium max-w-[180px] truncate" title={notice.title}>{notice.title}</td>
                      <td className="py-3 px-4 max-w-[260px] truncate" title={content}>{content.length > 100 ? content.substring(0, 100) + '...' : content}</td>
                      <td className="py-3 px-4">
                        {imageSrc ? (
                          <img src={imageSrc} alt="Notice" className="w-14 h-14 object-cover rounded shadow border border-gray-200" />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">{formatDate(notice.publishedAt)}</td>
                      <td className="py-3 px-4">
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <span key={tag} className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium mr-1 mb-1">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">No tags</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${notice.isHidden ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {notice.isHidden ? 'Hidden' : 'Visible'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleVisibility(notice.id, notice.isHidden)}
                            className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition text-xs"
                            title={notice.isHidden ? 'Unhide' : 'Hide'}
                          >
                            {notice.isHidden ? 'Show' : 'Hide'}
                          </button>
                          <button
                            onClick={() => handleEdit(notice)}
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-xs"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(notice.id)}
                            className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-xs"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
>>>>>>> parent of 0e22220 (patch: Notice Manger + Display Working)
          </div>
        )}
        {error && <div className="text-red-400 font-semibold mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default AdminNoticeManager;
