import { useState } from 'react'
import {
    FileText,
    Upload,
    Settings,
    BarChart3,
    Users,
    Calendar,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Filter,
    Search
} from 'lucide-react'
import FormBuilder from '../../components/Admin/FormBuilder'
import FormManager from '../../components/Admin/FormManager'
import SubmissionsViewer from '../../components/Admin/SubmissionsViewer'
import UserManagement from '../../components/Admin/UserManagement'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('forms')
    const [showFormBuilder, setShowFormBuilder] = useState(false)
    const [userCount, setUserCount] = useState(0)

    const tabs = [
        { id: 'forms', label: 'Manage Forms', icon: FileText },
        { id: 'submissions', label: 'View Submissions', icon: BarChart3 },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]

    const handleUserCountUpdate = (count) => {
        setUserCount(count)
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'forms':
                return (
                    <div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-0 justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Form Management</h2>
                            <button
                                onClick={() => setShowFormBuilder(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Create New Form
                            </button>
                        </div>
                        <FormManager />
                    </div>
                )
            case 'submissions':
                return <SubmissionsViewer />
            case 'users':
                return <UserManagement onUserCountUpdate={handleUserCountUpdate} />
            case 'settings':
                return (
                    <div className="card">
                        <h2 className="text-2xl font-bold text-white mb-4">Admin Settings</h2>
                        <p className="text-gray-400">Settings panel coming soon...</p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen  bg-gray-900 p-2 pt-24 sm:p-5 sm:pt-24">
            <div className="container-max">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage forms, view submissions, and control your application</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                                <FileText className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Total Forms</p>
                                <p className="text-2xl font-bold text-white">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <BarChart3 className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Total Submissions</p>
                                <p className="text-2xl font-bold text-white">1,247</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Active Users</p>
                                <p className="text-2xl font-bold text-white">{userCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">This Month</p>
                                <p className="text-2xl font-bold text-white">156</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card">
                    <div className="border-b border-gray-700 mb-6">
                        <nav className="flex space-x-8 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-primary-500 text-primary-500'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[500px]">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Form Builder Modal */}
            {showFormBuilder && (
                <FormBuilder onClose={() => setShowFormBuilder(false)} />
            )}
        </div>
    )
}

export default AdminDashboard 