import { getAccessibleTabs, hasPermission } from "../../utils/adminAccess";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStats } from "../../services/stats";
import api, { getUsers } from "../../services/api";
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
  Search,
  Bell,
  BookOpen,
  Image,
  UserCog,
  Shield,
  Mail,
  MessageSquare,
  Briefcase,
  Trophy,
  LayoutDashboard,
  TrendingUp,
  Sparkles,
  Zap,
  Activity,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
} from "lucide-react";
import FormBuilder from "../../components/Admin/FormBuilder";
import FormManager from "../../components/Admin/FormManager";
import SubmissionsViewer from "../../components/Admin/SubmissionsViewer";
import UserManagement from "../../components/Admin/UserManagement";
import AdminNoticesManager from "../../components/Admin/AdminNoticesManager";
import AdminBlogsManager from "../../components/Admin/AdminBlogsManager";
import AdminGalleryManager from "../../components/Admin/AdminGalleryManager";
import CoreTeamFeedback from "../../components/Admin/CoreTeamFeedback.jsx";
import CoreTeamFeedbackResponses from "../../components/Admin/CoreTeamFeedbackResponses.jsx";
import AdminContactMessages from "../../components/Admin/AdminContactMessages";
import AdminHiringRequests from "../../components/Admin/AdminHiringRequests";
import AdminAccessWrapper from "../../components/Admin/AdminAccessWrapper";
import AdminTeamTab from "../../components/Admin/AdminTeamTab";
import RoleManagement from "../../components/Admin/RoleManagement.jsx";
import AdminEsportsManager from "../../components/Admin/AdminEsportsManager";
import AdminJbiansManager from "../../components/Admin/AdminJbiansManager";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [mobileUpdatesOpen, setMobileUpdatesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userFilter, setUserFilter] = useState("all"); // 'all', 'core', or specific filter
  const [activeTab, setActiveTab] = useState("overview");
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCore: 0,
    totalHiringRequests: 0,
  });
  const [userCount, setUserCount] = useState(0);

  // Show tabs based on user role
  const accessibleTabs = getAccessibleTabs(user?.permissions || []);

  useEffect(() => {
    // Only fetch stats if user is authenticated and has user_management permission or is admin
    if (
      !user ||
      (!hasPermission(user.permissions || [], "user_management") &&
        user.role !== "admin" &&
        user.role !== "super_admin")
    )
      return;

    (async () => {
      try {
        // Fetch users
        const users = await getUsers();
        const totalUsers = Array.isArray(users) ? users.length : 0;

        // Count core team members by role
        const coreRoles = [
          "admin",
          "team_lead",
          "team_member",
          "community_member",
          "HR Lead",
          "Technical Lead",
          "Project Manager",
          "Developer",
          "Designer",
          "staff",
          "Blogger",
        ];
        const totalCore = Array.isArray(users)
          ? users.filter((u) => coreRoles.includes(u.role)).length
          : 0;

        // Fetch hiring requests from backend
        const API_URL = import.meta.env.VITE_API_BASE;
        let totalHiringRequests = 0;
        try {
          const res = await fetch(`${API_URL}/api/hiring`);
          if (res.ok) {
            const data = await res.json();
            totalHiringRequests = Array.isArray(data.requests)
              ? data.requests.length
              : 0;
          }
        } catch {}

        setStats({
          totalUsers,
          totalCore,
          totalHiringRequests,
        });
      } catch (error) {
        // If unauthorized, force logout and redirect
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        // If unauthorized, stats will remain at default values
        setStats({ totalUsers: 0, totalCore: 0, totalHiringRequests: 0 });
      }
    })();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aboutOpen && !e.target.closest('#about-dropdown-container')) {
        setAboutOpen(false);
      }
      if (projectsOpen && !e.target.closest('#projects-dropdown-container')) {
        setProjectsOpen(false);
      }
      if (updatesOpen && !e.target.closest('#updates-dropdown-container')) {
        setUpdatesOpen(false);
      }
      if (userMenuOpen && !e.target.closest('#user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aboutOpen, projectsOpen, updatesOpen, userMenuOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Show tabs based on user role
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      gradient: "from-purple-500 to-pink-500",
      accessible: true,
    },
    {
      id: "notices",
      label: "Notices",
      icon: Bell,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "blogs",
      label: "Blogs",
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: Image,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "team",
      label: "Team",
      icon: UserCog,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: "contact",
      label: "Messages",
      icon: Mail,
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquare,
      gradient: "from-emerald-500 to-teal-500",
      accessible: true,
    },
    {
      id: "hiring",
      label: "Hiring",
      icon: Briefcase,
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      id: "esports",
      label: "Esports",
      icon: Trophy,
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "jbians",
      label: "JBIANS",
      icon: Users,
      gradient: "from-orange-500 to-yellow-500",
    },
  ].filter((tab) => tab.accessible || accessibleTabs.includes(tab.id));

  const handleUserCountUpdate = (count) => {
    setUserCount(count);
  };

  // If user is not allowed any tabs, do not render dashboard
  if (!user || !accessibleTabs.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
          <Shield className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">
            You do not have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Overview Dashboard Component
  const OverviewDashboard = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-pulse" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Welcome back, {user?.name || "Admin"}!
              </h2>
            </div>
            <p className="text-purple-100 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
              Here's what's happening with Code Catalyst today
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                <span className="text-white font-medium text-xs sm:text-sm">
                  All Systems Operational
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                <span className="text-white font-medium text-xs sm:text-sm">
                  High Activity
                </span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -mr-32 sm:-mr-48 -mt-32 sm:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -ml-24 sm:-ml-32 -mb-24 sm:-mb-32"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <button
            onClick={() => {
              setUserFilter("all");
              setActiveTab("users");
              setSidebarOpen(false);
            }}
            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer text-left active:scale-95"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg sm:rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
              Total Users
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view all users →
            </p>
          </button>

          <button
            onClick={() => {
              setUserFilter("core");
              setActiveTab("users");
              setSidebarOpen(false);
            }}
            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer text-left active:scale-95"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg sm:rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <UserCog className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
              Core Team
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.totalCore}
            </p>
            <p className="text-xs text-purple-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view core members →
            </p>
          </button>

          <button
            onClick={() => {
              setActiveTab("hiring");
              setSidebarOpen(false);
            }}
            className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-teal-500 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 hover:-translate-y-1 cursor-pointer text-left active:scale-95 sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-teal-500/10 rounded-lg sm:rounded-xl group-hover:bg-teal-500/20 transition-colors">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400" />
              </div>
            </div>
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-1">
              Hiring Requests
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.totalHiringRequests}
            </p>
            <p className="text-xs text-teal-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view hiring requests →
            </p>
          </button>
        </div>

        {/* All Admin Sections Overview */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
            All Admin Sections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {tabs
              .filter(
                (tab) =>
                  tab.id === "overview" || accessibleTabs.includes(tab.id)
              )
              .map((section) => {
                const Icon = section.icon;
                const isActive = activeTab === section.id;
                const gradient =
                  section.gradient || "from-gray-500 to-gray-600";

                // Helper function to get color from gradient
                const getColorClass = (type) => {
                  if (!gradient)
                    return type === "bg" ? "bg-gray-500/10" : "text-gray-400";

                  if (gradient.includes("blue"))
                    return type === "bg" ? "bg-blue-500/10" : "text-blue-400";
                  if (gradient.includes("green"))
                    return type === "bg" ? "bg-green-500/10" : "text-green-400";
                  if (gradient.includes("purple"))
                    return type === "bg"
                      ? "bg-purple-500/10"
                      : "text-purple-400";
                  if (gradient.includes("orange"))
                    return type === "bg"
                      ? "bg-orange-500/10"
                      : "text-orange-400";
                  if (gradient.includes("pink"))
                    return type === "bg" ? "bg-pink-500/10" : "text-pink-400";
                  if (gradient.includes("teal"))
                    return type === "bg" ? "bg-teal-500/10" : "text-teal-400";
                  if (gradient.includes("indigo"))
                    return type === "bg"
                      ? "bg-indigo-500/10"
                      : "text-indigo-400";
                  if (gradient.includes("yellow"))
                    return type === "bg"
                      ? "bg-yellow-500/10"
                      : "text-yellow-400";
                  if (gradient.includes("red"))
                    return type === "bg" ? "bg-red-500/10" : "text-red-400";
                  return type === "bg" ? "bg-gray-500/10" : "text-gray-400";
                };

                if (section.id === "feedback") {
                  return (
                    <Link
                      key={section.id}
                      to="/admin/feedback-responses"
                      className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 bg-slate-800/50 hover:bg-slate-800`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                      ></div>
                      <div className="relative z-10">
                        <div
                          className={`p-2 sm:p-3 ${getColorClass(
                            "bg"
                          )} rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4`}
                        >
                          <Icon
                            className={`w-5 h-5 sm:w-6 sm:h-6 ${getColorClass(
                              "text"
                            )}`}
                          />
                        </div>
                        <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">
                          {section.label}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                          {section.id === "feedback" &&
                            "Core team feedback system"}
                        </p>
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-medium">
                          <span>Open Page</span>
                          <span>→</span>
                        </div>
                      </div>
                    </Link>
                  );
                }
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveTab(section.id);
                      setSidebarOpen(false);
                    }}
                    className={`group relative overflow-hidden rounded-lg sm:rounded-xl p-4 sm:p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
                      isActive
                        ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20"
                        : "bg-slate-800/50 hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                    ></div>
                    <div className="relative z-10">
                      <div
                        className={`p-2 sm:p-3 ${getColorClass(
                          "bg"
                        )} rounded-lg sm:rounded-xl w-fit mb-3 sm:mb-4`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${getColorClass(
                            "text"
                          )}`}
                        />
                      </div>
                      <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">
                        {section.label}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                        {section.id === "overview" &&
                          "Dashboard overview and quick stats"}
                        {section.id === "users" &&
                          "Manage user accounts and permissions"}
                        {section.id === "notices" &&
                          "Create and manage platform notices"}
                        {section.id === "blogs" &&
                          "Write and publish blog posts"}
                        {section.id === "gallery" &&
                          "Manage event gallery and images"}
                        {section.id === "team" && "Manage team members"}
                        {section.id === "roles" &&
                          "Configure roles and permissions"}
                        {section.id === "contact" && "View contact messages"}
                        {section.id === "hiring" &&
                          "Review hiring applications"}
                        {section.id === "esports" &&
                          "Manage esports registrations"}
                        {section.id === "jbians" &&
                          "Manage JBIANS dance society registrations"}
                        {section.id === "forms" &&
                          "Create and manage custom forms"}
                        {section.id === "submissions" &&
                          "View form submissions"}
                      </p>
                      <div className="flex items-center gap-2 text-purple-400 text-xs font-medium">
                        <span>{isActive ? "Active" : "Open Section"}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "notices":
        return (
          <AdminAccessWrapper permission="notices_management">
            <AdminNoticesManager />
          </AdminAccessWrapper>
        );
      case "blogs":
        return (
          <AdminAccessWrapper permission="blogs_management">
            <AdminBlogsManager />
          </AdminAccessWrapper>
        );
      case "users":
        return (
          <AdminAccessWrapper permission="user_management">
            <UserManagement
              onUserCountUpdate={handleUserCountUpdate}
              initialFilter={userFilter}
            />
          </AdminAccessWrapper>
        );
      case "roles":
        return (
          <AdminAccessWrapper permission="roles_management">
            <RoleManagement />
          </AdminAccessWrapper>
        );
      case "gallery":
        return (
          <AdminAccessWrapper permission="gallery_management">
            <AdminGalleryManager />
          </AdminAccessWrapper>
        );
      case "feedback":
        return (
          <AdminAccessWrapper permission="core_team_feedback_responses">
            <CoreTeamFeedbackResponses />
          </AdminAccessWrapper>
        );
      case "contact":
        return (
          <AdminAccessWrapper permission="contact_messages">
            <AdminContactMessages />
          </AdminAccessWrapper>
        );
      case "hiring":
        return (
          <AdminAccessWrapper permission="hiring_requests">
            <AdminHiringRequests />
          </AdminAccessWrapper>
        );
      case "team":
        return (
          <AdminAccessWrapper permission="team_management">
            <AdminTeamTab />
          </AdminAccessWrapper>
        );
      case "esports":
        return (
          <AdminAccessWrapper permission="esports_management">
            <AdminEsportsManager />
          </AdminAccessWrapper>
        );
      case "jbians":
        return (
          <AdminAccessWrapper permission="jbians_management">
            <AdminJbiansManager />
          </AdminAccessWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative">
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
          <div className="px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg sm:rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-all lg:hidden active:scale-95"
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
                <a href="/" className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <img
                      src="/logo_transparent.png"
                      alt="Code Catalyst"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-base sm:text-xl font-bold text-white">
                      Admin Panel
                    </h1>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Code Catalyst
                    </p>
                  </div>
                </a>
              </div>

              {/* Desktop Navigation Links with Dropdowns */}
              <div className="hidden xl:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-8">
                <a
                  href="/"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  Home
                </a>
                <a
                  href="/team"
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  Team
                </a>

                {/* About Dropdown */}
                <div className="relative" id="about-dropdown-container">
                  <button
                    onClick={() => setAboutOpen(!aboutOpen)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      aboutOpen ? 'bg-primary-600/10 text-primary-600 border border-primary-600/30' : 'text-gray-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    About
                    <ChevronDown size={14} className={`transition-transform duration-200 ${aboutOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {aboutOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl shadow-2xl ring-1 ring-white/10 z-50 overflow-hidden">
                      <div className="py-2">
                        <a href="/about" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setAboutOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                        </a>
                        <a href="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setAboutOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                        </a>
                        <a href="/feedback" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setAboutOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-pink-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Core Feedback</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects Dropdown */}
                <div className="relative" id="projects-dropdown-container">
                  <button
                    onClick={() => setProjectsOpen(!projectsOpen)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      projectsOpen ? 'bg-primary-600/10 text-primary-600 border border-primary-600/30' : 'text-gray-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    Projects
                    <ChevronDown size={14} className={`transition-transform duration-200 ${projectsOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {projectsOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl shadow-2xl ring-1 ring-white/10 z-50 overflow-hidden">
                      <div className="py-2">
                        <a href="/projects" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setProjectsOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Projects</span>
                        </a>
                        <a href="/innovation" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setProjectsOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Innovation Cell</span>
                        </a>
                        <a href="/opensource" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setProjectsOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-pink-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Open Source</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Updates Dropdown */}
                <div className="relative" id="updates-dropdown-container">
                  <button
                    onClick={() => setUpdatesOpen(!updatesOpen)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      updatesOpen ? 'bg-primary-600/10 text-primary-600 border border-primary-600/30' : 'text-gray-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    Updates
                    <ChevronDown size={14} className={`transition-transform duration-200 ${updatesOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {updatesOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl shadow-2xl ring-1 ring-white/10 z-50 overflow-hidden">
                      <div className="py-2">
                        <a href="/gallery" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setUpdatesOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Event Gallery</span>
                        </a>
                        <a href="/blog" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setUpdatesOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Blog</span>
                        </a>
                        <a href="/notices" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-600/20 transition-all duration-200 group" onClick={() => setUpdatesOpen(false)}>
                          <div className="w-2 h-2 rounded-full bg-pink-400 group-hover:scale-125 transition-transform"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">Notices</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Profile & Mobile Nav */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="xl:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="relative" id="user-menu-container">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700/50 hover:border-primary-500/50 transition-all"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {user?.full_name?.charAt(0) || user?.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs sm:text-sm font-medium text-white truncate max-w-[120px]">
                        {user?.full_name || user?.name || "Admin"}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 capitalize">
                        {user?.role || "User"}
                      </p>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </a>
                      <a
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors text-primary-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield size={18} />
                        <span>Admin Panel</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileNavOpen && (
            <div className="xl:hidden border-t border-slate-800/50 bg-slate-900/95 backdrop-blur-xl">
              <div className="px-4 py-3 max-h-[70vh] overflow-y-auto">
                <div className="space-y-1">
                  <a
                    href="/"
                    className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    href="/team"
                    className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Team
                  </a>

                  {/* Mobile About Dropdown */}
                  <div className="mt-2">
                    <button
                      onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    >
                      <span>About</span>
                      {mobileAboutOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {mobileAboutOpen && (
                      <div className="pl-4 mt-2 space-y-1">
                        <a href="/about" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>About Us</a>
                        <a href="/contact" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Contact</a>
                        <a href="/feedback" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Core Feedback</a>
                      </div>
                    )}
                  </div>

                  {/* Mobile Projects Dropdown */}
                  <div className="mt-2">
                    <button
                      onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    >
                      <span>Projects</span>
                      {mobileProjectsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {mobileProjectsOpen && (
                      <div className="pl-4 mt-2 space-y-1">
                        <a href="/projects" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Projects</a>
                        <a href="/innovation" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Innovation Cell</a>
                        <a href="/opensource" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Open Source</a>
                      </div>
                    )}
                  </div>

                  {/* Mobile Updates Dropdown */}
                  <div className="mt-2">
                    <button
                      onClick={() => setMobileUpdatesOpen(!mobileUpdatesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                    >
                      <span>Updates</span>
                      {mobileUpdatesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {mobileUpdatesOpen && (
                      <div className="pl-4 mt-2 space-y-1">
                        <a href="/gallery" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Event Gallery</a>
                        <a href="/blog" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Blog</a>
                        <a href="/notices" className="block py-2 text-sm text-gray-400 hover:text-primary-400" onClick={() => setMobileNavOpen(false)}>Notices</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 sm:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 transition-all duration-300 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Stats Overview */}
              <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-700/50">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Users
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-700/50">
                    <UserCog className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mb-1" />
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Core Team
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {stats.totalCore}
                    </p>
                  </div>
                  <div className="col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-700/50">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400 mb-1" />
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Hiring Requests
                    </p>
                    <p className="text-base sm:text-lg font-bold text-white">
                      {stats.totalHiringRequests}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2 sm:mb-3">
                  Navigation
                </h3>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  if (tab.id === "feedback") {
                    return (
                      <Link
                        key={tab.id}
                        to="/admin/feedback-responses"
                        className={`w-full group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 active:scale-95 text-gray-400 hover:text-white hover:bg-slate-800/50`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex-1 text-left text-sm sm:text-base">
                          {tab.label}
                        </span>
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full group relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 active:scale-95 ${
                        isActive
                          ? `bg-gradient-to-r ${
                              tab.gradient || "from-purple-500 to-pink-500"
                            } text-white shadow-lg shadow-purple-500/30`
                          : "text-gray-400 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isActive ? "animate-pulse" : ""
                        }`}
                      />
                      <span className="flex-1 text-left text-sm sm:text-base">
                        {tab.label}
                      </span>
                      {isActive && (
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4 ml-auto animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Content Header */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  {tabs.find((t) => t.id === activeTab)?.icon &&
                    React.createElement(
                      tabs.find((t) => t.id === activeTab).icon,
                      {
                        className:
                          "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400",
                      }
                    )}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  Manage and monitor your platform content
                </p>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px] sm:min-h-[500px]">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Nav Overlay */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 xl:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && (
        <FormBuilder onClose={() => setShowFormBuilder(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
