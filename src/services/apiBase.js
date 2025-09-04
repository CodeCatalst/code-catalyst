import axios from 'axios';

// Set API base URL for all frontend requests
export const API_BASE = import.meta.env.VITE_API_BASE ||  "https://cc-backend.code-9a1.workers.dev";

const api = axios.create({
    baseURL: API_BASE + '/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;