import { api } from '../api/axios'
import { mockDestinations } from '../utils/mockData'

export async function fetchSuggestions() {
  try {
    const res = await api.get('/suggestions')
    return res?.data?.data || []
  } catch {
    // Use mock destinations as suggestions fallback
    return mockDestinations.slice(0, 6).map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      description: d.description,
      rating: d.rating,
      estimatedBudget: d.estimatedBudget,
      imageUrl: d.imageUrl,
    }))
  }
}

