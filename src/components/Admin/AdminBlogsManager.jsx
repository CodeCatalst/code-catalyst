import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogs'
import AdminAccessWrapper from './AdminAccessWrapper'

const AdminBlogsManager = () => {
    const [blogs, setBlogs] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editBlog, setEditBlog] = useState(null)
    const [thumbnail, setThumbnail] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const data = await getBlogs()
            setBlogs(data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load blogs' })
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setEditBlog(null)
        setThumbnail('')
        setContent('')
        setShowForm(true)
    }
    const handleEdit = (blog) => {
        setEditBlog(blog)
        setThumbnail(blog.thumbnail || '')
        setContent(blog.content || '')
        setShowForm(true)
    }
    const handleDelete = async (id) => {
        try {
            await deleteBlog(id)
            setBlogs(blogs.filter(b => b.id !== id))
            setMessage({ type: 'success', text: 'Blog deleted' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete blog' })
        }
    }
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbnail(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const newBlog = {
            title: form.title.value,
            category: form.category.value,
            author: form.author.value,
            content: content,
            date: form.date.value,
            thumbnail: thumbnail || '',
        }
        try {
            if (editBlog) {
                const updated = await updateBlog(editBlog.id, newBlog)
                setBlogs(blogs.map(b => b.id === editBlog.id ? updated : b))
                setMessage({ type: 'success', text: 'Blog updated' })
            } else {
                const created = await createBlog(newBlog)
                setBlogs([...blogs, created])
                setMessage({ type: 'success', text: 'Blog added' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save blog' })
        }
        setShowForm(false)
        setEditBlog(null)
        setThumbnail('')
        setContent('')
    }

    return (
        <AdminAccessWrapper permission="blogs_management">
            <div className="text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Manage Blogs</h2>
                    <button
                        className="btn-primary flex items-center gap-2 px-3 py-2 rounded-lg"
                        onClick={handleAdd}
                        title="Add Blog"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Blog</span>
                    </button>
                </div>
                <table className="w-full bg-gray-900 rounded-lg mb-6">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2 px-4 text-left">Thumbnail</th>
                            <th className="py-2 px-4 text-left">Title</th>
                            <th className="py-2 px-4 text-left">Category</th>
                            <th className="py-2 px-4 text-left">Author</th>
                            <th className="py-2 px-4 text-left">Date</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-400 font-semibold">
                                    No blogs have been posted yet. Share your knowledge and experiences by adding a new blog!
                                </td>
                            </tr>
                        ) : (
                            blogs.map(blog => (
                                <tr key={blog.id} className="border-b border-gray-800">
                                    <td className="py-2 px-4">
                                        {blog.thumbnail && (
                                            <img src={blog.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4">{blog.title}</td>
                                    <td className="py-2 px-4">{blog.category}</td>
                                    <td className="py-2 px-4">{blog.author}</td>
                                    <td className="py-2 px-4">{blog.date}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <button
                                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                                            onClick={() => handleEdit(blog)}
                                            title="Edit Blog"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded"
                                            onClick={() => handleDelete(blog.id)}
                                            title="Delete Blog"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Add/Edit Blog Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onSubmit={handleFormSubmit}>
                            <h3 className="text-xl font-bold mb-4">{editBlog ? 'Edit Blog' : 'Add Blog'}</h3>
                            <div className="mb-3">
                                <label className="block mb-1">Title</label>
                                <input name="title" defaultValue={editBlog?.title || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Category</label>
                                <input name="category" defaultValue={editBlog?.category || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Author</label>
                                <input name="author" defaultValue={editBlog?.author || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Date</label>
                                <input name="date" type="date" defaultValue={editBlog?.date || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Thumbnail</label>
                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full p-2 rounded bg-gray-900 text-white" />
                                {thumbnail && (
                                    <img src={thumbnail} alt="thumb-preview" className="w-24 h-24 object-cover rounded mt-2" />
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Content</label>
                                <textarea name="content" value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminAccessWrapper>
    )
}

export default AdminBlogsManager