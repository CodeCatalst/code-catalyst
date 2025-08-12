import { useState, useEffect } from 'react'
import { Trash2, Search, Filter, User, Mail, Calendar, Shield, RefreshCw, CheckCircle, AlertCircle, Plus, KeyRound } from 'lucide-react'
import api, { updateUserRole, expireUserPassword, createUser, updateUser } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import AdminAccessWrapper from './AdminAccessWrapper'
import * as XLSX from 'xlsx'

const UserManagement = ({ onUserCountUpdate }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [message, setMessage] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editUser, setEditUser] = useState(null)
    const { user: currentUser } = useAuth()
    const [editingNotes, setEditingNotes] = useState({});
    const [savingNotesId, setSavingNotesId] = useState(null);

    useEffect(() => {
        // Fetch users from backend
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await api.get('/users')
                // Map backend fields to frontend fields if needed
                const usersData = response.data.map(u => ({
                    id: u.id,
                    fullName: u.full_name || u.username,
                    email: u.email,
                    role: u.role || 'User',
                    registrationDate: u.created_at,
                    status: 'active',
                }))
                setUsers(usersData)
                // Fetch notes for each user (as a single string)
                const notesMap = {};
                await Promise.all(usersData.map(async (u) => {
                    try {
                        const notesRes = await api.get(`/users/${u.id}/notes`);
                        notesMap[u.id] = notesRes.data?.notes || '';
                    } catch {
                        notesMap[u.id] = '';
                    }
                }));
                setEditingNotes(notesMap);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to load users' })
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
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
            const response = await api.get('/users')
            const usersData = response.data.map(u => ({
                id: u.id,
                fullName: u.full_name || u.username,
                email: u.email,
                role: u.role || 'User',
                registrationDate: u.created_at,
                status: 'active',
            }))
            setUsers(usersData)
            setMessage({ type: 'success', text: 'Users loaded successfully' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load users' })
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`)
            setUsers(users.filter(user => user.id !== userId))
            setDeleteConfirm(null)
            setMessage({ type: 'success', text: 'User deleted successfully' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete user' })
        }
    }

    // Add handler for role change
    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole)
            setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u))
            setMessage({ type: 'success', text: 'Role updated successfully' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update role' })
        }
    }

    // Add handler for expiring password
    const handleExpirePassword = async (userId) => {
        try {
            await expireUserPassword(userId)
            setMessage({ type: 'success', text: 'Password expiration triggered' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to expire password' })
        }
    }

    const handleAdd = () => {
        setEditUser(null)
        setShowForm(true)
    }
    const handleEdit = (user) => {
        setEditUser(user)
        setShowForm(true)
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userData = {
            full_name: form.fullName.value,
            email: form.email.value,
            password: form.password ? form.password.value : undefined, // Only for new users
            role: form.role.value,
        };
        try {
            if (editUser) {
                // Update user (password not updated here)
                await updateUser(editUser.id, userData);
                setMessage({ type: 'success', text: 'User updated successfully' });
            } else {
                if (!form.password.value) {
                    setMessage({ type: 'error', text: 'Password is required for new users' });
                    return;
                }
                await createUser(userData);
                setMessage({ type: 'success', text: 'User added successfully' });
            }
            fetchUsers();
            setShowForm(false);
            setEditUser(null);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save user' });
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = filterRole === 'all' || user.role === filterRole
        return matchesSearch && matchesRole
    })

    const roles = ['all', 'admin', 'user', 'team_lead', 'team_member', 'community_member', 'HR Lead', 'Technical Lead', 'Project Manager', 'Developer', 'Designer']

    // Excel download handler
    const handleDownloadExcel = () => {
        const wsData = [
            ['Full Name', 'Email', 'Role', 'Registration Date', 'Status'],
            ...filteredUsers.map(user => [
                user.fullName,
                user.email,
                user.role,
                user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : '',
                user.status
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users.xlsx');
    };

    const handleNotesInputChange = (id, value) => {
        setEditingNotes(prev => ({ ...prev, [id]: value }));
    };
    const handleNotesSave = async (id) => {
        setSavingNotesId(id);
        try {
            const noteContent = editingNotes[id] || '';
            await api.put(`/users/${id}/notes`, { notes: noteContent });
            setMessage({ type: 'success', text: 'Notes updated successfully' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to update notes' });
        } finally {
            setSavingNotesId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <AdminAccessWrapper permission="user_management">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Manage Users</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-gray-400">
                            Total Users: {users.length}
                        </div>
                        <button
                            onClick={fetchUsers}
                            disabled={loading}
                            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                            title="Refresh users"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            className="btn-primary flex items-center gap-2 px-3 py-2 rounded-lg"
                            onClick={handleAdd}
                            title="Add User"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
                            disabled={filteredUsers.length === 0}
                        >
                            Download Excel
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
                    <table className="w-full bg-gray-900 rounded-lg">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Full Name</th>
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Email</th>
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Role</th>
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Registration Date</th>
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Remarks</th>
                                <th className="text-center py-3 px-4 text-primary-400 font-semibold bg-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/70 text-center">
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                                                <User className="text-white" size={16} />
                                            </div>
                                            <span className="text-gray-100 font-medium">{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center text-primary-200">
                                            <Mail className="mr-2" size={16} />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <Shield className="mr-2 text-primary-300" size={16} />
                                            <select
                                                value={user.role}
                                                onChange={e => handleRoleChange(user.id, e.target.value)}
                                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-primary-200 text-center"
                                            >
                                                <option value="User">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="team_lead">Team Lead</option>
                                                <option value="team_member">Team Member</option>
                                                <option value="community_member">Community Member</option>
                                                <option value="HR Lead">HR Lead</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center text-primary-200">
                                            <Calendar className="mr-2" size={16} />
                                            {new Date(user.registrationDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <textarea
                                                value={editingNotes[user.id] !== undefined ? editingNotes[user.id] : ''}
                                                onChange={e => handleNotesInputChange(user.id, e.target.value)}
                                                disabled={savingNotesId === user.id}
                                                placeholder={'Add notes...'}
                                                className="rounded bg-gray-800 border border-gray-700 text-white px-2 w-full resize-y focus:ring-blue-500 text-center"
                                                style={{ fontFamily: 'inherit', fontSize: '1rem', minWidth: '120px' }}
                                                rows={Math.max(2, (editingNotes[user.id] || '').split('\n').length)}
                                            />
                                            <button
                                                onClick={() => handleNotesSave(user.id)}
                                                disabled={savingNotesId === user.id}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-60 mt-1 mx-auto"
                                                style={{ minWidth: '70px' }}
                                            >
                                                {savingNotesId === user.id ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => setDeleteConfirm(user.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
                                                title="Delete Account"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleExpirePassword(user.id)}
                                                className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                                                title="Expire Password"
                                            >
                                                <KeyRound size={18} />
                                            </button>
                                        </div>
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

                {/* Add/Edit User Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onSubmit={handleFormSubmit}>
                            <h3 className="text-xl font-bold mb-4">{editUser ? 'Edit User' : 'Add User'}</h3>
                            <div className="mb-3">
                                <label className="block mb-1">Full Name</label>
                                <input name="fullName" defaultValue={editUser?.fullName || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Email</label>
                                <input name="email" type="email" defaultValue={editUser?.email || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Role</label>
                                <select name="role" defaultValue={editUser?.role || 'user'} className="w-full p-2 rounded bg-gray-900 text-white">
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="team_lead">Team Lead</option>
                                    <option value="team_member">Team Member</option>
                                    <option value="community_member">Community Member</option>
                                    <option value="HR Lead">HR Lead</option>
                                    <option value="Technical Lead">Technical Lead</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Designer">Designer</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1">Notes</label>
                                <textarea name="notes" defaultValue={editUser?.notes || ''} className="w-full p-2 rounded bg-gray-900 text-white" rows={3} />
                            </div>
                            {!editUser && (
                                <div className="mb-3">
                                    <label className="block mb-1">Password</label>
                                    <input name="password" type="password" className="w-full p-2 rounded bg-gray-900 text-white" required />
                                </div>
                            )}
                            <div className="flex gap-2 justify-end">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminAccessWrapper>
    )
}

export default UserManagement