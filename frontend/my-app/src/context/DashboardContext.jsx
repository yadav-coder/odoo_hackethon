import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [countryQuery, setCountryQuery] = useState('India')
  const [groupBy, setGroupBy] = useState('none')
  const [sortBy, setSortBy] = useState('rating')
  const [sortDir, setSortDir] = useState('desc')
  const [minRating, setMinRating] = useState('')
  const [maxBudget, setMaxBudget] = useState('')

  const resetPagingKey = useMemo(() => {
    return `${countryQuery}|${groupBy}|${sortBy}|${sortDir}|${minRating}|${maxBudget}`
  }, [countryQuery, groupBy, maxBudget, minRating, sortBy, sortDir])

  const value = useMemo(
    () => ({
      countryQuery,
      setCountryQuery,
      groupBy,
      setGroupBy,
      sortBy,
      setSortBy,
      sortDir,
      setSortDir,
      minRating,
      setMinRating,
      maxBudget,
      setMaxBudget,
      resetPagingKey,
    }),
    [countryQuery, groupBy, maxBudget, minRating, resetPagingKey, sortBy, sortDir],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboardContext must be used within DashboardProvider')
  return ctx
}

