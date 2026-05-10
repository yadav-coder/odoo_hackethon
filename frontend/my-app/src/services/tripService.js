import { apiFetch } from '../api/axios'

export async function createTrip(payload) {
  return apiFetch('/trips', {
    method: 'POST',
    body: JSON.stringify({
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      title: payload.destination,
    }),
  })
}
