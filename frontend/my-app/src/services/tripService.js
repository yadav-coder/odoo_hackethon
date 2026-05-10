import { api } from '../api/axios'

export async function createTrip(payload) {
  const res = await api.post('/trips/create', payload)
  return res?.data
}

