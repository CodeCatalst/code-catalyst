import { useState } from 'react'
import {
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    User,
    FileText,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const SubmissionsViewer = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [formFilter, setFormFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState('desc')
    const [expandedSubmission, setExpandedSubmission] = useState(null)

    // Mock data - replace with actual API calls
    const [submissions, setSubmissions] = useState([
        {
            id: 1,
            formId: 1,
            formTitle: 'Student Registration Form',
            userEmail: 'john.doe@university.edu',
            userName: 'John Doe',
            submittedAt: '2024-01-20T10:30:00Z',
            status: 'completed',
            responses: {
                'Full Name': 'John Doe',
                'Email': 'john.doe@university.edu',
                'Student ID': '2024001',
                'Department': 'Computer Science',
                'Year of Study': '3rd Year',
                'Interests': ['Web Development', 'AI/ML'],
                'Previous Experience': 'Some experience with React and Python'
            }
        },
        {
            id: 2,
            formId: 1,
            formTitle: 'Student Registration Form',
            userEmail: 'jane.smith@university.edu',
            userName: 'Jane Smith',
            submittedAt: '2024-01-19T14:15:00Z',
            status: 'completed',
            responses: {
                'Full Name': 'Jane Smith',
                'Email': 'jane.smith@university.edu',
                'Student ID': '2024002',
                'Department': 'Information Technology',
                'Year of Study': '2nd Year',
                'Interests': ['Mobile Development', 'UI/UX'],
                'Previous Experience': 'Beginner level'
            }
        },
        {
            id: 3,
            formId: 2,
            formTitle: 'Event Feedback Survey',
            userEmail: 'mike.wilson@university.edu',
            userName: 'Mike Wilson',
            submittedAt: '2024-02-05T09:45:00Z',
            status: 'completed',
            responses: {
                'Event Rating': '5',
                'What did you like most?': 'The hands-on workshops and networking opportunities',
                'What could be improved?': 'More time for Q&A sessions',
                'Would you attend again?': 'Yes',
                'Additional Comments': 'Great event overall!'
            }
        }
    ])

    const forms = [
        { id: 1, title: 'Student Registration Form' },
        { id: 2, title: 'Event Feedback Survey' },
        { id: 3, title: 'Workshop Application' }
    ]

    const filteredSubmissions = submissions.filter(submission => {
        const matchesSearch =
            submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.formTitle.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesForm = formFilter === 'all' || submission.formId.toString() === formFilter

        return matchesSearch && matchesForm
    }).sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
            case 'date':
                comparison = new Date(a.submittedAt) - new Date(b.submittedAt)
                break
            case 'name':
                comparison = a.userName.localeCompare(b.userName)
                break
            case 'form':
                comparison = a.formTitle.localeCompare(b.formTitle)
                break
            default:
                comparison = 0
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('asc')
        }
    }

    const exportToPDF = () => {
        const doc = new jsPDF()

        // Add title
        doc.setFontSize(20)
        doc.text('Form Submissions Report', 14, 22)

        // Add date
        doc.setFontSize(12)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32)

        // Add summary
        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.text('Summary', 14, 45)

        doc.setFontSize(10)
        doc.text(`Total Submissions: ${filteredSubmissions.length}`, 14, 55)
        doc.text(`Completed: ${filteredSubmissions.filter(s => s.status === 'completed').length}`, 14, 62)
        doc.text(`Forms: ${new Set(filteredSubmissions.map(s => s.formId)).size}`, 14, 69)
        doc.text(`Unique Users: ${new Set(filteredSubmissions.map(s => s.userEmail)).size}`, 14, 76)

        // Prepare table data
        const tableData = filteredSubmissions.map(sub => [
            sub.id,
            sub.formTitle,
            sub.userName,
            sub.userEmail,
            new Date(sub.submittedAt).toLocaleDateString(),
            sub.status
        ])

        // Add table
        autoTable(doc, {
            startY: 90,
            head: [['ID', 'Form', 'User Name', 'Email', 'Submitted Date', 'Status']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246], // Blue color
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 9
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252] // Light gray
            },
            margin: { top: 10 }
        })

        // Add detailed responses for each submission
        let currentY = doc.lastAutoTable.finalY + 20

        filteredSubmissions.forEach((submission, index) => {
            // Check if we need a new page
            if (currentY > 250) {
                doc.addPage()
                currentY = 20
            }

            doc.setFontSize(12)
            doc.setTextColor(0, 0, 0)
            doc.text(`Submission ${submission.id} Details`, 14, currentY)

            currentY += 10

            doc.setFontSize(10)
            doc.setTextColor(100, 100, 100)
            doc.text(`Form: ${submission.formTitle}`, 14, currentY)
            currentY += 6
            doc.text(`User: ${submission.userName} (${submission.userEmail})`, 14, currentY)
            currentY += 6
            doc.text(`Date: ${new Date(submission.submittedAt).toLocaleDateString()}`, 14, currentY)
            currentY += 10

            // Add responses
            doc.setTextColor(0, 0, 0)
            Object.entries(submission.responses).forEach(([question, answer]) => {
                if (currentY > 270) {
                    doc.addPage()
                    currentY = 20
                }

                doc.setFontSize(9)
                doc.setTextColor(75, 85, 99) // Gray color for questions
                doc.text(`${question}:`, 14, currentY)
                currentY += 5

                doc.setTextColor(0, 0, 0)
                const answerText = Array.isArray(answer) ? answer.join(', ') : answer.toString()

                // Handle long text wrapping
                const splitText = doc.splitTextToSize(answerText, 180)
                doc.text(splitText, 20, currentY)
                currentY += (splitText.length * 4) + 5
            })

            currentY += 10
        })

        // Save the PDF
        doc.save(`submissions_report_${new Date().toISOString().split('T')[0]}.pdf`)
    }

    const getSortIcon = (field) => {
        if (sortBy !== field) return null
        return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Form Submissions</h2>
                <button
                    onClick={exportToPDF}
                    className="btn-primary flex items-center gap-2"
                >
                    <Download size={20} />
                    Export PDF
                </button>
            </div>

            {/* Filters and Search */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or form..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4  overflow-x-auto">
                        <select
                            value={formFilter}
                            onChange={(e) => setFormFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                            <option value="all">All Forms</option>
                            {forms.map(form => (
                                <option key={form.id} value={form.id}>{form.title}</option>
                            ))}
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
                <table className="w-full bg-gray-900 rounded-lg">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th
                                className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900 cursor-pointer hover:text-white"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    Submitted
                                    {getSortIcon('date')}
                                </div>
                            </th>
                            <th
                                className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900 cursor-pointer hover:text-white"
                                onClick={() => handleSort('form')}
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={16} />
                                    Form
                                    {getSortIcon('form')}
                                </div>
                            </th>
                            <th
                                className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900 cursor-pointer hover:text-white"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    User
                                    {getSortIcon('name')}
                                </div>
                            </th>
                            <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Status</th>
                            <th className="text-left py-3 px-4 text-primary-400 font-semibold bg-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubmissions.map((submission) => (
                            <>
                                <tr key={submission.id} className="border-b border-gray-800 hover:bg-gray-800/70">
                                    <td className="py-4 px-4">
                                        <div className="text-sm">
                                            <div className="text-gray-100">{formatDate(submission.submittedAt)}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="text-primary-200 font-medium">{submission.formTitle}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>
                                            <div className="text-primary-100 font-medium">{submission.userName}</div>
                                            <div className="text-primary-300 text-sm">{submission.userEmail}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                                            {submission.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded"
                                            title="View Submission"
                                            onClick={() => setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900 rounded"
                                            title="Download PDF"
                                            onClick={exportToPDF}
                                        >
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                                {expandedSubmission === submission.id && (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-4 bg-gray-800">
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-semibold text-white mb-3">Submission Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {Object.entries(submission.responses).map(([question, answer]) => (
                                                        <div key={question} className="bg-gray-700 p-3 rounded">
                                                            <div className="text-gray-300 text-sm font-medium mb-1">{question}</div>
                                                            <div className="text-white">
                                                                {Array.isArray(answer) ? answer.join(', ') : answer}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredSubmissions.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-500 mb-4" size={48} />
                    <h3 className="text-xl font-medium text-gray-400 mb-2">No submissions found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card text-center">
                    <div className="text-2xl font-bold text-white">{filteredSubmissions.length}</div>
                    <div className="text-gray-400 text-sm">Total Submissions</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-green-500">
                        {filteredSubmissions.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-gray-400 text-sm">Completed</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-blue-500">
                        {new Set(filteredSubmissions.map(s => s.formId)).size}
                    </div>
                    <div className="text-gray-400 text-sm">Forms</div>
                </div>
                <div className="card text-center">
                    <div className="text-2xl font-bold text-purple-500">
                        {new Set(filteredSubmissions.map(s => s.userEmail)).size}
                    </div>
                    <div className="text-gray-400 text-sm">Unique Users</div>
                </div>
            </div>
        </div>
    )
}

export default SubmissionsViewer