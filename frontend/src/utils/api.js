import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Agregar token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Manejo de errores
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

// Auth
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`)
}

// Payments
export const paymentsAPI = {
  create: (amount, currency, method) =>
    api.post('/payments/create', { amount, currency, method }),
  list: () => api.get('/payments'),
  process: (id) => api.post(`/payments/${id}/process`)
}

// Notifications
export const notificationsAPI = {
  send: (email, type, data) =>
    api.post('/notifications/send', { email, type, data }),
  stats: () => api.get('/notifications/stats')
}
