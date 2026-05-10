import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../../components/layout/TopNav/TopNav'
import TripForm from '../../components/forms/TripForm/TripForm'
import SuggestionCard from '../../components/cards/SuggestionCard/SuggestionCard'
import SkeletonSuggestion from '../../components/Loader/SkeletonSuggestion'
import { fetchSuggestions } from '../../services/suggestionService'
import { createTrip } from '../../services/tripService'
import './createTrip.css'

function validate(values) {
  const errors = {}
  if (!values.destination.trim()) errors.destination = 'Destination is required'
  if (!values.startDate) errors.startDate = 'Start date is required'
  if (!values.startTime) errors.startTime = 'Start time is required'
  if (!values.endDate) errors.endDate = 'End date is required'
  if (!values.endTime) errors.endTime = 'End time is required'

  if (values.startDate && values.endDate) {
    const s = new Date(values.startDate)
    const e = new Date(values.endDate)
    if (e < s) errors.endDate = 'End date must be after start date'
  }

  return errors
}

export default function CreateTrip() {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  })
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ type: 'none', message: '' })

  const errors = useMemo(() => validate(values), [values])
  const canSubmit = Object.keys(errors).length === 0

  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [suggestionsError, setSuggestionsError] = useState('')

  useEffect(() => {
    let alive = true
    setLoadingSuggestions(true)
    setSuggestionsError('')
    fetchSuggestions()
      .then((data) => {
        if (!alive) return
        setSuggestions(data)
      })
      .catch((err) => {
        if (!alive) return
        setSuggestionsError(err?.message || 'Failed to load suggestions')
      })
      .finally(() => {
        if (!alive) return
        setLoadingSuggestions(false)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!toast.message) return
    const t = setTimeout(() => setToast({ type: 'none', message: '' }), 2500)
    return () => clearTimeout(t)
  }, [toast.message])

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const onPickSuggestion = (s) => {
    setValues((prev) => ({ ...prev, destination: s.name }))
    setTouched((prev) => ({ ...prev, destination: true }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched({
      destination: true,
      startDate: true,
      startTime: true,
      endDate: true,
      endTime: true,
    })

    if (!canSubmit) {
      setToast({ type: 'error', message: 'Please fill all required fields' })
      return
    }

    setSubmitting(true)
    try {
      const startDateTime = `${values.startDate}T${values.startTime}`
      const endDateTime = `${values.endDate}T${values.endTime}`
      const res = await createTrip({
        destination: values.destination.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        startDateTime,
        endDateTime,
      })
      const trip = res?.trip
      setToast({ type: 'success', message: res?.message || 'Trip Created Successfully' })
      setValues({ destination: '', startDate: '', endDate: '', startTime: '', endTime: '' })
      setTouched({})
      setTimeout(() => navigate(`/itinerary/${trip?.id || 'new'}`, { state: { trip } }), 700)
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to create trip' })
    } finally {
      setSubmitting(false)
    }
  }

  const showErrors = (field) => touched[field] && errors[field]

  return (
    <div className="createTrip">
      <TopNav />

      <main className="createTrip__main">
        <section className="createTrip__left">
          <TripForm
            values={values}
            errors={{
              destination: showErrors('destination') ? errors.destination : '',
              startDate: showErrors('startDate') ? errors.startDate : '',
              startTime: showErrors('startTime') ? errors.startTime : '',
              endDate: showErrors('endDate') ? errors.endDate : '',
              endTime: showErrors('endTime') ? errors.endTime : '',
            }}
            onChange={onChange}
            onSubmit={onSubmit}
            submitting={submitting}
            placeOptions={suggestions.map((s) => s.name)}
          />
        </section>

        <section className="createTrip__right">
          <div className="createTrip__sectionHeader">
            <h2 className="createTrip__h2">Suggestions for Places to Visit / Activities to perform</h2>
            <p className="createTrip__muted">Tap a card to auto-fill destination</p>
          </div>

          {suggestionsError ? (
            <div className="createTrip__error" role="alert">
              <p className="createTrip__errorText">{suggestionsError}</p>
              <button
                className="createTrip__retry"
                type="button"
                onClick={() => {
                  setLoadingSuggestions(true)
                  setSuggestionsError('')
                  fetchSuggestions()
                    .then(setSuggestions)
                    .catch((err) =>
                      setSuggestionsError(err?.message || 'Failed to load suggestions'),
                    )
                    .finally(() => setLoadingSuggestions(false))
                }}
              >
                Retry
              </button>
            </div>
          ) : null}

          <div className="createTrip__grid">
            {loadingSuggestions
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonSuggestion key={i} />)
              : suggestions.map((s) => (
                  <SuggestionCard
                    key={s.id}
                    suggestion={s}
                    onPick={onPickSuggestion}
                    placeQuery={values.destination}
                  />
                ))}
          </div>
        </section>
      </main>

      {toast.message ? (
        <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
