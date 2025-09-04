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
import AdminAccessWrapper from '../../components/Admin/AdminAccessWrapper';
import AdminTeamTab from '../../components/Admin/AdminTeamTab';

const AdminDashboard = () => {
    const { user } = useAuth();
    // Show tabs based on user role
    const accessibleTabs = getAccessibleTabs(user?.role || '');
    // If user is not allowed any tabs, do not render dashboard
    if (!user || !accessibleTabs.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-gray-400 text-xl">You do not have access to the admin dashboard.</div>
            </div>
        );
    }

    // Set the default tab to the first accessible tab for the user
    const [activeTab, setActiveTab] = useState(() => accessibleTabs[0] || 'notices')
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
                ,'staff', 'Blogger'];
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

    // Show tabs based on user role
    const tabs = [
        { id: 'notices', label: 'Manage Notice' },
        { id: 'blogs', label: 'Manage Blogs' },
        { id: 'users', label: 'Manage Users' },
        { id: 'gallery', label: 'Manage Gallery' },
        { id: 'team', label: 'Manage Team' },
        // { id: 'CoreTeamFeedback', label: 'Feedback Form' },
        // { id: 'CoreTeamFeedbackResponses', label: 'Feedback Form Responses' },
        { id: 'contact', label: 'Contact Messages' },
        { id: 'hiring', label: 'Hiring Requests' },
    ].filter(tab => accessibleTabs.includes(tab.id));

    const handleUserCountUpdate = (count) => {
        setUserCount(count)
    }



    const renderTabContent = () => {
        switch (activeTab) {
            case 'notices':
                return (
                  <AdminAccessWrapper permission="notices_management">
                    <AdminNoticesManager />
                  </AdminAccessWrapper>
                );
            case 'blogs':
                return (
                  <AdminAccessWrapper permission="blogs_management">
                    <AdminBlogsManager />
                  </AdminAccessWrapper>
                );
            case 'users':
                return (
                  <AdminAccessWrapper permission="user_management">
                    <UserManagement onUserCountUpdate={handleUserCountUpdate} />
                  </AdminAccessWrapper>
                );
            case 'CoreTeamFeedback':
                return (
                  <AdminAccessWrapper permission="core_team_feedback">
                    <CoreTeamFeedback />
                  </AdminAccessWrapper>
                );
            case 'gallery':
                return (
                  <AdminAccessWrapper permission="gallery_management">
                    <AdminGalleryManager />
                  </AdminAccessWrapper>
                );
            case 'CoreTeamFeedbackResponses':
                return (
                  <AdminAccessWrapper permission="core_team_feedback_responses">
                    <CoreTeamFeedbackResponses />
                  </AdminAccessWrapper>
                );
            case 'contact':
                return (
                  <AdminAccessWrapper permission="contact_messages">
                    <AdminContactMessages />
                  </AdminAccessWrapper>
                );
            case 'hiring':
                return (
                  <AdminAccessWrapper permission="hiring_requests">
                    <AdminHiringRequests />
                  </AdminAccessWrapper>
                );
            case 'team':
                return (
                  <AdminAccessWrapper permission="team_management">
                    <AdminTeamTab />
                  </AdminAccessWrapper>
                );
            default:
                return null;
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