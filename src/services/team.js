// src/services/team.js
import api from './api'

export const getTeamMembers = async () => {
  try {
    const response = await api.get('/admin/team')
    return response
  } catch (error) {
    throw error
  }
}

export const addTeamMember = async (member) => {
  try {
    const response = await api.post('/admin/team', member)
    return response
  } catch (error) {
    throw error
  }
}

export const updateTeamMember = async (id, member) => {
  try {
    const response = await api.patch(`/admin/team/${id}`, member)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteTeamMember = async (id) => {
  try {
    const response = await api.delete(`/admin/team/${id}`)
    return response
  } catch (error) {
    throw error
  }
}
