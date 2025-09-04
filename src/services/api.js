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
  const res = await fetch(`${API_BASE}/api/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${API_BASE}/api/roles`);
  if (!res.ok) throw new Error('Failed to fetch roles');
  return res.json();
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

export async function updateUserRole(userId, roleId) {
  const res = await fetch(`${API_BASE}/api/users/${userId}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roleId }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return res.json();
}

export default api;