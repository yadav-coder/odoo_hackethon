import './tripForm.css'

export default function TripForm({
  values,
  errors,
  onChange,
  onSubmit,
  submitting = false,
  placeOptions = [],
}) {
  const timeOptions = Array.from({ length: 48 }).map((_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, '0')
    const m = i % 2 === 0 ? '00' : '30'
    return `${h}:${m}`
  })

  return (
    <form className="tripform" onSubmit={onSubmit}>
      <h2 className="tripform__title">Plan a new trip</h2>

      <div className="tripform__grid">
        <div className="tripform__field">
          <label className="tripform__label" htmlFor="startDate">
            Start Date
          </label>
          <input
            id="startDate"
            className="tripform__input"
            type="date"
            name="startDate"
            value={values.startDate}
            onChange={onChange}
            required
          />
          {errors.startDate ? <p className="tripform__error">{errors.startDate}</p> : null}
        </div>

        <div className="tripform__field">
          <label className="tripform__label" htmlFor="destination">
            Select a Place
          </label>
          <div className="tripform__combo">
            <input
              id="destination"
              className="tripform__input"
              type="text"
              name="destination"
              placeholder="e.g., Goa Beaches"
              value={values.destination}
              onChange={onChange}
              list="trip_places"
              required
            />
            <datalist id="trip_places">
              {placeOptions.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          {errors.destination ? (
            <p className="tripform__error">{errors.destination}</p>
          ) : null}
        </div>

        <div className="tripform__field">
          <label className="tripform__label" htmlFor="startTime">
            Start Time
          </label>
          <select
            id="startTime"
            className="tripform__input tripform__select"
            name="startTime"
            value={values.startTime}
            onChange={onChange}
            required
          >
            <option value="" disabled>
              Select time
            </option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.startTime ? <p className="tripform__error">{errors.startTime}</p> : null}
        </div>

        <div className="tripform__field">
          <label className="tripform__label" htmlFor="endDate">
            End Date
          </label>
          <input
            id="endDate"
            className="tripform__input"
            type="date"
            name="endDate"
            value={values.endDate}
            onChange={onChange}
            required
          />
          {errors.endDate ? <p className="tripform__error">{errors.endDate}</p> : null}
        </div>

        <div className="tripform__field">
          <label className="tripform__label" htmlFor="endTime">
            End Time
          </label>
          <select
            id="endTime"
            className="tripform__input tripform__select"
            name="endTime"
            value={values.endTime}
            onChange={onChange}
            required
          >
            <option value="" disabled>
              Select time
            </option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.endTime ? <p className="tripform__error">{errors.endTime}</p> : null}
        </div>
      </div>

      <button className="tripform__cta" type="submit" disabled={submitting}>
        {submitting ? 'Creating…' : 'Create Trip'}
      </button>
    </form>
  )
}
