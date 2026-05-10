import { formatCurrency } from '../../utils/helpers'
import './destinationCard.css'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60'

export default function DestinationCard({ destination }) {
  const { name, country, rating, description, estimatedBudget, imageUrl } = destination
  const safeSrc = imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(`${name},${country}`)}`

  return (
    <article className="dest">
      <div className="dest__media">
        <img
          className="dest__img"
          src={safeSrc}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return
            e.currentTarget.dataset.fallback = '1'
            e.currentTarget.src = FALLBACK_IMG
          }}
        />
        <div className="dest__overlay" aria-hidden="true" />
        <div className="dest__top">
          <span className="dest__badge">{country}</span>
          <span className="dest__rating" aria-label={`Rating ${rating}`}>
            ★ {rating}
          </span>
        </div>
      </div>

      <div className="dest__body">
        <h3 className="dest__name" title={name}>
          {name}
        </h3>
        <p className="dest__desc">{description}</p>
        <div className="dest__meta">
          <span className="dest__metaLabel">Est. budget</span>
          <span className="dest__metaValue">{formatCurrency(estimatedBudget)}</span>
        </div>
      </div>
    </article>
  )
}
