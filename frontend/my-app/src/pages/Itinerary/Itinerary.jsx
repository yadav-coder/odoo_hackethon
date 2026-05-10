import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import TopNav from '../../components/layout/TopNav/TopNav'
import ItineraryCard from '../../components/itinerary/ItineraryCard/ItineraryCard'
import SectionModal from '../../components/modals/SectionModal/SectionModal'
import SkeletonCard from '../../components/Loader/SkeletonCard'
import { generateItinerary, getItinerary, saveItinerary } from '../../services/itineraryService'
import './itinerary.css'

export default function Itinerary() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const trip = location.state?.trip || null

  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ type: 'none', message: '' })
  const [openModal, setOpenModal] = useState(false)

  const canGenerate = Boolean(trip?.destination && trip?.startDate && trip?.endDate)

  const headerSubtitle = useMemo(() => {
    if (!trip) return 'Trip Itinerary'
    return `${trip.destination} · ${trip.startDate} → ${trip.endDate}`
  }, [trip])

  useEffect(() => {
    if (!toast.message) return
    const t = setTimeout(() => setToast({ type: 'none', message: '' }), 2500)
    return () => clearTimeout(t)
  }, [toast.message])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const existing = await getItinerary(tripId)
        setSections(existing.map((s) => ({ ...s, destination: trip?.destination || s.destination })))
    } catch (err) {
      // If none saved yet, generate if we have trip context.
      if (!canGenerate) {
        setError(err?.message || 'Itinerary not found. Create a trip first.')
        setSections([])
        setLoading(false)
        return
      }

      try {
        const generated = await generateItinerary({
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
        })
        setSections(generated.map((s) => ({ ...s, destination: trip.destination })))
      } catch (e2) {
        setError(e2?.message || 'Failed to generate itinerary')
        setSections([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

  const onAddSection = (section) => {
    setSections((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        ...section,
        destination: trip?.destination || section.destination,
        image:
          section.image ||
          `https://source.unsplash.com/1600x900/?${encodeURIComponent(`${section.title} ${trip?.destination || ''}`)}`,
      },
    ])
  }

  const onSave = async () => {
    if (!sections.length) return
    setSaving(true)
    try {
      await saveItinerary({ tripId, sections })
      setToast({ type: 'success', message: 'Itinerary Saved Successfully' })
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to save itinerary' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="itin">
      <TopNav />

      <main className="itin__main">
        <div className="itin__head">
          <div>
            <h1 className="itin__title">Trip Itinerary</h1>
            <p className="itin__sub">{headerSubtitle}</p>
          </div>

          <div className="itin__actions">
            <button className="itin__btn itin__btn--ghost" type="button" onClick={() => setOpenModal(true)}>
              + Add another Section
            </button>
            <button className="itin__btn" type="button" onClick={onSave} disabled={saving || loading || !sections.length}>
              {saving ? 'Saving…' : 'Save Itinerary'}
            </button>
          </div>
        </div>

        {error ? (
          <div className="itin__error" role="alert">
            <p className="itin__errorText">{error}</p>
            <div className="itin__errorActions">
              <button className="itin__btn itin__btn--ghost" type="button" onClick={() => navigate('/create-trip')}>
                Plan New Trip
              </button>
              <button className="itin__btn" type="button" onClick={load}>
                Retry
              </button>
            </div>
          </div>
        ) : null}

        <div className="itin__list">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : sections.map((s) => <ItineraryCard key={s.id} section={s} />)}
        </div>
      </main>

      <SectionModal open={openModal} onClose={() => setOpenModal(false)} onSave={onAddSection} />

      {toast.message ? (
        <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
