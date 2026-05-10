import { apiFetch } from './axios'

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
  const url = new URL('/destinations', 'http://local')
  url.searchParams.set('country', country)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('groupBy', groupBy)
  url.searchParams.set('sortBy', sortBy)
  url.searchParams.set('sortDir', sortDir)
  if (minRating !== undefined) url.searchParams.set('minRating', String(minRating))
  if (maxBudget !== undefined) url.searchParams.set('maxBudget', String(maxBudget))

  const res = await apiFetch(url.pathname + url.search)
  const items = res?.data?.items || []
  const groups = res?.data?.groups || null
  const meta = res?.meta || { hasMore: false, total: items.length }

  return { items, groups, meta }
}
