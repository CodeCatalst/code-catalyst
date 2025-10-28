import api from './apiBase'

// Helper to extract an array of items from various possible backend response shapes
const extractArray = (res) => {
  const d = res && res.data !== undefined ? res.data : res

  if (Array.isArray(d)) return d
  if (!d || typeof d !== 'object') return []

  // Common wrappers
  if (Array.isArray(d.data)) return d.data
  if (Array.isArray(d.events)) return d.events
  if (Array.isArray(d.gallery)) return d.gallery

  // Sometimes API returns an object with numeric keys or id-keyed map
  const values = Object.values(d).filter(v => Array.isArray(v) || (v && typeof v === 'object'))
  for (const val of values) {
    if (Array.isArray(val)) return val
  }

  return []
}

export async function getGallery() {
  const res = await api.get('/gallery')
  return extractArray(res)
}

export async function createGalleryEvent(event) {
  const res = await api.post('/gallery', event)
  // Return created item if backend returns it, otherwise return res.data
  return res && res.data && (res.data.data || res.data) ? (res.data.data || res.data) : res
}

export async function updateGalleryEvent(id, event) {
  const res = await api.put(`/gallery/${id}`, event)
  return res && res.data && (res.data.data || res.data) ? (res.data.data || res.data) : res
}

export async function deleteGalleryEvent(id) {
  const res = await api.delete(`/gallery/${id}`)
  return res && res.data && (res.data.data || res.data) ? (res.data.data || res.data) : res
}
