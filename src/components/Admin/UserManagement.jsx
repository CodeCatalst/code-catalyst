import { useState, useEffect } from 'react'
import { Trash2, Search, Filter, User, Mail, Calendar, Shield, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../services/api'

const UserManagement = ({ onUserCountUpdate }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [message, setMessage] = useState(null)

    // Mock data for demonstration - replace with actual API call
    const mockUsers = [
        {
            id: 1,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            role: 'HR Lead',
            registrationDate: '2024-01-15',
            status: 'active'
        },
        {
            id: 2,
            fullName: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'Technical Lead',
            registrationDate: '2024-02-20',
            status: 'active'
        },
        {
            id: 3,
            fullName: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            role: 'Project Manager',
            registrationDate: '2024-03-10',
            status: 'active'
        },
        {
            id: 4,
            fullName: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            role: 'Developer',
            registrationDate: '2024-01-25',
            status: 'active'
        },
        {
            id: 5,
            fullName: 'David Brown',
            email: 'david.brown@example.com',
            role: 'Designer',
            registrationDate: '2024-02-05',
            status: 'active'
        }
    ]

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setUsers(mockUsers)
            setLoading(false)
        }, 1000)
    }, [])

    // Update parent component with user count
    useEffect(() => {
        if (onUserCountUpdate) {
            onUserCountUpdate(users.length)
        }
    }, [users.length, onUserCountUpdate])

    // Clear message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            // Replace with actual API call
            // const response = await api.get('/admin/users')
            // setUsers(response.data)
            setUsers(mockUsers)
            setMessage({ type: 'success', text: 'Users loaded successfully' })
        } catch (error) {
            console.error('Error fetching users:', error)
            setMessage({ type: 'error', text: 'Failed to load users' })
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (userId) => {
        try {
            // Replace with actual API call
            // await api.delete(`/admin/users/${userId}`)
            setUsers(users.filter(user => user.id !== userId))
            setDeleteConfirm(null)
            setMessage({ type: 'success', text: 'User deleted successfully' })
        } catch (error) {
            console.error('Error deleting user:', error)
            setMessage({ type: 'error', text: 'Failed to delete user' })
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        return matchesSearch && matchesRole
    })

    const roles = ['all', 'HR Lead', 'Technical Lead', 'Project Manager', 'Developer', 'Designer']

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="flex items-center gap-4">
                    <div className="text-gray-400">
                        Total Users: {users.length}
                    </div>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                        title="Refresh users"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                    ? 'bg-green-900/50 border border-green-700 text-green-300'
                    : 'bg-red-900/50 border border-red-700 text-red-300'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle size={16} />
                    ) : (
                        <AlertCircle size={16} />
                    )}
                    {message.text}
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={20} />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                    >
                        {roles.map(role => (
                            <option key={role} value={role}>
                                {role === 'all' ? 'All Roles' : role}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Full Name</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Registration Date</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                                            <User className="text-white" size={16} />
                                        </div>
                                        <span className="text-white font-medium">{user.fullName}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center text-gray-300">
                                        <Mail className="mr-2" size={16} />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center">
                                        <Shield className="mr-2 text-gray-400" size={16} />
                                        <span className="text-gray-300">{user.role}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center text-gray-300">
                                        <Calendar className="mr-2" size={16} />
                                        {new Date(user.registrationDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <button
                                        onClick={() => setDeleteConfirm(user.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete Account"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No users found matching your criteria.
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this user account? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => deleteUser(deleteConfirm)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement 