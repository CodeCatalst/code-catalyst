import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStats } from '../../services/stats'
import api, { getUsers } from '../../services/api'
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
import FormBuilder from '../../components/Admin/FormBuilder';
import FormManager from '../../components/Admin/FormManager';
import SubmissionsViewer from '../../components/Admin/SubmissionsViewer';
import UserManagement from '../../components/Admin/UserManagement';
import AdminNoticesManager from '../../components/Admin/AdminNoticesManager';
import AdminBlogsManager from '../../components/Admin/AdminBlogsManager';
import AdminGalleryManager from '../../components/Admin/AdminGalleryManager';
import CoreTeamFeedback from "../../components/Admin/CoreTeamFeedback.jsx";
import CoreTeamFeedbackResponses from "../../components/Admin/CoreTeamFeedbackResponses.jsx";
import AdminContactMessages from '../../components/Admin/AdminContactMessages';
import AdminHiringRequests from '../../components/Admin/AdminHiringRequests';
import { getAccessibleTabs } from '../../components/Admin/AdminAccessWrapper';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('notices')
    const [showFormBuilder, setShowFormBuilder] = useState(false)
    const [stats, setStats] = useState({ totalUsers: 0, totalCore: 0, totalHiringRequests: 0 });
    const [userCount, setUserCount] = useState(0);
    useEffect(() => {
        (async () => {
            try {
                // Fetch users
                const users = await getUsers();
                const totalUsers = Array.isArray(users) ? users.length : 0;

                // Count core team members by role
                const coreRoles = [
                  'admin', 'team_lead', 'team_member', 'community_member', 'HR Lead', 'Technical Lead', 'Project Manager', 'Developer', 'Designer'
                ];
                const totalCore = Array.isArray(users) ? users.filter(u => coreRoles.includes(u.role)).length : 0;

                // Fetch hiring requests from backend
                const API_URL = import.meta.env.VITE_API_BASE;
                let totalHiringRequests = 0;
                try {
                  const res = await fetch(`${API_URL}/api/hiring`);
                  if (res.ok) {
                    const data = await res.json();
                    totalHiringRequests = Array.isArray(data.requests) ? data.requests.length : 0;
                  }
                } catch {}

                setStats({
                    totalUsers,
                    totalCore,
                    totalHiringRequests
                });
            } catch {
                setStats({ totalUsers: 0, totalCore: 0, totalHiringRequests: 0 });
            }
        })();
    }, []);

    // Show all tabs to every member (no access filtering)
    const tabs = [
        { id: 'notices', label: 'Manage Notice' },
        { id: 'blogs', label: 'Manage Blogs' },
        { id: 'users', label: 'Manage Users' },
        { id: 'gallery', label: 'Manage Gallery' },
        { id: 'CoreTeamFeedback', label: 'Feedback Form' },
        { id: 'CoreTeamFeedbackResponses', label: 'Feedback Form Responses' },
        { id: 'contact', label: 'Contact Messages' },
        { id: 'hiring', label: 'Hiring Requests' },
    ];

    const handleUserCountUpdate = (count) => {
        setUserCount(count)
    }



    const renderTabContent = () => {
        switch (activeTab) {
            case 'notices':
                // Only allow admins
                if (!user || user.role !== 'admin') {
                    return <div className="text-red-500 p-4">Access denied. Only admins can view feedback responses.</div>;
                }
                else{
                return <AdminNoticesManager />
                }
            case 'blogs':
                // Only allow admins
                if (!user || user.role !== 'admin') {
                    return <div className="text-red-500 p-4">Access denied. Only admins can view feedback responses.</div>;
                }
                else{
                return <AdminBlogsManager />
                }
            case 'users':
                // Only allow admins
                if (!user || user.role !== 'admin') {
                    return <div className="text-red-500 p-4">Access denied. Only admins can view feedback responses.</div>;
                }
                else{
                return <UserManagement onUserCountUpdate={handleUserCountUpdate} />
                }
            case 'CoreTeamFeedback':
                return <CoreTeamFeedback />
            case 'gallery':
                return <AdminGalleryManager />
            case 'CoreTeamFeedbackResponses':
                // Only allow admins
                if (!user || user.role !== 'admin') {
                    return <div className="text-red-500 p-4">Access denied. Only admins can view feedback responses.</div>;
                }
                else{
                    return <CoreTeamFeedbackResponses />
                }
            case 'contact':
                return <AdminContactMessages />
            case 'hiring':
                if (user && (user.role === 'HR Lead' || user.role === 'admin' || (Array.isArray(user.roles) && (user.roles.includes('HR Lead') || user.roles.includes('admin'))))) {
                    return <AdminHiringRequests />
                } else {
                    return <div className="text-red-500 p-4">Access denied. Only HR Lead or Admin can view hiring requests.</div>;
                }
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

                {/* Stats Cards - Updated */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Total Core Team</p>
                                <p className="text-2xl font-bold text-white">{stats.totalCore}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                                <BarChart3 className="text-white" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">Hiring Requests</p>
                                <p className="text-2xl font-bold text-white">{stats.totalHiringRequests}</p>
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