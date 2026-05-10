const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60'

function stableHash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export function unsplashSourceUrl(query, seedKey = '') {
  const q = String(query || 'travel').trim()
  const seed = stableHash(`${q}|${seedKey}`) % 1000
  return `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)}&sig=${seed}`
}

export function getFallbackImage() {
  return FALLBACK_IMG
}

