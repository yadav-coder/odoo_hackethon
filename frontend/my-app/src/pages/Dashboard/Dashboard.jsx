import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDestinations } from '../../api/destinationApi'
import { fetchPreviousTrips } from '../../api/previousTripsApi'
import SearchBar from '../../components/SearchBar/SearchBar'
import DestinationCard from '../../components/DestinationCard/DestinationCard'
import TripCard from '../../components/TripCard/TripCard'
import SkeletonCard from '../../components/Loader/SkeletonCard'
import { formatCurrency, formatDateRange } from '../../utils/helpers'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useDashboardContext } from '../../context/DashboardContext'
import './dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
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
  } = useDashboardContext()

  const debouncedCountry = useDebouncedValue(countryQuery, 450)

  const [page, setPage] = useState(1)
  const [destinations, setDestinations] = useState([])
  const [destinationGroups, setDestinationGroups] = useState(null)
  const [destinationsMeta, setDestinationsMeta] = useState({
    hasMore: false,
    total: 0,
  })
  const [destinationsLoading, setDestinationsLoading] = useState(false)
  const [destinationsError, setDestinationsError] = useState('')

  const [previousTrips, setPreviousTrips] = useState([])
  const [previousTripsLoading, setPreviousTripsLoading] = useState(false)
  const [previousTripsError, setPreviousTripsError] = useState('')

  const filters = useMemo(() => {
    return {
      country: debouncedCountry,
      page,
      limit: 8,
      groupBy,
      sortBy,
      sortDir,
      minRating: minRating ? Number(minRating) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
    }
  }, [debouncedCountry, groupBy, maxBudget, minRating, page, sortBy, sortDir])

  useEffect(() => {
    let alive = true

    Promise.resolve()
      .then(() => {
        if (!alive) return []
        setPreviousTripsLoading(true)
        setPreviousTripsError('')
        return fetchPreviousTrips()
      })
      .then((res) => {
        if (!alive) return
        setPreviousTrips(res)
      })
      .catch((err) => {
        if (!alive) return
        setPreviousTripsError(err?.message || 'Failed to load previous trips')
      })
      .finally(() => {
        if (!alive) return
        setPreviousTripsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true

    Promise.resolve()
      .then(() => {
        if (!alive) return null
        setDestinationsLoading(true)
        setDestinationsError('')
        return fetchDestinations(filters)
      })
      .then((res) => {
        if (!alive || !res) return
        setDestinationsMeta(res.meta)
        setDestinationGroups(res.groups || null)
        setDestinations((prev) => (filters.page === 1 ? res.items : [...prev, ...res.items]))
      })
      .catch((err) => {
        if (!alive) return
        setDestinationsError(err?.message || 'Failed to load destinations')
        setDestinations([])
        setDestinationGroups(null)
        setDestinationsMeta({ hasMore: false, total: 0 })
      })
      .finally(() => {
        if (!alive) return
        setDestinationsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [filters])

  useEffect(() => {
<<<<<<< Updated upstream
    const id = requestAnimationFrame(() => setPage(1))
    return () => cancelAnimationFrame(id)
  }, [debouncedCountry, groupBy, sortBy, sortDir, minRating, maxBudget])
=======
    setPage(1)
  }, [resetPagingKey])
>>>>>>> Stashed changes

  const onPlanNewTrip = () => navigate('/create-trip')

  return (
    <div className="dash">
      <header className="dash__hero">
        <div className="dash__heroOverlay" aria-hidden="true" />
        <div className="dash__heroInner">
          <div className="dash__heroText">
            <p className="dash__kicker">Dashboard</p>
            <h1 className="dash__title">Welcome back to Traveloop</h1>
            <p className="dash__subtitle">
              Discover places, plan smarter, and keep your trip history organized.
            </p>
          </div>
          <button className="dash__cta" type="button" onClick={onPlanNewTrip}>
            Plan New Trip
          </button>
        </div>
      </header>

      <section className="dash__topbar">
        <SearchBar
          value={countryQuery}
          placeholder="Search country (e.g., India, Japan, France)"
          onChange={setCountryQuery}
        />

        <div className="dash__controls" aria-label="Filters and sorting">
          <div className="dash__control">
            <label className="dash__label" htmlFor="groupBy">
              Group By
            </label>
            <select
              id="groupBy"
              className="dash__select"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="none">None</option>
              <option value="country">Country</option>
            </select>
          </div>

          <div className="dash__control">
            <label className="dash__label" htmlFor="minRating">
              Min Rating
            </label>
            <select
              id="minRating"
              className="dash__select"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="">Any</option>
              <option value="3.8">3.8+</option>
              <option value="4.0">4.0+</option>
              <option value="4.2">4.2+</option>
              <option value="4.5">4.5+</option>
            </select>
          </div>

          <div className="dash__control">
            <label className="dash__label" htmlFor="maxBudget">
              Max Budget
            </label>
            <select
              id="maxBudget"
              className="dash__select"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            >
              <option value="">Any</option>
              <option value="500">Up to {formatCurrency(500)}</option>
              <option value="1000">Up to {formatCurrency(1000)}</option>
              <option value="2000">Up to {formatCurrency(2000)}</option>
              <option value="3000">Up to {formatCurrency(3000)}</option>
            </select>
          </div>

          <div className="dash__control">
            <label className="dash__label" htmlFor="sortBy">
              Sort
            </label>
            <div className="dash__sortRow">
              <select
                id="sortBy"
                className="dash__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Rating</option>
                <option value="budget">Price</option>
                <option value="name">A-Z</option>
              </select>
              <select
                aria-label="Sort direction"
                className="dash__select dash__select--dir"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="dash__section" id="top-regional">
        <div className="dash__sectionHeader">
          <h2 className="dash__h2">Top Regional Selections</h2>
          <p className="dash__muted">
            Showing famous destinations for <span className="dash__pill">{debouncedCountry}</span>
          </p>
        </div>

        {destinationsError ? (
          <div className="dash__error" role="alert">
            <p className="dash__errorText">{destinationsError}</p>
            <button
              className="dash__retry"
              type="button"
              onClick={() => setPage(1)}
              disabled={destinationsLoading}
            >
              Retry
            </button>
          </div>
        ) : null}

        {destinationsLoading && destinations.length === 0 ? (
          <div className="dash__grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : null}

        {!destinationsLoading && destinationGroups ? (
          <div className="dash__groups">
            {destinationGroups.map((g) => (
              <div className="dash__group" key={g.key}>
                <h3 className="dash__groupTitle">{g.key}</h3>
                <div className="dash__grid">
                  {g.items.map((d) => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!destinationsLoading && !destinationGroups ? (
          <div className="dash__grid">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        ) : null}

        <div className="dash__more">
          {destinationsMeta.hasMore ? (
            <button
              className="dash__loadMore"
              type="button"
              disabled={destinationsLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              {destinationsLoading ? 'Loading...' : 'Load more'}
            </button>
          ) : (
            <p className="dash__mutedSmall">
              {destinationsMeta.total ? `Showing ${destinations.length} of ${destinationsMeta.total}` : ''}
            </p>
          )}
        </div>
      </section>

      <section className="dash__section">
        <div className="dash__sectionHeader">
          <h2 className="dash__h2">Previous Trips</h2>
          <p className="dash__muted">Your recent journeys at a glance</p>
        </div>

        {previousTripsError ? (
          <div className="dash__error" role="alert">
            <p className="dash__errorText">{previousTripsError}</p>
            <button
              className="dash__retry"
              type="button"
              onClick={() => {
                setPreviousTrips([])
                setPreviousTripsError('')
                setPreviousTripsLoading(true)
                fetchPreviousTrips()
                  .then(setPreviousTrips)
                  .catch((err) => setPreviousTripsError(err?.message || 'Failed to load previous trips'))
                  .finally(() => setPreviousTripsLoading(false))
              }}
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="dash__grid dash__grid--trips">
          {previousTripsLoading
            ? Array.from({ length: 5 }).map((_, idx) => <SkeletonCard key={idx} />)
            : previousTrips.map((t) => (
                <TripCard
                  key={t.id}
                  trip={{
                    ...t,
                    budgetSpentLabel: formatCurrency(t.budgetSpent),
                    dateRangeLabel: formatDateRange(t.startDate, t.endDate),
                  }}
                />
              ))}
        </div>
      </section>
    </div>
  )
}
