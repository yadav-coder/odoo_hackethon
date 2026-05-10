import { useId, useMemo, useState } from 'react'
import './login.css'

export default function Login({ onSwitch }) {
  const usernameId = useId()
  const passwordId = useId()

  const [form, setForm] = useState({ username: '', password: '' })
  const canSubmit = useMemo(() => {
    return form.username.trim().length > 0 && form.password.trim().length > 0
  }, [form.password, form.username])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    // Demo-only: wire this to your auth API later.
    // eslint-disable-next-line no-console
    console.log('Login submit:', { username: form.username })
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

          <button className="login__button" type="submit" disabled={!canSubmit}>
            Login
          </button>

          {onSwitch ? (
            <p className="login__hint">
              Don’t have an account?{' '}
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
