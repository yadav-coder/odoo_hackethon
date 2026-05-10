import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import './topNav.css'

export default function TopNav({ title = 'Traveloop' }) {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()

  const initials = user
    ? ((user.firstName || user.name || 'U')[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase()
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topnav">
      <div className="topnav__inner">
        <Link className="topnav__brand" to="/" aria-label={title}>
          <div className="topnav__logo" aria-hidden="true">✈️</div>
          <span className="topnav__name">{title}</span>
        </Link>

        <nav className="topnav__nav" aria-label="Main navigation">
          <Link className="topnav__link" to="/">Dashboard</Link>
          <Link className="topnav__link" to="/user-trips">My Trips</Link>
          <Link className="topnav__link" to="/create-trip">Plan Trip</Link>
          <Link className="topnav__link" to="/previous-trips">History</Link>
        </nav>

        <div className="topnav__right">
          {isLoggedIn ? (
            <div className="topnav__userMenu">
              <Link to="/profile" className="topnav__avatar" aria-label="Profile">
                <span className="topnav__avatarInner" aria-hidden="true">{initials}</span>
              </Link>
              <div className="topnav__dropdown">
                <p className="topnav__dropdownName">{user?.name || `${user?.firstName} ${user?.lastName}`}</p>
                <p className="topnav__dropdownEmail">{user?.email}</p>
                <hr className="topnav__hr" />
                <Link className="topnav__dropdownLink" to="/profile">Profile Settings</Link>
                <button className="topnav__dropdownBtn" type="button" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link className="topnav__cta" to="/login">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  )
}
