import { api } from '../api/axios'
import { mockTrips } from '../utils/mockTrips'

export async function fetchUserTrips(params = {}) {
  try {
    const res = await api.get('/trips', { params })
    return {
      items: res?.data?.data?.items || [],
      groups: res?.data?.data?.groups || null,
      meta: res?.data?.meta || { page: 1, limit: 12, total: 0, hasMore: false },
    }
  } catch (err) {
    return {
      items: mockTrips,
      groups: null,
      meta: { page: 1, limit: mockTrips.length, total: mockTrips.length, hasMore: false },
      error: err,
    }
  }
}

