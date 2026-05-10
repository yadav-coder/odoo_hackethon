import { formatCurrency, formatDateRange } from '../../../utils/helpers'
import { getFallbackImage, unsplashSourceUrl } from '../../../utils/images'
import './itineraryCard.css'

export default function ItineraryCard({ section }) {
  const img = section.image || unsplashSourceUrl(`${section.title} ${section.destination || ''} travel`, section.id)

  return (
    <article className="itcard">
      <div className="itcard__media">
        <img
          className="itcard__img"
          src={img}
          alt={section.title}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return
            e.currentTarget.dataset.fallback = '1'
            e.currentTarget.src = getFallbackImage()
          }}
        />
        <div className="itcard__overlay" aria-hidden="true" />
        <div className="itcard__metaTop">
          <span className="itcard__pill">{formatDateRange(section.startDate, section.endDate)}</span>
          <span className="itcard__pill itcard__pill--budget">
            {formatCurrency(section.budget, 'INR')}
          </span>
        </div>
      </div>

      <div className="itcard__body">
        <h3 className="itcard__title">{section.title}</h3>
        <p className="itcard__desc">{section.description}</p>
      </div>
    </article>
  )
}
