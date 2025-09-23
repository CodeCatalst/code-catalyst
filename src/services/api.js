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
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export async function getUsers() {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function getUser(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

export async function createUser(user) {
  try {
    const response = await api.post('/users', user);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create user');
  }
}

export async function updateUser(id, user) {
  try {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
}

export async function getRoles() {
  try {
    const response = await api.get('/roles');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch roles');
  }
}

export async function createRole(role) {
  const res = await fetch(`${API_BASE}/api/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(role),
  });
  if (!res.ok) throw new Error('Failed to create role');
  return res.json();
}

export async function deleteRole(id) {
  const res = await fetch(`${API_BASE}/api/roles/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete role');
  return res.json();
}

// FORMS
export async function getForms() {
  const res = await fetch(`${API_BASE}/api/forms`);
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function getForm(id) {
  const res = await fetch(`${API_BASE}/api/forms/${id}`);
  if (!res.ok) throw new Error('Failed to fetch form');
  return res.json();
}

export async function createForm(form) {
  const res = await fetch(`${API_BASE}/api/forms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
}

export async function updateForm(id, form) {
  const res = await fetch(`${API_BASE}/api/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to update form');
  return res.json();
}

export async function deleteForm(id) {
  const res = await fetch(`${API_BASE}/api/forms/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete form');
  return res.json();
}

// SUBMISSIONS
export async function getSubmissions() {
  const res = await fetch(`${API_BASE}/api/submissions`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}

export async function getSubmission(id) {
  const res = await fetch(`${API_BASE}/api/submissions/${id}`);
  if (!res.ok) throw new Error('Failed to fetch submission');
  return res.json();
}

export async function createSubmission(submission) {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  });
  if (!res.ok) throw new Error('Failed to create submission');
  return res.json();
}

export async function updateRole(id, role) {
  const res = await fetch(`${API_BASE}/api/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(role),
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json();
}

export async function expireUserPassword(id) {
  const res = await api.post(`/users/${id}/expire-password`);
  return res.data;
}

// ESPORTS REGISTRATIONS
export async function getEsportsRegistrations() {
  const res = await fetch(`${API_BASE}/api/esports`);
  if (!res.ok) throw new Error('Failed to fetch esports registrations');
  return res.json();
}

export async function getEsportsRegistration(id) {
  const res = await fetch(`${API_BASE}/api/esports/${id}`);
  if (!res.ok) throw new Error('Failed to fetch esports registration');
  return res.json();
}

export async function createEsportsRegistration(registration) {
  const res = await fetch(`${API_BASE}/api/esports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
  if (!res.ok) throw new Error('Failed to create esports registration');
  return res.json();
}

export async function deleteEsportsRegistration(id) {
  const res = await fetch(`${API_BASE}/api/esports/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete esports registration');
  return res.json();
}

export async function updateUserRole(userId, role) {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user role');
  }
}

export default api;