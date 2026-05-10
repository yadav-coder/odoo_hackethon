import { api } from '../api/axios'

export async function generateItinerary({ destination, startDate, endDate, sectionsCount }) {
  const res = await api.post('/itinerary/generate', { destination, startDate, endDate, sectionsCount })
  return res?.data?.sections || []
}

export async function saveItinerary({ tripId, sections }) {
  const res = await api.post('/itinerary/save', { tripId, sections })
  return res?.data
}

export async function getItinerary(tripId) {
  const res = await api.get(`/itinerary/${tripId}`)
  return res?.data?.sections || []
}

