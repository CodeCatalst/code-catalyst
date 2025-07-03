import api from './api'

export async function getStats() {
  // Fetch all in parallel
  const [forms, submissions, users] = await Promise.all([
    api.get('/forms'),
    api.get('/submissions'),
    api.get('/users'),
  ])
  return {
    totalForms: forms.data.length,
    totalSubmissions: submissions.data.length,
    activeUsers: users.data.length,
    // You can add more stats here if needed
  }
}
