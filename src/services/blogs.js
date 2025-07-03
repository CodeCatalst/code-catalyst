import api from './api'

export async function getBlogs() {
  const res = await api.get('/blogs')
  return res.data
}

export async function createBlog(blog) {
  const res = await api.post('/blogs', blog)
  return res.data
}

export async function updateBlog(id, blog) {
  const res = await api.put(`/blogs/${id}` , blog)
  return res.data
}

export async function deleteBlog(id) {
  const res = await api.delete(`/blogs/${id}`)
  return res.data
}
