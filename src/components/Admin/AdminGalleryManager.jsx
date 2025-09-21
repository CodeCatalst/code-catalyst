import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Trash2, Plus, Edit2, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { getGallery, createGalleryEvent, updateGalleryEvent, deleteGalleryEvent } from '../../services/gallery'
import AdminAccessWrapper from './AdminAccessWrapper';
import RichTextEditor from './RichTextEditor';

const AdminGalleryManager = () => {
    const [events, setEvents] = useState([])
    const [form, setForm] = useState({
        name: '',
        date: '',
        description: '',
        category: '',
        imageFiles: [], // array of files
        images: [], // array of base64 strings
    })
    const [message, setMessage] = useState(null)
    const [editId, setEditId] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)

    useEffect(() => {
        fetchGallery()
    }, [])

    const fetchGallery = async () => {
        try {
            const data = await getGallery()
            setEvents(data)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load gallery events' })
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imageFiles') {
            const selectedFiles = Array.from(files);
            if (selectedFiles.length > 0) {
                // Convert all files to base64
                const base64Promises = selectedFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });

                Promise.all(base64Promises).then(base64Strings => {
                    setForm({
                        ...form,
                        imageFiles: selectedFiles,
                        images: base64Strings
                    });
                }).catch(error => {
                    console.error('Error converting files to base64:', error);
                    setMessage({ type: 'error', text: 'Failed to process images' });
                });
            } else {
                setForm({ ...form, imageFiles: [], images: [] });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.date || !form.description || !form.category || form.images.length === 0) {
            setMessage({ type: 'error', text: 'All fields are required, including at least one image.' });
            return;
        }
        await submitGalleryEvent(form.images);
    }

    const submitGalleryEvent = async (imagesArray) => {
        try {
            const newEvent = { ...form, images: imagesArray };
            delete newEvent.imageFiles; // Remove file objects before sending
            const created = await createGalleryEvent(newEvent);
            setEvents([...events, created]);
            setForm({ name: '', date: '', description: '', category: '', imageFiles: [], images: [] });
            setMessage({ type: 'success', text: 'Event added!' });
            setTimeout(() => setMessage(null), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add event.' });
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteGalleryEvent(id)
            setEvents(events.filter(ev => ev.id !== id))
            setMessage({ type: 'success', text: 'Event deleted.' })
            setTimeout(() => setMessage(null), 2000)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete event.' })
        }
    }

    const handleEdit = (event) => {
        setEditId(event.id);
        setForm({
            name: event.name,
            date: event.date,
            description: event.description,
            category: event.category,
            imageFiles: [],
            images: event.images || (event.image_url ? [event.image_url] : []),
        });
        setShowEditModal(true);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.date || !form.description || !form.category || form.images.length === 0) {
            setMessage({ type: 'error', text: 'All fields are required, including at least one image.' });
            return;
        }
        await updateGalleryEvent(editId, { ...form, images: form.images });
        setEvents(await getGallery());
        setEditId(null);
        setForm({ name: '', date: '', description: '', category: '', imageFiles: [], images: [] });
        setShowEditModal(false);
        setMessage({ type: 'success', text: 'Event updated!' });
        setTimeout(() => setMessage(null), 2000);
    }

    const handleCancelEdit = () => {
        setEditId(null)
        setForm({ name: '', date: '', description: '', category: '', imageFiles: [], images: [] })
        setShowEditModal(false)
    }

    return (
        <AdminAccessWrapper permission="gallery_management">
            <div className="max-w-4xl mx-auto py-8 text-white">
                <h2 className="text-3xl font-bold mb-6">Gallery Manager</h2>
                <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Event Title</label>
                            <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required disabled={showEditModal} />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Date</label>
                            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required disabled={showEditModal} />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Category</label>
                            <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required disabled={showEditModal} />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Event Images (Multiple)</label>
                            <input name="imageFiles" type="file" accept="image/*" multiple onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required={!showEditModal} disabled={showEditModal} />
                            {form.images.length > 0 && (
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {form.images.map((image, index) => (
                                        <img key={index} src={image} alt={`Preview ${index + 1}`} className="h-20 rounded object-cover" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block mb-1 font-semibold">Description</label>
                        <RichTextEditor
                            value={form.description}
                            onChange={(content) => setForm({ ...form, description: content })}
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="btn-primary flex items-center gap-2" disabled={showEditModal}>
                            <Plus size={18} />
                            <span>Add Event</span>
                        </button>
                    </div>
                    {message && (
                        <div className={`mt-4 p-2 rounded ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{message.text}</div>
                    )}
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                            {/* Image Gallery */}
                            {event.images && event.images.length > 0 && (
                                <Link to={`/gallery/${event.id}`} className="relative group cursor-pointer block">
                                    <img src={event.images[0]} alt={event.name} className="w-full h-48 object-cover" />
                                    {event.images.length > 1 && (
                                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                            +{event.images.length - 1} more
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                        <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                                    </div>
                                </Link>
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold">{event.name}</h3>
                                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">{event.category}</span>
                                </div>
                                <div className="flex items-center text-primary-200 mb-2">
                                    <Calendar className="mr-2" size={16} />
                                    {new Date(event.date).toLocaleDateString()}
                                </div>
                                <p className="text-gray-300 mb-2">{event.description}</p>
                                <button onClick={() => handleDelete(event.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 p-2 rounded-full bg-gray-900/80" title="Delete Event">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => handleEdit(event)} className="absolute top-2 right-12 text-blue-400 hover:text-blue-300 p-2 rounded-full bg-gray-900/80" title="Edit Event">
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div className="text-gray-400 col-span-2 text-center font-semibold py-8">
                            No gallery events have been posted yet. Add a new highlight to showcase your amazing events!
                        </div>
                    )}
                </div>
                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onSubmit={handleUpdate}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Edit Event</h3>
                                <button type="button" onClick={handleCancelEdit} className="text-gray-400 hover:text-white"><X size={22} /></button>
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Event Title</label>
                                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Date</label>
                                <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Category</label>
                                <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Event Images (Multiple)</label>
                                <input name="imageFiles" type="file" accept="image/*" multiple onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white" />
                                {form.images.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {form.images.map((image, index) => (
                                            <img key={index} src={image} alt={`Preview ${index + 1}`} className="h-16 rounded object-cover" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Description</label>
                                <RichTextEditor
                                    value={form.description}
                                    onChange={(content) => setForm({ ...form, description: content })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminAccessWrapper>
    )
}

export default AdminGalleryManager