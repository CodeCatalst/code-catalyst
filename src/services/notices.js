import api from './api'

export async function getNotices() {
  const res = await api.get('/notices')
  return res.data
}

export async function createNotice(notice) {
  const res = await api.post('/notices', notice)
  return res.data
}

export async function updateNotice(id, notice) {
  const res = await api.put(`/notices/${id}`, notice)
  return res.data
}

export async function deleteNotice(id) {
  const res = await api.delete(`/notices/${id}`)
  return res.data
}
