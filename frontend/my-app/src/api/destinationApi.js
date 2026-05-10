import { api } from './axios'
import { mockDestinations } from '../utils/mockData'

export async function fetchDestinations({
  country,
  page = 1,
  limit = 8,
  groupBy = 'none',
  sortBy = 'rating',
  sortDir = 'desc',
  minRating,
  maxBudget,
}) {
  const url = new URL('/destinations/search', 'http://local')
  url.searchParams.set('q', country)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('groupBy', groupBy)
  url.searchParams.set('sortBy', sortBy)
  url.searchParams.set('sortDir', sortDir)
  if (minRating !== undefined) url.searchParams.set('minRating', String(minRating))
  if (maxBudget !== undefined) url.searchParams.set('maxBudget', String(maxBudget))

  try {
    const res = await api.get(url.pathname + url.search)
    const payload = res?.data
    const items = payload?.data?.items || []
    const groups = payload?.data?.groups || null
    const meta = payload?.meta || { hasMore: false, total: items.length }
    return { items, groups, meta }
  } catch (err) {
    const q = String(country || '').toLowerCase()
    const filtered = q
      ? mockDestinations.filter((d) => d.country.toLowerCase().includes(q) || d.name.toLowerCase().includes(q))
      : mockDestinations
    return {
      items: filtered.slice(0, limit),
      groups: null,
      meta: { country, page: 1, limit, total: filtered.length, hasMore: filtered.length > limit },
      isMock: true,
      error: err,
    }
  }
}
