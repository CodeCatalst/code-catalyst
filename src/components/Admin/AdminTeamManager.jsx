import React, { useState, useEffect } from 'react'
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../../services/team'
import Toast from '../Common/Toast'

const emptyMember = {
  name: '',
  role: '',
  department: '',
  image: '',
  bio: '',
  skills: [],
  social: {}
}

const AdminTeamManager = ({ onClose, onChange }) => {
  const [members, setMembers] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyMember)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await getTeamMembers()
      // Parse skills and social fields for all members
      setMembers(res.data.map(m => ({
        ...m,
        skills: typeof m.skills === 'string' ? (m.skills ? m.skills.split(',').map(s => s.trim()).filter(Boolean) : []) : (Array.isArray(m.skills) ? m.skills : []),
        social: typeof m.social === 'string' ? (m.social ? JSON.parse(m.social) : {}) : (m.social || {})
      })))
    } catch (e) {
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member) => {
    setEditing(member.id)
    setForm({
      ...member,
      skills: Array.isArray(member.skills) ? member.skills : (typeof member.skills === 'string' ? member.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      social: typeof member.social === 'string' ? (member.social ? JSON.parse(member.social) : {}) : (member.social || {})
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return
    try {
      await deleteTeamMember(id)
      setToast({ message: 'Team member deleted.', type: 'success' })
      fetchMembers()
      onChange && onChange()
    } catch {
      setToast({ message: 'Failed to delete team member.', type: 'error' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Convert skills array to comma-separated string for backend
    const submitForm = {
      ...form,
      skills: Array.isArray(form.skills) ? form.skills.join(',') : '',
      social: typeof form.social === 'object' ? form.social : {}
    }
    try {
      if (editing) {
        await updateTeamMember(editing, submitForm)
        setToast({ message: 'Team member updated.', type: 'success' })
      } else {
        await addTeamMember(submitForm)
        setToast({ message: 'Team member added.', type: 'success' })
      }
      setEditing(null)
      setForm(emptyMember)
      fetchMembers()
      onChange && onChange()
    } catch {
      setToast({ message: 'Failed to save team member.', type: 'error' })
    }
  }

  return (
    <div className="p-4">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
        Manage Team Members
        <button
          className="ml-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-base"
          type="button"
          onClick={fetchMembers}
          title="Refresh"
        >
          ⟳ Refresh
        </button>
      </h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <>
          <div className="overflow-x-auto rounded-lg shadow mb-6">
            <table className="w-full text-left border-collapse bg-gray-800">
              <thead className="bg-gray-900 text-primary-400">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Skills</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} className={editing === m.id ? 'bg-primary-900/30' : 'hover:bg-gray-700/50'}>
                    <td className="px-4 py-2 font-semibold">{m.name}</td>
                    <td className="px-4 py-2">{m.role}</td>
                    <td className="px-4 py-2">{m.department}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {(m.skills || []).map((s, i) => <span key={i} className="bg-primary-700 text-white px-2 py-0.5 rounded text-xs">{s}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(m)} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">Edit</button>
                      <button onClick={() => handleDelete(m.id)} className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Remove Modal, show update form inline below table */}
          <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-primary-400">{editing ? 'Update' : 'Add'} Team Member</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input className="flex-1 p-2 rounded bg-gray-800 text-white" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input className="flex-1 p-2 rounded bg-gray-800 text-white" placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
              </div>
              <div className="flex gap-2">
                <input className="flex-1 p-2 rounded bg-gray-800 text-white" placeholder="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
                <input className="flex-1 p-2 rounded bg-gray-800 text-white" placeholder="Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              </div>
              <textarea className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Skills (comma separated)" value={form.skills.join(', ')} onChange={e => setForm(f => ({ ...f, skills: e.target.value.split(',').map(s => s.trim()) }))} />
              <input className="w-full p-2 rounded bg-gray-800 text-white" placeholder="Social (JSON)" value={JSON.stringify(form.social)} onChange={e => {
                try {
                  setForm(f => ({ ...f, social: JSON.parse(e.target.value) }))
                } catch {}
              }} />
              <div className="flex gap-2 justify-end">
                {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(emptyMember) }}>Cancel</button>}
                <button type="submit" className="px-4 py-2 rounded bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminTeamManager
