import { useState } from 'react'
import {
    X,
    Plus,
    Trash2,
    Move,
    Type,
    CheckSquare,
    Circle,
    Upload,
    Save,
    Calendar
} from 'lucide-react'

const FormBuilder = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        tags: [],
        fields: []
    })
    const [newTag, setNewTag] = useState('')
    const [newField, setNewField] = useState({
        type: 'text',
        label: '',
        required: false,
        options: []
    })

    const fieldTypes = [
        { id: 'text', label: 'Text Input', icon: Type },
        { id: 'textarea', label: 'Text Area', icon: Type },
        { id: 'email', label: 'Email', icon: Type },
        { id: 'number', label: 'Number', icon: Type },
        { id: 'radio', label: 'Radio Buttons', icon: Circle },
        { id: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
        { id: 'file', label: 'File Upload', icon: Upload },
        { id: 'date', label: 'Date', icon: Calendar }
    ]

    const addField = () => {
        if (newField.label.trim()) {
            setFormData(prev => ({
                ...prev,
                fields: [...prev.fields, { ...newField, id: Date.now() }]
            }))
            setNewField({
                type: 'text',
                label: '',
                required: false,
                options: []
            })
        }
    }

    const removeField = (fieldId) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.filter(field => field.id !== fieldId)
        }))
    }

    const updateField = (fieldId, updates) => {
        setFormData(prev => ({
            ...prev,
            fields: prev.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
            )
        }))
    }

    const addOption = (fieldId) => {
        const option = prompt('Enter option text:')
        if (option) {
            updateField(fieldId, {
                options: [...(formData.fields.find(f => f.id === fieldId)?.options || []), option]
            })
        }
    }

    const removeOption = (fieldId, optionIndex) => {
        updateField(fieldId, {
            options: formData.fields.find(f => f.id === fieldId)?.options.filter((_, index) => index !== optionIndex) || []
        })
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }))
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleSave = () => {
        // Here you would typically save to your backend
        console.log('Saving form:', formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-700 bg-gray-900">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-primary-400">Create New Form</h2>
                        <button
                            onClick={onClose}
                            className="text-primary-300 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-gray-900">
                    {/* Form Basic Info */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-primary-200 mb-4">Form Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-primary-300 mb-2">Form Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-primary-100"
                                    placeholder="Enter form title"
                                />
                            </div>
                            <div>
                                <label className="block text-primary-300 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-primary-100"
                                    placeholder="Enter form description"
                                />
                            </div>
                        </div>

                        {/* Availability Period */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-primary-300 mb-2">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-primary-100"
                                />
                            </div>
                            <div>
                                <label className="block text-primary-300 mb-2">End Date</label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-primary-100"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-4">
                            <label className="block text-primary-300 mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-primary-100"
                                    placeholder="Add a tag"
                                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                />
                                <button
                                    onClick={addTag}
                                    className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-300"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-primary-200 mb-4">Form Fields</h3>

                        {/* Add New Field */}
                        <div className="bg-gray-700 p-4 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-primary-300 mb-2">Field Type</label>
                                    <select
                                        value={newField.type}
                                        onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-primary-100"
                                    >
                                        {fieldTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-primary-300 mb-2">Field Label</label>
                                    <input
                                        type="text"
                                        value={newField.label}
                                        onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-primary-100"
                                        placeholder="Enter field label"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center text-primary-300">
                                        <input
                                            type="checkbox"
                                            checked={newField.required}
                                            onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                                            className="mr-2"
                                        />
                                        Required
                                    </label>
                                </div>
                            </div>

                            {/* Options for radio/checkbox */}
                            {(newField.type === 'radio' || newField.type === 'checkbox') && (
                                <div className="mb-4">
                                    <label className="block text-primary-300 mb-2">Options</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add option"
                                            className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-primary-100"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    setNewField(prev => ({
                                                        ...prev,
                                                        options: [...prev.options, e.target.value.trim()]
                                                    }))
                                                    e.target.value = ''
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newField.options.map((option, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-600 text-white rounded text-sm flex items-center gap-1"
                                            >
                                                {option}
                                                <button
                                                    onClick={() => setNewField(prev => ({
                                                        ...prev,
                                                        options: prev.options.filter((_, i) => i !== index)
                                                    }))}
                                                    className="hover:text-red-300"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={addField}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Add Field
                            </button>
                        </div>

                        {/* Existing Fields */}
                        <div className="space-y-4">
                            {formData.fields.map((field, index) => (
                                <div key={field.id} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-primary-300 mb-2">Field Type</label>
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(field.id, { type: e.target.value })}
                                                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-primary-100"
                                                    >
                                                        {fieldTypes.map(type => (
                                                            <option key={type.id} value={type.id}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-primary-300 mb-2">Field Label</label>
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                        className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-primary-100"
                                                    />
                                                </div>
                                                <div className="flex items-end">
                                                    <label className="flex items-center text-primary-300">
                                                        <input
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                            className="mr-2"
                                                        />
                                                        Required
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Options for radio/checkbox */}
                                            {(field.type === 'radio' || field.type === 'checkbox') && (
                                                <div className="mt-4">
                                                    <label className="block text-primary-300 mb-2">Options</label>
                                                    <div className="flex gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add option"
                                                            className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-primary-100"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                                    addOption(field.id)
                                                                    e.target.value = ''
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => addOption(field.id)}
                                                            className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {field.options.map((option, optionIndex) => (
                                                            <span
                                                                key={optionIndex}
                                                                className="px-2 py-1 bg-gray-600 text-white rounded text-sm flex items-center gap-1"
                                                            >
                                                                {option}
                                                                <button
                                                                    onClick={() => removeOption(field.id, optionIndex)}
                                                                    className="hover:text-red-300"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="ml-4 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save size={20} />
                            Save Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormBuilder