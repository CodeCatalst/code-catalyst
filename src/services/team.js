// src/services/team.js
import api from './api'

export const getTeamMembers = async () => {
  try {
    const response = await api.get('/admin/team')
    console.log('Team members fetched successfully:', response.data)
    return response
  } catch (error) {
    console.error('Failed to fetch team members:', error.response?.data || error)
    throw error
  }
}

export const addTeamMember = async (member) => {
  try {
    console.log('Adding team member:', member)
    const response = await api.post('/admin/team', member)
    console.log('Team member added successfully:', response.data)
    return response
  } catch (error) {
    console.error('Failed to add team member:', error.response?.data || error)
    throw error
  }
}

export const updateTeamMember = async (id, member) => {
  try {
    console.log('Updating team member:', id, member)
    const response = await api.patch(`/admin/team/${id}`, member)
    console.log('Team member updated successfully:', response.data)
    return response
  } catch (error) {
    console.error('Failed to update team member:', error.response?.data || error)
    throw error
  }
}

export const deleteTeamMember = async (id) => {
  try {
    console.log('Deleting team member:', id)
    const response = await api.delete(`/admin/team/${id}`)
    console.log('Team member deleted successfully:', response.data)
    return response
  } catch (error) {
    console.error('Failed to delete team member:', error.response?.data || error)
    throw error
  }
}
