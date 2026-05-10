import { apiFetch } from '../api/axios'
import { mockTrips } from '../utils/mockTrips'

export async function fetchUserTrips(params = {}) {
  try {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.set(k, String(v))
      }
    })
    const data = await apiFetch(`/trips?${searchParams.toString()}`)
    const trips = data?.trips || []
    return {
      items: trips,
      groups: null,
      meta: { page: 1, limit: trips.length, total: trips.length, hasMore: false },
    }
  } catch (err) {
    console.warn('Using mock trips (backend unreachable):', err.message)
    return {
      items: mockTrips,
      groups: null,
      meta: { page: 1, limit: mockTrips.length, total: mockTrips.length, hasMore: false },
      error: err,
    }
  }
}

export async function createUserTrip(payload) {
  return apiFetch('/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateUserTrip(tripId, payload) {
  return apiFetch(`/trips/${tripId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteUserTrip(tripId) {
  return apiFetch(`/trips/${tripId}`, { method: 'DELETE' })
}
