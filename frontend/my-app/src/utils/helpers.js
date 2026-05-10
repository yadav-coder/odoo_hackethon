export function formatCurrency(amount, currency = 'USD') {
  const n = Number(amount)
  if (!Number.isFinite(n)) return ''
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
  } catch {
    return `$${n.toFixed(0)}`
  }
}

export function formatDateRange(startIso, endIso) {
  if (!startIso || !endIso) return ''
  try {
    const s = new Date(startIso)
    const e = new Date(endIso)
    const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
    return `${fmt.format(s)} – ${fmt.format(e)}`
  } catch {
    return `${startIso} – ${endIso}`
  }
}
