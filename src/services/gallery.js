import api from './api'

export async function getGallery() {
  const res = await api.get('/gallery')
  return res.data
}

export async function createGalleryEvent(event) {
  const res = await api.post('/gallery', event)
  return res.data
}

export async function updateGalleryEvent(id, event) {
  const res = await api.put(`/gallery/${id}`, event)
  return res.data
}

export async function deleteGalleryEvent(id) {
  const res = await api.delete(`/gallery/${id}`)
  return res.data
}
