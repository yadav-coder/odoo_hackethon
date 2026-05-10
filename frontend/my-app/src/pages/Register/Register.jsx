import { Link, useNavigate } from 'react-router-dom'
import { useId, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './register.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const firstNameId = useId()
  const lastNameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const cityId = useId()
  const countryId = useId()
  const passwordId = useId()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(
    () =>
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.password.trim().length > 0,
    [form.email, form.firstName, form.lastName, form.password]
  )

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        country: form.country,
      })
      setStatus({ type: 'success', message: 'Account created! Redirecting...' })
      setTimeout(() => navigate('/'), 700)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Registration failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="register">
      <div className="register__frame" aria-hidden="true" />

      <section className="register__card" aria-label="Registration">
        <header className="register__header">
          <p className="register__eyebrow">✈️ Traveloop</p>
          <h1 className="register__title">Create Account</h1>
          <p className="register__sub">Join thousands of travelers planning smarter trips</p>
        </header>

        <form className="register__form" onSubmit={onSubmit}>
          <div className="register__grid">
            <div className="register__field">
              <label className="register__label" htmlFor={firstNameId}>First Name *</label>
              <input id={firstNameId} className="register__input" name="firstName" type="text"
                autoComplete="given-name" placeholder="First Name" value={form.firstName} onChange={onChange} />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={lastNameId}>Last Name *</label>
              <input id={lastNameId} className="register__input" name="lastName" type="text"
                autoComplete="family-name" placeholder="Last Name" value={form.lastName} onChange={onChange} />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={emailId}>Email Address *</label>
              <input id={emailId} className="register__input" name="email" type="email"
                autoComplete="email" placeholder="you@example.com" value={form.email} onChange={onChange} />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={passwordId}>Password *</label>
              <input id={passwordId} className="register__input" name="password" type="password"
                autoComplete="new-password" placeholder="Min. 6 characters" value={form.password} onChange={onChange} />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={phoneId}>Phone Number</label>
              <input id={phoneId} className="register__input" name="phone" type="tel"
                autoComplete="tel" placeholder="+91 9876543210" value={form.phone} onChange={onChange} />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={cityId}>City</label>
              <input id={cityId} className="register__input" name="city" type="text"
                autoComplete="address-level2" placeholder="Your city" value={form.city} onChange={onChange} />
            </div>

            <div className="register__field register__field--full">
              <label className="register__label" htmlFor={countryId}>Country</label>
              <input id={countryId} className="register__input" name="country" type="text"
                autoComplete="country-name" placeholder="Your country" value={form.country} onChange={onChange} />
            </div>
          </div>

          {status.message ? (
            <p className={`register__status register__status--${status.type}`} role="status">
              {status.message}
            </p>
          ) : null}

          <button className="register__button" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="register__hint">
            Already have an account?{' '}
            <Link className="register__link" to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
