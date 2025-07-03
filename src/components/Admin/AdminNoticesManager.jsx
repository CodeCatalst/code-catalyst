import React, { useState,useEffect } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import FormBuilder from './FormBuilder';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../../services/notices'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminNoticesManager = () => {
    const [notices, setNotices] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editNotice, setEditNotice] = useState(null)
    const [showSubmissions, setShowSubmissions] = useState(null)
    const [showFormBuilder, setShowFormBuilder] = useState(false)
    const [customForm, setCustomForm] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        fetchNotices()
    }, [])

    const fetchNotices = async () => {
        setLoading(true)
        try {
            const data = await getNotices()
            // Ensure all notices have submissions and form fields
            const safeData = (Array.isArray(data) ? data : []).map(n => ({
                ...n,
                submissions: Array.isArray(n.submissions) ? n.submissions : [],
                form: n.form || null
            }))
            setNotices(safeData)
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load notices' })
        } finally {
            setLoading(false)
        }
    }

    // Handlers
    const handleAdd = () => {
        setEditNotice(null)
        setShowForm(true)
    }
    const handleEdit = (notice) => {
        setEditNotice(notice)
        setShowForm(true)
        setCustomForm(notice.form)
    }
    const handleDelete = async (id) => {
        try {
            await deleteNotice(id)
            setNotices(notices.filter(n => n.id !== id))
            setMessage({ type: 'success', text: 'Notice deleted' })
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete notice' })
        }
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        const formEl = e.target
        const newNotice = {
            title: formEl.title.value,
            type: formEl.type.value,
            hasForm: formEl.hasForm.checked,
            description: formEl.description.value,
            submissions: editNotice && Array.isArray(editNotice.submissions) ? editNotice.submissions : [],
            form: formEl.hasForm.checked ? customForm : null
        }
        try {
            if (editNotice) {
                const updated = await updateNotice(editNotice.id, newNotice)
                setNotices(notices.map(n => n.id === editNotice.id ? {
                    ...updated,
                    submissions: Array.isArray(updated.submissions) ? updated.submissions : [],
                    form: updated.form || null
                } : n))
                setMessage({ type: 'success', text: 'Notice updated' })
            } else {
                const created = await createNotice(newNotice)
                setNotices([...notices, {
                    ...created,
                    submissions: Array.isArray(created.submissions) ? created.submissions : [],
                    form: created.form || null
                }])
                setMessage({ type: 'success', text: 'Notice added' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save notice' })
        }
        setShowForm(false)
        setEditNotice(null)
        setCustomForm(null)
        setShowFormBuilder(false)
    }
    const exportToPDF = (notice) => {
        const doc = new jsPDF()
        doc.setFontSize(18)
        doc.text(`Submissions for: ${notice.title}`, 14, 22)
        doc.setFontSize(12)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32)
        const tableData = (notice.submissions || []).map((sub, idx) => [
            idx + 1,
            sub.name,
            sub.email,
            ...Object.values(sub.answers || {})
        ])
        const head = [
            ['#', 'Name', 'Email', ...(notice.form?.fields?.map(f => f.label) || [])]
        ]
        autoTable(doc, {
            startY: 40,
            head,
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 10, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { top: 10 }
        })
        doc.save(`${notice.title.replace(/\s+/g, '_')}_submissions.pdf`)
    }

    return (
        <div className="text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Notice</h2>
                <button
                    className="btn-primary flex items-center gap-2 px-3 py-2 rounded-lg"
                    onClick={handleAdd}
                    title="Add Notice"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Add Notice</span>
                </button>
            </div>
            <table className="w-full bg-gray-900 rounded-lg mb-6">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="py-2 px-4 text-left">Title</th>
                        <th className="py-2 px-4 text-left">Type</th>
                        <th className="py-2 px-4 text-left">Has Form</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-8 text-gray-400 font-semibold">
                                No notices have been posted yet. Start by adding a new notice to keep everyone informed!
                            </td>
                        </tr>
                    ) : (
                        notices.map(notice => (
                            <tr key={notice.id} className="border-b border-gray-800">
                                <td className="py-2 px-4">{notice.title}</td>
                                <td className="py-2 px-4">{notice.type}</td>
                                <td className="py-2 px-4">{notice.hasForm ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 flex gap-2">
                                    <button
                                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                                        onClick={() => handleEdit(notice)}
                                        title="Edit Notice"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded"
                                        onClick={() => handleDelete(notice.id)}
                                        title="Delete Notice"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {notice.hasForm && (
                                        <button
                                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900 rounded"
                                            onClick={() => setShowSubmissions(notice)}
                                            title="View Submissions"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {/* Add/Edit Notice Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onSubmit={handleFormSubmit}>
                        <h3 className="text-xl font-bold mb-4">{editNotice ? 'Edit Notice' : 'Add Notice'}</h3>
                        <div className="mb-3">
                            <label className="block mb-1">Title</label>
                            <input name="title" defaultValue={editNotice?.title || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Type</label>
                            <input name="type" defaultValue={editNotice?.type || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                        </div>
                        <div className="mb-3">
                            <label className="inline-flex items-center">
                                <input type="checkbox" name="hasForm" defaultChecked={editNotice?.hasForm || false} className="mr-2"
                                    onChange={e => setShowFormBuilder(e.target.checked)}
                                />
                                Attach Form
                            </label>
                        </div>
                        {showFormBuilder && (
                            <div className="mb-3">
                                <FormBuilder
                                    onClose={() => setShowFormBuilder(false)}
                                    onSave={form => { setCustomForm(form); setShowFormBuilder(false); }}
                                    initialForm={customForm}
                                />
                                {customForm && (
                                    <div className="mt-2 text-green-400">Form attached!</div>
                                )}
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="block mb-1">Description</label>
                            <textarea name="description" defaultValue={editNotice?.description || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            )}
            {/* Submissions Modal */}
            {showSubmissions && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">Submissions for: {showSubmissions.title}</h3>
                        {showSubmissions.submissions.length === 0 ? (
                            <div className="text-gray-400">No submissions yet.</div>
                        ) : (
                            <table className="w-full bg-gray-900 rounded-lg mb-4">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Email</th>
                                        <th className="py-2 px-4 text-left">Answers</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showSubmissions.submissions.map((sub, idx) => (
                                        <tr key={sub.id || idx} className="border-b border-gray-800">
                                            <td className="py-2 px-4">{sub.name}</td>
                                            <td className="py-2 px-4">{sub.email}</td>
                                            <td className="py-2 px-4">
                                                <pre className="bg-gray-950 p-2 rounded text-xs whitespace-pre-wrap">{JSON.stringify(sub.answers, null, 2)}</pre>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="flex justify-end gap-2">
                            <button className="btn-secondary" onClick={() => setShowSubmissions(null)}>Close</button>
                            {showSubmissions.submissions.length > 0 && (
                                <button className="btn-primary" onClick={() => exportToPDF(showSubmissions)}>
                                    Export as PDF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminNoticesManager 