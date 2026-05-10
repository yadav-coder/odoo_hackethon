const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

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

  const text = await resp.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!resp.ok) {
    const message = json?.message || json?.errors?.join(', ') || `Request failed (${resp.status})`
    throw new Error(message)
  }

  return json
}

export { apiFetch, BASE_URL }
