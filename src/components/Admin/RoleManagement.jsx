import { useState, useEffect } from 'react';
import { Trash2, Search, Filter, RefreshCw, CheckCircle, AlertCircle, Plus, Shield } from 'lucide-react';
import AdminAccessWrapper from './AdminAccessWrapper';
import * as XLSX from 'xlsx';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  createPermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions
} from '../../services/roles';

const RoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [message, setMessage] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editRole, setEditRole] = useState(null)
  const [availablePermissions, setAvailablePermissions] = useState([])
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [editPermission, setEditPermission] = useState(null)

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      console.log('Raw permissions response:', response);
      
      let permissions;
      if (Array.isArray(response)) {
        permissions = response;
      } else if (response && Array.isArray(response.data)) {
        permissions = response.data;
      } else if (response && Array.isArray(response.permissions)) {
        permissions = response.permissions;
      } else {
        console.error('Unexpected permissions response format:', response);
        throw new Error('Invalid permissions data format');
      }

      // Validate each permission object
      const validPermissions = permissions.map(p => {
        if (typeof p !== 'object' || !p) {
          console.error('Invalid permission format:', p);
          return null;
        }
        if (!p.id || !p.name) {
          console.error('Permission missing required fields:', p);
          return null;
        }
        return {
          ...p,
          id: Number(p.id),
          name: String(p.name)
        };
      }).filter(Boolean);

      console.log('Processed permissions:', validPermissions);
      setAvailablePermissions(validPermissions);
      
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setMessage({ type: 'error', text: 'Failed to load permissions' });
      setAvailablePermissions([]); // Set empty array as fallback
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchRoles(), fetchPermissions()]);
    };
    init();
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await getRoles()
      setRoles(response)
      setMessage({ type: 'success', text: 'Roles loaded successfully' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to load roles' })
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const permissionData = {
      name: form.name.value,
      description: form.description.value
    }

    try {
      if (editPermission) {
        // Note: Assuming updatePermission exists, but backend may not have it
        setMessage({ type: 'info', text: 'Permission update not implemented' })
      } else {
        await createPermission(permissionData)
        setMessage({ type: 'success', text: 'Permission created successfully' })
      }
      await fetchPermissions()
      setShowPermissionForm(false)
      setEditPermission(null)
    } catch {
      setMessage({ type: 'error', text: 'Failed to save permission' })
    }
  }

  const handleDeletePermission = async (id) => {
    if (!confirm('Are you sure you want to delete this permission?')) return
    try {
      await deletePermission(id)
      setMessage({ type: 'success', text: 'Permission deleted successfully' })
      await fetchPermissions()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete permission' })
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteRole(id)
      setRoles(roles.filter(r => r.id !== id))
      setDeleteConfirm(null)
      setMessage({ type: 'success', text: 'Role deleted successfully' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete role' })
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const roleData = {
      name: form.name.value,
      description: form.description.value
    }

    try {
      let roleId;
      if (editRole) {
        await updateRole(editRole.id, roleData)
        roleId = editRole.id
        setMessage({ type: 'success', text: 'Role updated successfully' })
      } else {
        const newRole = await createRole(roleData)
        roleId = newRole.id
        setMessage({ type: 'success', text: 'Role created successfully' })
      }

      // Handle permissions
      const selectedPermissions = Array.from(form.querySelectorAll('input[name="permissions"]:checked'))
        .map(el => Number(el.getAttribute('data-permission-id')))
        .filter(id => !isNaN(id));

      // Get current permissions as array of IDs
      let currentPermissions = [];
      if (editRole) {
        const perms = await getRolePermissions(roleId);
        // perms may be array of objects or array of names, normalize to IDs
        if (Array.isArray(perms)) {
          if (perms.length && typeof perms[0] === 'object' && perms[0].id) {
            currentPermissions = perms.map(p => Number(p.id));
          } else if (typeof perms[0] === 'number') {
            currentPermissions = perms;
          } else if (typeof perms[0] === 'string') {
            // If only names, map to IDs using availablePermissions
            currentPermissions = perms.map(name => {
              const found = availablePermissions.find(p => p.name === name);
              return found ? Number(found.id) : null;
            }).filter(Boolean);
          }
        }
      }

      // Remove permissions that are no longer selected
      for (const permissionId of currentPermissions) {
        if (!selectedPermissions.includes(permissionId)) {
          await removePermissionFromRole(roleId, permissionId);
        }
      }

      // Add newly selected permissions
      for (const permissionId of selectedPermissions) {
        if (!currentPermissions.includes(permissionId)) {
          await assignPermissionToRole(roleId, permissionId);
        }
      }

      await fetchRoles()
      setShowForm(false)
      setEditRole(null)
    } catch (error) {
      console.error('Error saving role:', error)
      setMessage({ type: 'error', text: 'Failed to save role' })
    }
  }

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDownloadExcel = () => {
    const wsData = [
      ['Role Name', 'Description', 'Permissions'],
      ...filteredRoles.map(r => [
        r.name,
        r.description || '',
        (r.permissions || []).join(', ')
      ])
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Roles')
    XLSX.writeFile(wb, 'roles.xlsx')
  }

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
          <h2 className="text-2xl font-bold text-white">Manage Roles</h2>
          <div className="flex items-center gap-4">
            <div className="text-gray-400">Total Roles: {roles.length}</div>
            <button
              onClick={fetchRoles}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Refresh roles"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              className="btn-primary flex items-center gap-2 px-3 py-2 rounded-lg"
              onClick={() => { setEditRole(null); setShowForm(true) }}
              title="Add Role"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Role</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
              disabled={filteredRoles.length === 0}
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
            ? 'bg-green-900/50 border border-green-700 text-green-300'
            : 'bg-red-900/50 border border-red-700 text-red-300'
            }`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Permissions Management */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Manage Permissions</h3>
            <button
              onClick={() => { setEditPermission(null); setShowPermissionForm(true) }}
              className="btn-primary flex items-center gap-2 px-3 py-2 rounded-lg"
            >
              <Plus size={18} />
              Add Permission
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePermissions.map(permission => (
              <div key={permission.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-100">{permission.name}</div>
                  <div className="text-sm text-gray-400">{permission.description || 'No description'}</div>
                </div>
                <button
                  onClick={() => handleDeletePermission(permission.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                  title="Delete Permission"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {availablePermissions.length === 0 && (
            <div className="text-center py-4 text-gray-400">No permissions available.</div>
          )}
        </div>

        {/* Roles Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 rounded-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-primary-400 font-semibold text-center">Role</th>
                <th className="py-3 px-4 text-primary-400 font-semibold text-center">Description</th>
                <th className="py-3 px-4 text-primary-400 font-semibold text-center">Permissions</th>
                <th className="py-3 px-4 text-primary-400 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr key={role.id} className="border-b border-gray-800 hover:bg-gray-800/70 text-center">
                  <td className="py-4 px-4 text-gray-100 font-medium">{role.name}</td>
                  <td className="py-4 px-4 text-gray-300">{role.description || '-'}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {(role.permissions || []).join(', ') || 'No permissions'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => { setEditRole(role); setShowForm(true) }}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Shield size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(role.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRoles.length === 0 && (
            <div className="text-center py-8 text-gray-400">No roles found.</div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 overflow-auto">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this role?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
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

        {/* Permission Modal */}
        {showPermissionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md" onSubmit={handlePermissionSubmit}>
              <h3 className="text-xl font-bold mb-4">{editPermission ? 'Edit Permission' : 'Add Permission'}</h3>
              <div className="mb-3">
                <label className="block mb-1">Permission Name</label>
                <input name="name" defaultValue={editPermission?.name || ''} className="w-full p-2 rounded bg-gray-900 text-white" required />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Description</label>
                <textarea name="description" defaultValue={editPermission?.description || ''} className="w-full p-2 rounded bg-gray-900 text-white" rows={2} />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-secondary" onClick={() => setShowPermissionForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
            <form className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl overflow-auto" onSubmit={handleFormSubmit}>
              <h3 className="text-xl font-bold mb-4">{editRole ? 'Edit Role' : 'Add Role'}</h3>
              <div className="mb-3">
                <label className="block mb-1">Role Name</label>
                <input name="name" defaultValue={editRole?.name || ''} className="w-full p-2 rounded bg-gray-900 text-white break-words" required />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Description</label>
                <textarea name="description" defaultValue={editRole?.description || ''} className="w-full p-2 rounded bg-gray-900 text-white break-words" rows={2} />
              </div>
              <div className="mb-3">
                <label className="block mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-1 max-h-64 w-">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-2 break-words">
                      <input
                        type="checkbox"
                        name="permissions"
                        data-permission-id={permission.id}
                        value={permission.name}
                        defaultChecked={editRole?.permissions?.includes(permission.name)}
                        className="form-checkbox text-blue-500"
                      />
                      <span className="text-gray-200 break-words">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
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

export default RoleManagement
