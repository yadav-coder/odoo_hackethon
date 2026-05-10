import './searchBar.css'

export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="search">
      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        className="search__input"
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search country"
      />
    </div>
  )
}

