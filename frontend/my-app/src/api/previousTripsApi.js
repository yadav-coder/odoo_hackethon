import { api } from './axios'
import { mockPreviousTrips } from '../utils/mockData'

export async function fetchPreviousTrips() {
  try {
    const res = await api.get('/previous-trips')
    return res?.data?.data || []
  } catch {
    return mockPreviousTrips
  }
}
