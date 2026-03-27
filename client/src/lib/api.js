import axios from 'axios'

const AUTH_STORAGE_KEY = 'expense-tracker-auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return config
  }

  try {
    const parsed = JSON.parse(raw)
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return config
})

export { AUTH_STORAGE_KEY }
export default api
