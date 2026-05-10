import './tripCard.css'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60'

export default function TripCard({ trip }) {
  return (
    <article className="trip">
      <div className="trip__media">
        <img
          className="trip__img"
          src={trip.imageUrl || FALLBACK_IMG}
          alt={trip.destination}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return
            e.currentTarget.dataset.fallback = '1'
            e.currentTarget.src = FALLBACK_IMG
          }}
        />
        <div className="trip__overlay" aria-hidden="true" />
        <span className={`trip__status trip__status--${trip.status || 'completed'}`}>
          {String(trip.status || 'completed')}
        </span>
      </div>

      <div className="trip__body">
        <div className="trip__titleRow">
          <h3 className="trip__title">
            {trip.destination}
            {trip.country ? <span className="trip__country"> · {trip.country}</span> : null}
          </h3>
        </div>
        <div className="trip__details">
          <div className="trip__detail">
            <span className="trip__k">Dates</span>
            <span className="trip__v">{trip.dateRangeLabel}</span>
          </div>
          <div className="trip__detail">
            <span className="trip__k">Budget</span>
            <span className="trip__v">{trip.budgetSpentLabel}</span>
          </div>
          <div className="trip__detail">
            <span className="trip__k">Travelers</span>
            <span className="trip__v">{trip.travelers}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
