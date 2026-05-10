import { formatCurrency } from '../../utils/helpers'
import './destinationCard.css'

export default function DestinationCard({ destination }) {
  const { name, country, rating, description, estimatedBudget, imageUrl } = destination

  return (
    <article className="dest">
      <div className="dest__media">
        <img className="dest__img" src={imageUrl} alt={name} loading="lazy" />
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

