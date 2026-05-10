import { Link } from 'react-router-dom'
import './topNav.css'

export default function TopNav({ title = 'Traveloop' }) {
  return (
    <header className="topnav">
      <div className="topnav__inner">
        <div className="topnav__brand" aria-label={title}>
          <div className="topnav__logo" aria-hidden="true">
            TL
          </div>
          <span className="topnav__name">{title}</span>
        </div>

        <nav className="topnav__nav" aria-label="Main navigation">
          <Link className="topnav__link" to="/">
            Dashboard
          </Link>
          <Link className="topnav__link" to="/user-trips">
            My Trips
          </Link>
          <Link className="topnav__link" to="/previous-trips">
            Previous Trips
          </Link>
          <Link className="topnav__link" to="/login">
            Login
          </Link>
          <Link className="topnav__link" to="/register">
            Register
          </Link>
        </nav>

        <button className="topnav__avatar" type="button" aria-label="Profile">
          <span className="topnav__avatarInner" aria-hidden="true">
            U
          </span>
        </button>
      </div>
    </header>
  )
}

