import { formatCurrency, formatDateRange } from '../../../utils/helpers'
import { getFallbackImage, unsplashSourceUrl } from '../../../utils/images'
import './userTripCard.css'

export default function UserTripCard({ trip, onView }) {
  const img =
    trip.image || unsplashSourceUrl(`${trip.destination} ${trip.country || ''} travel`, trip.id || trip.title)

  return (
    <article className="utcard">
      <div className="utcard__media">
        <img
          className="utcard__img"
          src={img}
          alt={trip.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return
            e.currentTarget.dataset.fallback = '1'
            e.currentTarget.src = getFallbackImage()
          }}
        />
        <div className="utcard__overlay" aria-hidden="true" />
        <span className={`utcard__status utcard__status--${trip.status}`}>{trip.status}</span>
      </div>

      <div className="utcard__body">
        <h3 className="utcard__title" title={trip.title}>
          {trip.title}
        </h3>
        <p className="utcard__sub">
          {trip.destination}
          {trip.country ? ` · ${trip.country}` : ''}
        </p>

        <div className="utcard__facts">
          <div className="utcard__fact">
            <span className="utcard__k">Dates</span>
            <span className="utcard__v">{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
          <div className="utcard__fact">
            <span className="utcard__k">Budget</span>
            <span className="utcard__v">{formatCurrency(trip.budget, 'INR')}</span>
          </div>
          <div className="utcard__fact">
            <span className="utcard__k">Travelers</span>
            <span className="utcard__v">{trip.travelers}</span>
          </div>
        </div>

        <p className="utcard__summary">{trip.summary}</p>

        <button className="utcard__btn" type="button" onClick={() => onView?.(trip)}>
          View Details
        </button>
      </div>
    </article>
  )
}

