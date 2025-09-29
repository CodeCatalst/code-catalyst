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
    console.log('API Request Debug:', {
        url: config.url,
        method: config.method,
        tokenPresent: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    });

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('API Request: Added Authorization header');
    } else {
        console.log('API Request: No token found, sending without auth');
    }
    return config;
});

export default api;