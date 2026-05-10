import { formatCurrency } from '../../../utils/helpers'
import { getFallbackImage, unsplashSourceUrl } from '../../../utils/images'
import './suggestionCard.css'

export default function SuggestionCard({ suggestion, onPick, placeQuery = '' }) {
  const query = `${suggestion.name} ${suggestion.country || ''} ${placeQuery} travel`
  const safeSrc = suggestion.imageUrl || unsplashSourceUrl(query, suggestion.id || suggestion.name)

  return (
    <article className="sugg" onClick={() => onPick?.(suggestion)} role="button" tabIndex={0}>
      <div className="sugg__media">
        <img
          className="sugg__img"
          src={safeSrc}
          alt={suggestion.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback) return
            e.currentTarget.dataset.fallback = '1'
            e.currentTarget.src = getFallbackImage()
          }}
        />
        <div className="sugg__overlay" aria-hidden="true" />
        <div className="sugg__top">
          <span className="sugg__badge">{suggestion.country}</span>
          <span className="sugg__rating">★ {suggestion.rating}</span>
        </div>
      </div>

      <div className="sugg__body">
        <h3 className="sugg__name" title={suggestion.name}>
          {suggestion.name}
        </h3>
        <p className="sugg__desc">{suggestion.description}</p>
        <div className="sugg__meta">
          <span className="sugg__metaK">Est. budget</span>
          <span className="sugg__metaV">{formatCurrency(suggestion.estimatedBudget)}</span>
        </div>
      </div>
    </article>
  )
}
