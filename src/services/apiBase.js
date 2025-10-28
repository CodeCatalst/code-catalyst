import axios from 'axios';

// Set API base URL for all frontend requests
export const API_BASE = import.meta.env.VITE_API_BASE || "https://cc-backend.code-9a1.workers.dev";

// Create an axios instance used by this module
const axiosInstance = axios.create({
    baseURL: API_BASE + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Simple in-memory GET cache to shorten perceived load times for repeat requests
const getCache = new Map();
const DEFAULT_TTL = 30 * 1000; // 30 seconds

async function cachedGet(url, config) {
    try {
        const paramsKey = config && config.params ? JSON.stringify(config.params) : '';
        const key = `${url}|${paramsKey}`;
        const entry = getCache.get(key);
        if (entry && (Date.now() - entry.t) < (config && config.ttl ? config.ttl : DEFAULT_TTL)) {
            return entry.res;
        }

        const res = await axiosInstance.get(url, config);
        getCache.set(key, { res, t: Date.now() });
        return res;
    } catch (err) {
        // Forward error
        throw err;
    }
}

// Expose same interface as before (get/post/put/delete)
const api = {
    get: cachedGet,
    post: (url, data, config) => axiosInstance.post(url, data, config),
    put: (url, data, config) => axiosInstance.put(url, data, config),
    delete: (url, config) => axiosInstance.delete(url, config),
    // utility: allow prefetching an array of urls
    prefetch: (urls = []) => Promise.all(urls.map((u) => cachedGet(u).catch(() => null))),
    // expose raw axios instance if needed
    _raw: axiosInstance,
    // allow clearing cache
    _clearCache: () => getCache.clear(),
};

export default api;