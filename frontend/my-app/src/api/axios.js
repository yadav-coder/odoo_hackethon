import axios from 'axios'

// Prefer relative /api (Vite proxy) unless explicitly overridden.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'content-type': 'application/json' },
  withCredentials: false,
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      `Request failed (${err?.response?.status || 'network'})`
    return Promise.reject(new Error(message))
  },
)

async function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  const token = localStorage.getItem('token')

  const resp = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const json = await resp.json()

  if (!resp.ok) {
    const message = json?.message || json?.errors?.join(', ') || `Request failed (${resp.status})`
    throw new Error(message)
  }

  return json
}

export { apiFetch, api, BASE_URL }
