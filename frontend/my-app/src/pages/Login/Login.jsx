import { useId, useMemo, useState } from 'react'
import { apiFetch } from '../../api/axios'
import './login.css'

export default function Login({ onSwitch, onSuccess }) {
  const usernameId = useId()
  const passwordId = useId()

  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canSubmit = useMemo(() => {
    return form.username.trim().length > 0 && form.password.trim().length > 0
  }, [form.password, form.username])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.username, // using the username field as email
          password: form.password,
        }),
      })

      if (data.success) {
        localStorage.setItem('token', data.token) // Save token for future API calls
        setStatus({ type: 'success', message: 'Login successful.' })
        onSuccess?.()
      } else {
        setStatus({ type: 'error', message: data.message || 'Login failed' })
      }
    } catch (error) {
      console.error('Error during login:', error)
      setStatus({ type: 'error', message: error.message || 'Login failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login">
      <div className="login__frame" aria-hidden="true" />

      <section className="login__card" aria-label="Login">
        <header className="login__header">
          <p className="login__eyebrow">Traveloop</p>
          <h1 className="login__title">Login</h1>
        </header>

        <div className="login__avatar" aria-hidden="true">
          <div className="login__avatarInner">TL</div>
        </div>

        <form className="login__form" onSubmit={onSubmit}>
          <label className="login__label" htmlFor={usernameId}>
            Username
          </label>
          <input
            id={usernameId}
            className="login__input"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter username"
            value={form.username}
            onChange={onChange}
          />

          <label className="login__label" htmlFor={passwordId}>
            Password
          </label>
          <input
            id={passwordId}
            className="login__input"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={form.password}
            onChange={onChange}
          />

          {status.message ? (
            <p className={`login__status login__status--${status.type}`} role="status">
              {status.message}
            </p>
          ) : null}

          <button className="login__button" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {onSwitch ? (
            <p className="login__hint">
              Don't have an account?{' '}
              <button className="login__link" type="button" onClick={onSwitch}>
                Register
              </button>
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}
