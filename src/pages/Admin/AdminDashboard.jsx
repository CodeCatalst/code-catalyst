import { useState, useEffect } from 'react'
import { getStats } from '../../services/stats'
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
import AdminNoticesManager from '../../components/Admin/AdminNoticesManager'
import AdminBlogsManager from '../../components/Admin/AdminBlogsManager'
import AdminGalleryManager from '../../components/Admin/AdminGalleryManager'
import AdminContactMessages from '../../components/Admin/AdminContactMessages'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('notices')
    const [showFormBuilder, setShowFormBuilder] = useState(false)
    const [stats, setStats] = useState({ totalForms: 0, totalSubmissions: 0, activeUsers: 0, thisMonth: 0 })
    useEffect(() => {
        (async () => {
            try {
                const s = await getStats();
                setStats({ ...s, thisMonth: 156 }); // TODO: Replace with real value if available
            } catch {
                setStats({ totalForms: 0, totalSubmissions: 0, activeUsers: 0, thisMonth: 0 });
            }
        })();
    }, []);

    const tabs = [
        { id: 'notices', label: 'Manage Notice' },
        { id: 'blogs', label: 'Manage Blogs' },
        { id: 'users', label: 'Manage Users' },
        { id: 'gallery', label: 'Gallery Manager' },
        { id: 'contact', label: 'Contact Messages' }
    ]

    const handleUserCountUpdate = (count) => {
        setUserCount(count)
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'notices':
                return <AdminNoticesManager />
            case 'blogs':
                return <AdminBlogsManager />
            case 'users':
                return <UserManagement />
            case 'gallery':
                return <AdminGalleryManager />
            case 'contact':
                return <AdminContactMessages />
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
                    <p className="text-gray-400">Manage notices, blogs, users, and gallery highlights</p>
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
                                <p className="text-2xl font-bold text-white">{stats.totalForms}</p>
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
                                <p className="text-2xl font-bold text-white">{stats.totalSubmissions}</p>
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
                                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
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
                                <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card">
                    <div className="border-b border-gray-700 mb-6">
                        <nav className="flex space-x-8 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-500'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
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