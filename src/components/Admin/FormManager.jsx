import { useState } from 'react'
import {
    Edit,
    Trash2,
    Eye,
    Download,
    Filter,
    Search,
    MoreVertical,
    FileText,
    Upload,
    Calendar,
    Tag
} from 'lucide-react'
import AdminAccessWrapper from './AdminAccessWrapper';

const FormManager = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')

    // Mock data - replace with actual API calls
    const [forms, setForms] = useState([
        {
            id: 1,
            title: 'Student Registration Form',
            description: 'Annual student registration for Code Catalyst',
            type: 'custom',
            status: 'active',
            submissions: 45,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            tags: ['Registration', 'Students'],
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            title: 'Event Feedback Survey',
            description: 'Feedback form for hackathon participants',
            type: 'uploaded',
            status: 'active',
            submissions: 23,
            startDate: '2024-02-01',
            endDate: '2024-02-28',
            tags: ['Feedback', 'Event'],
            createdAt: '2024-02-01'
        },
        {
            id: 3,
            title: 'Workshop Application',
            description: 'Application form for advanced workshops',
            type: 'custom',
            status: 'archived',
            submissions: 67,
            startDate: '2023-09-01',
            endDate: '2023-12-31',
            tags: ['Workshop', 'Application'],
            createdAt: '2023-08-15'
        }
    ])

    const filteredForms = forms.filter(form => {
        const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            form.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || form.status === statusFilter
        const matchesType = typeFilter === 'all' || form.type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    const handleDelete = (formId) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            setForms(prev => prev.filter(form => form.id !== formId))
        }
    }

    const handleToggleStatus = (formId) => {
        setForms(prev => prev.map(form =>
            form.id === formId
                ? { ...form, status: form.status === 'active' ? 'archived' : 'active' }
                : form
        ))
    }

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-600 text-white',
            archived: 'bg-gray-600 text-white',
            draft: 'bg-yellow-600 text-white'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    const getTypeBadge = (type) => {
        const styles = {
            custom: 'bg-blue-600 text-white',
            uploaded: 'bg-purple-600 text-white'
        }
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        )
    }

    return (
        <AdminAccessWrapper permission="form_management">
            <div>
                {/* Filters and Search */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search forms..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                                <option value="draft">Draft</option>
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="custom">Custom</option>
                                <option value="uploaded">Uploaded</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Forms Table */}
                <div className="overflow-x-auto">
                    <table className="w-full bg-gray-900 rounded-lg">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Form</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Type</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Status</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Submissions</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Availability</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Tags</th>
                                <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredForms.map((form) => (
                                <tr key={form.id} className="border-b border-gray-800 hover:bg-gray-800/70">
                                    <td className="py-4 px-4">
                                        <div>
                                            <h4 className="text-gray-100 font-medium">{form.title}</h4>
                                            <p className="text-primary-200 text-sm">{form.description}</p>
                                            <p className="text-primary-300 text-xs">Created: {form.createdAt}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        {getTypeBadge(form.type)}
                                    </td>
                                    <td className="py-4 px-4">
                                        {getStatusBadge(form.status)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-primary-100 font-medium">{form.submissions}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <div className="text-primary-200">Start: {form.startDate}</div>
                                            <div className="text-primary-300">End: {form.endDate}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {form.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-700 text-primary-200 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                                                title="View Form"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900 rounded"
                                                title="Edit Form"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900 rounded"
                                                title="View Submissions"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(form.id)}
                                                className={`p-2 rounded ${form.status === 'active'
                                                        ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900'
                                                        : 'text-green-400 hover:text-green-300 hover:bg-green-900'
                                                    }`}
                                                title={form.status === 'active' ? 'Archive Form' : 'Activate Form'}
                                            >
                                                <Calendar size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(form.id)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded"
                                                title="Delete Form"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredForms.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto text-gray-500 mb-4" size={48} />
                        <h3 className="text-xl font-medium text-gray-400 mb-2">No forms found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </AdminAccessWrapper>
    )
}

export default FormManager