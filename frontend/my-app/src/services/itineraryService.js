import { apiFetch } from '../api/axios'

export async function generateItinerary({ destination, startDate, endDate }) {
  const data = await apiFetch('/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify({ destination, startDate, endDate }),
  })
  return data?.sections || []
}

export async function saveItinerary({ tripId, sections }) {
  return apiFetch('/itinerary/save', {
    method: 'POST',
    body: JSON.stringify({ tripId, sections }),
  })
}

export async function getItinerary(tripId) {
  try {
    const data = await apiFetch(`/itinerary/${tripId}`)
    return data?.sections || []
  } catch {
    return []
  }
}
