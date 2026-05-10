import { createContext, useContext, useMemo, useState } from 'react'

const UserTripsContext = createContext(null)

export function UserTripsProvider({ children }) {
  const [q, setQ] = useState('')
  const [groupBy, setGroupBy] = useState('none')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [sortDir, setSortDir] = useState('desc')
  const [budgetMax, setBudgetMax] = useState('')
  const [travelersMin, setTravelersMin] = useState('')

  const value = useMemo(
    () => ({
      q,
      setQ,
      groupBy,
      setGroupBy,
      status,
      setStatus,
      sortBy,
      setSortBy,
      sortDir,
      setSortDir,
      budgetMax,
      setBudgetMax,
      travelersMin,
      setTravelersMin,
    }),
    [budgetMax, groupBy, q, sortBy, sortDir, status, travelersMin],
  )

  return <UserTripsContext.Provider value={value}>{children}</UserTripsContext.Provider>
}

export function useUserTripsContext() {
  const ctx = useContext(UserTripsContext)
  if (!ctx) throw new Error('useUserTripsContext must be used within UserTripsProvider')
  return ctx
}

