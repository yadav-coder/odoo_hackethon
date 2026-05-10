import { useMemo, useState } from 'react'
import './sectionModal.css'

export default function SectionModal({ open, onClose, onSave, initial = {} }) {
  const [values, setValues] = useState({
    title: initial.title || '',
    description: initial.description || '',
    startDate: initial.startDate || '',
    endDate: initial.endDate || '',
    budget: initial.budget || '',
    image: initial.image || '',
  })

  const errors = useMemo(() => {
    const e = {}
    if (!values.title.trim()) e.title = 'Title is required'
    if (!values.description.trim()) e.description = 'Description is required'
    if (!values.startDate) e.startDate = 'Start date is required'
    if (!values.endDate) e.endDate = 'End date is required'
    if (!values.budget) e.budget = 'Budget is required'
    return e
  }, [values])

  if (!open) return null

  const onChange = (ev) => {
    const { name, value } = ev.target
    setValues((p) => ({ ...p, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (Object.keys(errors).length) return
    onSave?.({
      ...values,
      budget: Number(values.budget),
    })
    onClose?.()
  }

  return (
    <div className="smodal" role="dialog" aria-modal="true">
      <button className="smodal__backdrop" type="button" aria-label="Close" onClick={onClose} />
      <div className="smodal__panel">
        <div className="smodal__head">
          <h3 className="smodal__title">Add Section</h3>
          <button className="smodal__x" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="smodal__form" onSubmit={submit}>
          <div className="smodal__grid">
            <div className="smodal__field">
              <label className="smodal__label">Section title</label>
              <input
                className="smodal__input"
                name="title"
                value={values.title}
                onChange={onChange}
                placeholder="e.g., Food & Nightlife"
              />
              {errors.title ? <p className="smodal__err">{errors.title}</p> : null}
            </div>

            <div className="smodal__field smodal__field--full">
              <label className="smodal__label">Description</label>
              <textarea
                className="smodal__textarea"
                name="description"
                value={values.description}
                onChange={onChange}
                rows={4}
                placeholder="Activities, timings, transport notes..."
              />
              {errors.description ? <p className="smodal__err">{errors.description}</p> : null}
            </div>

            <div className="smodal__field">
              <label className="smodal__label">Start date</label>
              <input
                className="smodal__input"
                type="date"
                name="startDate"
                value={values.startDate}
                onChange={onChange}
              />
              {errors.startDate ? <p className="smodal__err">{errors.startDate}</p> : null}
            </div>

            <div className="smodal__field">
              <label className="smodal__label">End date</label>
              <input
                className="smodal__input"
                type="date"
                name="endDate"
                value={values.endDate}
                onChange={onChange}
              />
              {errors.endDate ? <p className="smodal__err">{errors.endDate}</p> : null}
            </div>

            <div className="smodal__field">
              <label className="smodal__label">Budget (₹)</label>
              <input
                className="smodal__input"
                type="number"
                min="0"
                name="budget"
                value={values.budget}
                onChange={onChange}
                placeholder="6000"
              />
              {errors.budget ? <p className="smodal__err">{errors.budget}</p> : null}
            </div>

            <div className="smodal__field">
              <label className="smodal__label">Image URL (optional)</label>
              <input
                className="smodal__input"
                name="image"
                value={values.image}
                onChange={onChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="smodal__actions">
            <button className="smodal__btn smodal__btn--ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="smodal__btn" type="submit">
              Save section
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

