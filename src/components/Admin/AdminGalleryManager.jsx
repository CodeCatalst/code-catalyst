import { useState, useEffect } from 'react'
import { Calendar, Users, Trash2, Plus, Edit2, X } from 'lucide-react'
import { getGallery, createGalleryEvent, updateGalleryEvent, deleteGalleryEvent } from '../../services/gallery'

const AdminGalleryManager = () => {
    const [events, setEvents] = useState([])
    const [form, setForm] = useState({
        name: '',
        date: '',
        description: '',
        category: '',
        imageFile: null,
        imageUrl: '',
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
        const { name, value, files } = e.target
        if (name === 'imageFile') {
            const file = files[0]
            setForm({
                ...form,
                imageFile: file,
                imageUrl: file ? URL.createObjectURL(file) : '',
            })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.date || !form.description || !form.category || !form.imageFile) {
            setMessage({ type: 'error', text: 'All fields are required.' })
            return
        }
        let imageBase64 = form.imageUrl
        if (form.imageFile && !form.imageUrl.startsWith('data:')) {
            const reader = new FileReader()
            reader.onloadend = async () => {
                imageBase64 = reader.result
                await submitGalleryEvent(imageBase64)
            }
            reader.readAsDataURL(form.imageFile)
            return
        }
        await submitGalleryEvent(imageBase64)
    }

    const submitGalleryEvent = async (imageBase64) => {
        try {
            const newEvent = { ...form, image_url: imageBase64 };
            delete newEvent.thumbnail;
            const created = await createGalleryEvent(newEvent);
            setEvents([...events, created]);
            setForm({ name: '', date: '', description: '', category: '', imageFile: null, imageUrl: '' });
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
        setEditId(event.id)
        setForm({
            name: event.name,
            date: event.date,
            description: event.description,
            category: event.category,
            imageFile: null,
            imageUrl: event.thumbnail,
        })
        setShowEditModal(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.date || !form.description || !form.category || (!form.imageFile && !form.imageUrl)) {
            setMessage({ type: 'error', text: 'All fields are required.' });
            return;
        }
        await updateGalleryEvent(editId, { ...form, image_url: form.imageUrl });
        setEvents(await getGallery());
        setEditId(null);
        setForm({ name: '', date: '', description: '', category: '', imageFile: null, imageUrl: '' });
        setShowEditModal(false);
        setMessage({ type: 'success', text: 'Event updated!' });
        setTimeout(() => setMessage(null), 2000);
    }

    const handleCancelEdit = () => {
        setEditId(null)
        setForm({ name: '', date: '', description: '', category: '', imageFile: null, imageUrl: '' })
        setShowEditModal(false)
    }

    return (
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
                        <label className="block mb-1 font-semibold">Event Image</label>
                        <input name="imageFile" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" required={!showEditModal} disabled={showEditModal} />
                        {form.imageUrl && (
                            <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block mb-1 font-semibold">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full p-2 rounded bg-gray-800 text-white" required disabled={showEditModal} />
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
                        {event.thumbnail && (
                            <img src={event.thumbnail} alt={event.name} className="w-full h-48 object-cover" />
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
                            <label className="block mb-1">Event Image</label>
                            <input name="imageFile" type="file" accept="image/*" onChange={handleChange} className="w-full p-2 rounded bg-gray-900 text-white" />
                            {form.imageUrl && (
                                <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded object-cover" />
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full p-2 rounded bg-gray-900 text-white" required />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                            <button type="submit" className="btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AdminGalleryManager 