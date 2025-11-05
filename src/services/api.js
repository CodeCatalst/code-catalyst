import axios from 'axios'
import { API_BASE } from './apiBase'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Simple in-memory GET cache for this axios instance to reduce perceived load time
const getCache = new Map()
const DEFAULT_TTL = 30 * 1000 // 30 seconds
const originalGet = api.get.bind(api)
api.get = async function (url, config) {
  try {
    const paramsKey = config && config.params ? JSON.stringify(config.params) : ''
    const key = `${url}|${paramsKey}`
    const entry = getCache.get(key)
    if (entry && Date.now() - entry.t < (config && config.ttl ? config.ttl : DEFAULT_TTL)) {
      return entry.res
    }

    const res = await originalGet(url, config)
    getCache.set(key, { res, t: Date.now() })
    return res
  } catch (err) {
    throw err
  }
}

// USERS
export async function getUsers() {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch users')
  }
}

export async function getUser(id) {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user')
  }
}

export async function createUser(user) {
  try {
    const response = await api.post('/users', user)
    return response.data
  } catch (error) {
    throw new Error('Failed to create user')
  }
}

export async function updateUser(id, user) {
  try {
    const response = await api.put(`/users/${id}`, user)
    return response.data
  } catch (error) {
    throw new Error('Failed to update user')
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/users/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete user')
  }
}

export async function updateUserRole(userId, role) {
  try {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  } catch (error) {
    throw new Error('Failed to update user role')
  }
}

export async function expireUserPassword(id) {
  try {
    const response = await api.post(`/users/${id}/expire-password`)
    return response.data
  } catch (error) {
    throw new Error('Failed to expire user password')
  }
}

// ROLES
export async function getRoles() {
  try {
    const response = await api.get('/roles')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch roles')
  }
}

export async function createRole(role) {
  try {
    const response = await api.post('/roles', role)
    return response.data
  } catch (error) {
    throw new Error('Failed to create role')
  }
}

export async function updateRole(id, role) {
  try {
    const response = await api.put(`/roles/${id}`, role)
    return response.data
  } catch (error) {
    throw new Error('Failed to update role')
  }
}

export async function deleteRole(id) {
  try {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete role')
  }
}

// FORMS
export async function getForms() {
  try {
    const response = await api.get('/forms')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch forms')
  }
}

export async function getForm(id) {
  try {
    const response = await api.get(`/forms/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch form')
  }
}

export async function createForm(form) {
  try {
    const response = await api.post('/forms', form)
    return response.data
  } catch (error) {
    throw new Error('Failed to create form')
  }
}

export async function updateForm(id, form) {
  try {
    const response = await api.put(`/forms/${id}`, form)
    return response.data
  } catch (error) {
    throw new Error('Failed to update form')
  }
}

export async function deleteForm(id) {
  try {
    const response = await api.delete(`/forms/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete form')
  }
}

// SUBMISSIONS
export async function getSubmissions() {
  try {
    const response = await api.get('/submissions')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch submissions')
  }
}

export async function getSubmission(id) {
  try {
    const response = await api.get(`/submissions/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch submission')
  }
}

export async function createSubmission(submission) {
  try {
    const response = await api.post('/submissions', submission)
    return response.data
  } catch (error) {
    throw new Error('Failed to create submission')
  }
}

// ESPORTS REGISTRATIONS
export async function getEsportsRegistrations() {
  try {
    const response = await api.get('/esports')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch esports registrations')
  }
}

export async function getEsportsRegistration(id) {
  try {
    const response = await api.get(`/esports/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch esports registration')
  }
}

export async function createEsportsRegistration(registration) {
  try {
    const response = await api.post('/esports', registration)
    return response.data
  } catch (error) {
    // Check if it's a network error
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      const networkError = new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.')
      networkError.originalError = error
      networkError.isNetworkError = true
      throw networkError
    }

    // Check if it's a CORS error
    if (error.message?.includes('CORS') || error.response?.status === 0) {
      const corsError = new Error('CORS error: Unable to connect to the server due to cross-origin restrictions.')
      corsError.originalError = error
      corsError.isCorsError = true
      throw corsError
    }

    // Enhanced error with more context
    const enhancedError = new Error(error.response?.data?.message || error.message || 'Failed to create esports registration')
    enhancedError.originalError = error
    enhancedError.responseData = error.response?.data
    enhancedError.status = error.response?.status

    throw enhancedError
  }
}

export async function deleteEsportsRegistration(id) {
  try {
    const response = await api.delete(`/esports/${id}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to delete esports registration')
  }
}

// DANCE SOCIETY REGISTRATIONS
export async function createDanceSocietyRegistration(formData) {
  try {
    const formattedData = {
      name: formData.name,
      email: formData.email,
      whatsappNo: formData.whatsappNo.startsWith('+91')
        ? formData.whatsappNo
        : `+91${formData.whatsappNo}`,
      erp: formData.erp,
      form_of_dance: formData.formOfDance,
      branch: formData.branch
    }

    // Use relative path - api instance already has baseURL configured
    const response = await api.post('/public/dance/registrations', formattedData)

    return response.data
  } catch (error) {
    // Check if it's a network error
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Network error: Could not connect to the server. Please check your internet connection.')
    }

    console.error('Registration error:', error)
    throw new Error(error.response?.data?.error || error.message || 'Failed to submit registration')
  }
}

export default api
