import { useEffect, useState } from 'react'
import TopNav from '../../components/layout/TopNav/TopNav'
import SkeletonCard from '../../components/Loader/SkeletonCard'
import TripCard from '../../components/TripCard/TripCard'
import { fetchPreviousTrips } from '../../api/previousTripsApi'
import { formatCurrency, formatDateRange } from '../../utils/helpers'
import './previousTrips.css'

export default function PreviousTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setLoading(true)
    setError('')

    fetchPreviousTrips()
      .then((res) => {
        if (!active) return
        setTrips(res || [])
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Failed to load previous trips')
        setTrips([])
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="prevtrips">
      <TopNav />

      <main className="prevtrips__main">
        <section className="prevtrips__hero">
          <div>
            <p className="prevtrips__kicker">Previous Trips</p>
            <h1 className="prevtrips__title">Review your recent journeys</h1>
            <p className="prevtrips__subtitle">
              All completed trips are shown as cards so you can easily revisit your favorite travel memories.
            </p>
          </div>

          <div className="prevtrips__overview">
            <span className="prevtrips__overviewLabel">Trips in history</span>
            <strong className="prevtrips__overviewValue">{trips.length}</strong>
          </div>
        </section>

        {error ? (
          <div className="prevtrips__error" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        {loading ? (
          <div className="prevtrips__grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="prevtrips__grid">
            {trips.length === 0 ? (
              <div className="prevtrips__empty">No previous trips found.</div>
            ) : (
              trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={{
                    ...trip,
                    dateRangeLabel: formatDateRange(trip.startDate, trip.endDate),
                    budgetSpentLabel: formatCurrency(trip.budgetSpent ?? trip.budget ?? 0),
                  }}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
