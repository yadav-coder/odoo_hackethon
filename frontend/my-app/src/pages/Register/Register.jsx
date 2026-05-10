import { useId, useMemo, useState } from 'react'
import './register.css'

export default function Register({ onSwitch }) {
  const firstNameId = useId()
  const lastNameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const cityId = useId()
  const countryId = useId()
  const infoId = useId()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    info: '',
  })

  const canSubmit = useMemo(() => {
    return (
      form.firstName.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.email.trim().length > 0
    )
  }, [form.email, form.firstName, form.lastName])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function onSubmit(e) {
    e.preventDefault()
    // Demo-only: wire this to your register API later.
    // eslint-disable-next-line no-console
    console.log('Register submit:', form)
  }

  return (
    <main className="register">
      <div className="register__frame" aria-hidden="true" />

      <section className="register__card" aria-label="Registration">
        <header className="register__header">
          <p className="register__eyebrow">Traveloop</p>
          <h1 className="register__title">Registration</h1>
        </header>

        <div className="register__avatar" aria-hidden="true">
          <div className="register__avatarInner">Photo</div>
        </div>

        <form className="register__form" onSubmit={onSubmit}>
          <div className="register__grid">
            <div className="register__field">
              <label className="register__label" htmlFor={firstNameId}>
                First Name
              </label>
              <input
                id={firstNameId}
                className="register__input"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First Name"
                value={form.firstName}
                onChange={onChange}
              />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={lastNameId}>
                Last Name
              </label>
              <input
                id={lastNameId}
                className="register__input"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last Name"
                value={form.lastName}
                onChange={onChange}
              />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={emailId}>
                Email Address
              </label>
              <input
                id={emailId}
                className="register__input"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email Address"
                value={form.email}
                onChange={onChange}
              />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={phoneId}>
                Phone Number
              </label>
              <input
                id={phoneId}
                className="register__input"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={onChange}
              />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={cityId}>
                City
              </label>
              <input
                id={cityId}
                className="register__input"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="City"
                value={form.city}
                onChange={onChange}
              />
            </div>

            <div className="register__field">
              <label className="register__label" htmlFor={countryId}>
                Country
              </label>
              <input
                id={countryId}
                className="register__input"
                name="country"
                type="text"
                autoComplete="country-name"
                placeholder="Country"
                value={form.country}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="register__field">
            <label className="register__label" htmlFor={infoId}>
              Additional Information
            </label>
            <textarea
              id={infoId}
              className="register__textarea"
              name="info"
              placeholder="Additional Information ...."
              value={form.info}
              onChange={onChange}
              rows={4}
            />
          </div>

          <button className="register__button" type="submit" disabled={!canSubmit}>
            Register Users
          </button>

          {onSwitch ? (
            <p className="register__hint">
              Already have an account?{' '}
              <button className="register__link" type="button" onClick={onSwitch}>
                Login
              </button>
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}

