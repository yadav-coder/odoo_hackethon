import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../../components/layout/TopNav/TopNav'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../api/axios'
import './profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        country: user.country || '',
      })
    }
  }, [user])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus({ type: '', message: '' })
    try {
      await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      setStatus({ type: 'success', message: 'Profile updated successfully!' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user
    ? ((user.firstName || user.name || 'U')[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase()
    : 'U'

  return (
    <div className="profile">
      <TopNav />

      <main className="profile__main">
        <div className="profile__hero">
          <div className="profile__avatar">{initials}</div>
          <div>
            <h1 className="profile__name">{user?.name || `${user?.firstName} ${user?.lastName}`}</h1>
            <p className="profile__email">{user?.email}</p>
            <p className="profile__badge">{user?.role || 'traveler'}</p>
          </div>
        </div>

        <section className="profile__section">
          <h2 className="profile__h2">Edit Profile</h2>

          <form className="profile__form" onSubmit={onSubmit}>
            <div className="profile__grid">
              <div className="profile__field">
                <label className="profile__label">First Name</label>
                <input className="profile__input" name="firstName" type="text"
                  value={form.firstName} onChange={onChange} placeholder="First name" />
              </div>
              <div className="profile__field">
                <label className="profile__label">Last Name</label>
                <input className="profile__input" name="lastName" type="text"
                  value={form.lastName} onChange={onChange} placeholder="Last name" />
              </div>
              <div className="profile__field">
                <label className="profile__label">Email</label>
                <input className="profile__input" name="email" type="email"
                  value={form.email} onChange={onChange} placeholder="Email" />
              </div>
              <div className="profile__field">
                <label className="profile__label">Phone</label>
                <input className="profile__input" name="phone" type="tel"
                  value={form.phone} onChange={onChange} placeholder="Phone number" />
              </div>
              <div className="profile__field">
                <label className="profile__label">City</label>
                <input className="profile__input" name="city" type="text"
                  value={form.city} onChange={onChange} placeholder="Your city" />
              </div>
              <div className="profile__field">
                <label className="profile__label">Country</label>
                <input className="profile__input" name="country" type="text"
                  value={form.country} onChange={onChange} placeholder="Your country" />
              </div>
            </div>

            {status.message && (
              <p className={`profile__status profile__status--${status.type}`}>{status.message}</p>
            )}

            <div className="profile__actions">
              <button className="profile__save" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="profile__logout" type="button" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}
