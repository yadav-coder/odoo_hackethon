import { apiFetch } from './axios'

export async function fetchPreviousTrips() {
  const res = await apiFetch('/previous-trips')
  return res?.data || []
}

