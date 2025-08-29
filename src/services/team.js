// src/services/team.js
import api from './api'

export const getTeamMembers = () => api.get('/admin/team')
export const addTeamMember = (member) => api.post('/admin/team', member)
export const updateTeamMember = (id, member) => api.patch(`/admin/team/${id}`, member)
export const deleteTeamMember = (id) => api.delete(`/admin/team/${id}`)
