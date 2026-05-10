import { apiFetch } from './axios'
import { mockPreviousTrips } from '../utils/mockData'

export async function fetchPreviousTrips() {
  try {
    const data = await apiFetch('/previous-trips')
    return data?.data || []
  } catch {
    return mockPreviousTrips
  }
}
