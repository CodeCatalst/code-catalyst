import api from './api'

export async function createContribution(contribution) {
  try {
    const response = await api.post('/opensource/contributions', contribution)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit contribution')
  }
}

export async function getContributions() {
  try {
    const response = await api.get('/opensource/contributions')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch contributions')
  }
}

export async function getContribution(id) {
  try {
    const response = await api.get(`/opensource/contributions/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch contribution')
  }
}
