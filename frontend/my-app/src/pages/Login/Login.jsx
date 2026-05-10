import { Link, useNavigate } from 'react-router-dom'
import { useId, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const emailId = useId()
  const passwordId = useId()

  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(
    () => form.email.trim().length > 0 && form.password.trim().length > 0,
    [form.email, form.password]
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
      await login(form.email, form.password)
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' })
      setTimeout(() => navigate('/'), 600)
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Login failed. Check your credentials.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login">
      <div className="login__frame" aria-hidden="true" />

      <section className="login__card" aria-label="Login">
        <header className="login__header">
          <p className="login__eyebrow">✈️ Traveloop</p>
          <h1 className="login__title">Welcome Back</h1>
          <p className="login__sub">Sign in to continue planning your adventures</p>
        </header>

        <form className="login__form" onSubmit={onSubmit}>
          <div className="login__field">
            <label className="login__label" htmlFor={emailId}>Email Address</label>
            <input
              id={emailId}
              className="login__input"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="login__field">
            <label className="login__label" htmlFor={passwordId}>Password</label>
            <input
              id={passwordId}
              className="login__input"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
            />
          </div>

          {status.message ? (
            <p className={`login__status login__status--${status.type}`} role="status">
              {status.message}
            </p>
          ) : null}

          <button className="login__button" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login__hint">
            Don&apos;t have an account?{' '}
            <Link className="login__link" to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
