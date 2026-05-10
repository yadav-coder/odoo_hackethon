import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../../components/layout/TopNav/TopNav'
import SearchBar from '../../components/SearchBar/SearchBar'
import SkeletonCard from '../../components/Loader/SkeletonCard'
import UserTripCard from '../../components/cards/UserTripCard/UserTripCard'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { fetchUserTrips } from '../../services/userTripsService'
import { useUserTripsContext } from '../../context/UserTripsContext'
import './userTrips.css'

const sectionOrder = ['ongoing', 'upcoming', 'completed']

function splitByStatus(items) {
  const map = { ongoing: [], upcoming: [], completed: [] }
  for (const t of items) {
    if (map[t.status]) map[t.status].push(t)
  }
  return map
}

export default function UserTrips() {
  const navigate = useNavigate()
  const {
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
  } = useUserTripsContext()

  const debouncedQ = useDebouncedValue(q, 350)

  const [page] = useState(1)
  const [items, setItems] = useState([])
  const [groups, setGroups] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(() => {
    const p = {
      q: debouncedQ || undefined,
      groupBy: groupBy !== 'none' ? groupBy : undefined,
      status: status !== 'all' ? status : undefined,
      sortBy,
      sortDir,
      maxBudget: budgetMax ? Number(budgetMax) : undefined,
      travelersMin: travelersMin ? Number(travelersMin) : undefined,
      page,
      limit: 30,
    }
    return p
  }, [budgetMax, debouncedQ, groupBy, page, sortBy, sortDir, status, travelersMin])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchUserTrips(params)
      setItems(res.items || [])
      setGroups(res.groups || null)
      if (res.error) setError('Backend not reachable — showing mock trips')
    } catch (err) {
      setError(err?.message || 'Failed to load trips')
      setItems([])
      setGroups(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const onView = (trip) => navigate(`/itinerary/${trip.id}`, { state: { trip } })

  const byStatus = useMemo(() => splitByStatus(items), [items])

  return (
    <div className="utrips">
      <TopNav />

      <main className="utrips__main">
        <section className="utrips__hero">
          <div>
            <p className="utrips__kicker">My Trips</p>
            <h1 className="utrips__title">Your travel history in cards</h1>
            <p className="utrips__subtitle">
              Browse your trips by status, budget, and destination in one place.
            </p>
          </div>
          <div className="utrips__heroMeta">
            <span className="utrips__metaLabel">Total trips</span>
            <strong className="utrips__metaValue">{items.length}</strong>
          </div>
        </section>

        <div className="utrips__controls">
          <SearchBar
            value={q}
            onChange={setQ}
            placeholder="Search trips (Japan, Goa, Honeymoon, Business...)"
          />

          <div className="utrips__filters">
            <div className="utrips__control">
              <label className="utrips__label">Group By</label>
              <select
                className="utrips__select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="none">None</option>
                <option value="country">Country</option>
                <option value="month">Month</option>
                <option value="budget">Budget Range</option>
                <option value="type">Trip Type</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="utrips__control">
              <label className="utrips__label">Filter</label>
              <select
                className="utrips__select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="utrips__control">
              <label className="utrips__label">Max Budget</label>
              <select
                className="utrips__select"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              >
                <option value="">Any</option>
                <option value="50000">≤ ₹50,000</option>
                <option value="100000">≤ ₹1,00,000</option>
                <option value="200000">≤ ₹2,00,000</option>
                <option value="300000">≤ ₹3,00,000</option>
              </select>
            </div>

            <div className="utrips__control">
              <label className="utrips__label">Travelers</label>
              <select
                className="utrips__select"
                value={travelersMin}
                onChange={(e) => setTravelersMin(e.target.value)}
              >
                <option value="">Any</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="utrips__control">
              <label className="utrips__label">Sort By</label>
              <div className="utrips__sortRow">
                <select
                  className="utrips__select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="budget">Budget</option>
                  <option value="alpha">A–Z</option>
                </select>
                <select
                  className="utrips__select"
                  value={sortDir}
                  onChange={(e) => setSortDir(e.target.value)}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="utrips__error" role="alert">
            <p className="utrips__errorText">{error}</p>
            <button className="utrips__retry" type="button" onClick={load} disabled={loading}>
              Retry
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="utrips__grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : null}

        {!loading && groups ? (
          <div className="utrips__groups">
            {groups.map((g) => (
              <section className="utrips__group" key={g.key}>
                <h2 className="utrips__h2">{g.key}</h2>
                <div className="utrips__grid">
                  {g.items.map((t) => (
                    <UserTripCard key={t.id} trip={t} onView={onView} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}

        {!loading && !groups ? (
          <div className="utrips__sections">
            {sectionOrder.map((s) => (
              <section className="utrips__section" key={s}>
                <div className="utrips__sectionHead">
                  <h2 className="utrips__h2">{s.charAt(0).toUpperCase() + s.slice(1)} Trips</h2>
                  <p className="utrips__muted">{byStatus[s].length} trips</p>
                </div>

                {byStatus[s].length === 0 ? (
                  <div className="utrips__empty">No trips found.</div>
                ) : (
                  <div className="utrips__grid">
                    {byStatus[s].map((t) => (
                      <UserTripCard key={t.id} trip={t} onView={onView} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}

