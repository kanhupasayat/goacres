import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrokerAuth } from '../contexts/BrokerAuthContext'
import './BrokerSubmit.css'

const API = import.meta.env.VITE_API_URL || ''

const STEPS = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'details', label: 'Details' },
  { id: 'photos', label: 'Photos' },
  { id: 'review', label: 'Submit' },
]

const PLOT_TYPES = ['Residential', 'Commercial', 'Farm House', 'Industrial']
const FACINGS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
const ROAD_TYPES = ['NH', 'SH', 'Tar', 'Concrete', 'Kachcha', 'Other']

export default function BrokerSubmit() {
  const { token, logout } = useBrokerAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const DRAFT_KEY = 'broker_plot_draft'

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return null
  }

  const draft = loadDraft()

  const [step, setStep] = useState(draft?.step || 0)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState(draft?.form || {
    title: '',
    location: '',
    type: 'Residential',
    highlight: '',
    sqft: '',
    decimal: '',
    dimensions: '',
    price_min: '',
    price_max: '',
    road_width: '',
    road_type: '',
    facing: '',
    corner_plot: false,
    boundary_wall: false,
    water: 'true',
    electricity: true,
    landmark: '',
    distance_main_road: '',
    extra_notes: '',
    video: '',
    photos: [],
  })

  // Auto-save draft on every change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step }))
  }, [form, step])

  const clearDraft = () => localStorage.removeItem(DRAFT_KEY)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const uploadPhoto = async (file) => {
    setUploadingPhoto(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API}/api/broker/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      set('photos', [...form.photos, data.url])
    } catch (err) {
      setError(err.message || 'Photo upload fail')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const removePhoto = (idx) => {
    set('photos', form.photos.filter((_, i) => i !== idx))
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(f => uploadPhoto(f))
    e.target.value = ''
  }

  const canNext = () => {
    if (step === 0) return form.title.trim() && form.location.trim() && form.type
    if (step === 2) return form.photos.length >= 1
    return true
  }

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/broker/submit-plot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      clearDraft()
    } catch (err) {
      setError(err.message || 'Submit fail')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bs-page">
        <div className="bs-success">
          <div className="bs-check">✓</div>
          <h2>Plot Submit Ho Gaya!</h2>
          <p>Admin review karega, approve hone pe site pe dikhega.</p>
          <div className="bs-success-btns">
            <button className="bs-btn" onClick={() => { clearDraft(); setSuccess(false); setForm({ ...form, title: '', location: '', highlight: '', sqft: '', decimal: '', dimensions: '', price_min: '', price_max: '', road_width: '', road_type: '', facing: '', corner_plot: false, boundary_wall: false, landmark: '', distance_main_road: '', extra_notes: '', video: '', photos: [] }); setStep(0) }}>
              Aur Plot Add Karo
            </button>
            <button className="bs-btn bs-btn-outline" onClick={() => navigate('/broker/submissions')}>
              Meri Submissions Dekho
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bs-page">
      <div className="bs-header">
        <div className="bs-header-left">
          <img src="/logo.png" alt="GOACRES" className="bs-logo-img" />
          <span className="bs-brand">GOACRES</span>
        </div>
        <div className="bs-header-right">
          <button className="bs-link" onClick={() => navigate('/broker/submissions')}>My Plots</button>
          <button className="bs-link bs-link-red" onClick={() => { logout(); navigate('/broker') }}>Logout</button>
        </div>
      </div>

      {/* Steps */}
      <div className="bs-steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`bs-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="bs-step-num">{i < step ? '✓' : i + 1}</span>
            <span className="bs-step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {error && <div className="bs-error">{error}</div>}

      <div className="bs-card">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <>
            <h2 className="bs-card-title">Plot ki Basic Info</h2>
            <div className="bs-field">
              <label>Plot ka Naam *</label>
              <input placeholder="Jaise: 5 Decimal Plot Near Fertilizer Township" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="bs-field">
              <label>Location *</label>
              <input placeholder="Jaise: Fertilizer Township, Rourkela" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="bs-row">
              <div className="bs-field">
                <label>Plot Type *</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {PLOT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="bs-field">
                <label>Highlight</label>
                <input placeholder="Jaise: Corner Plot, Main Road" value={form.highlight} onChange={e => set('highlight', e.target.value)} />
              </div>
            </div>
          </>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <>
            <h2 className="bs-card-title">Plot Details</h2>
            <div className="bs-row">
              <div className="bs-field">
                <label>Area (sqft)</label>
                <input type="number" placeholder="3600" value={form.sqft} onChange={e => set('sqft', e.target.value)} />
              </div>
              <div className="bs-field">
                <label>Area (decimal)</label>
                <input type="number" step="0.01" placeholder="5" value={form.decimal} onChange={e => set('decimal', e.target.value)} />
              </div>
            </div>
            <div className="bs-row">
              <div className="bs-field">
                <label>Dimensions</label>
                <input placeholder="60 x 60 ft" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} />
              </div>
              <div className="bs-field">
                <label>Facing</label>
                <select value={form.facing} onChange={e => set('facing', e.target.value)}>
                  <option value="">Select</option>
                  {FACINGS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="bs-row">
              <div className="bs-field">
                <label>Min Price (₹/decimal)</label>
                <input type="number" placeholder="200000" value={form.price_min} onChange={e => set('price_min', e.target.value)} />
              </div>
              <div className="bs-field">
                <label>Max Price (₹/decimal)</label>
                <input type="number" placeholder="250000" value={form.price_max} onChange={e => set('price_max', e.target.value)} />
              </div>
            </div>
            <div className="bs-row">
              <div className="bs-field">
                <label>Road Width</label>
                <input placeholder="20 ft" value={form.road_width} onChange={e => set('road_width', e.target.value)} />
              </div>
              <div className="bs-field">
                <label>Road Type</label>
                <select value={form.road_type} onChange={e => set('road_type', e.target.value)}>
                  <option value="">Select</option>
                  {ROAD_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="bs-checks">
              <label><input type="checkbox" checked={form.corner_plot} onChange={e => set('corner_plot', e.target.checked)} /> Corner Plot</label>
              <label><input type="checkbox" checked={form.boundary_wall} onChange={e => set('boundary_wall', e.target.checked)} /> Boundary Wall</label>
              <label><input type="checkbox" checked={form.electricity} onChange={e => set('electricity', e.target.checked)} /> Electricity</label>
            </div>
            <div className="bs-field">
              <label>Landmark</label>
              <input placeholder="Near kya hai? School, Hospital etc." value={form.landmark} onChange={e => set('landmark', e.target.value)} />
            </div>
            <div className="bs-field">
              <label>Main Road se Distance</label>
              <input placeholder="500m" value={form.distance_main_road} onChange={e => set('distance_main_road', e.target.value)} />
            </div>
            <div className="bs-field">
              <label>Extra Notes</label>
              <textarea placeholder="Kuch aur batana ho to likho..." rows={3} value={form.extra_notes} onChange={e => set('extra_notes', e.target.value)} />
            </div>
          </>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <>
            <h2 className="bs-card-title">Photos & Video</h2>
            <p className="bs-photo-count" style={{ fontSize: 12, color: form.photos.length >= 5 ? '#22c55e' : '#e67e22', marginBottom: 8 }}>
              {form.photos.length} photo{form.photos.length !== 1 ? 's' : ''} {form.photos.length >= 5 ? '✓' : '(5+ photos better hai)'}
            </p>
            <div className="bs-upload-area" onClick={() => fileRef.current?.click()}>
              {uploadingPhoto ? (
                <div className="bs-uploading"><div className="bs-spinner" /> Uploading...</div>
              ) : (
                <>
                  <span className="bs-upload-icon">📷</span>
                  <span>Photos select karo (tap karo)</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
            </div>
            {form.photos.length > 0 && (
              <div className="bs-photo-grid">
                {form.photos.map((url, i) => (
                  <div key={i} className="bs-photo-item">
                    <img src={url} alt="" />
                    <button className="bs-photo-remove" onClick={() => removePhoto(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="bs-field" style={{ marginTop: 16 }}>
              <label>Video Link (YouTube / Google Drive)</label>
              <input placeholder="https://youtube.com/..." value={form.video} onChange={e => set('video', e.target.value)} />
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <h2 className="bs-card-title">Review & Submit</h2>
            <div className="bs-review">
              <div className="bs-review-row"><span>Title:</span><strong>{form.title}</strong></div>
              <div className="bs-review-row"><span>Location:</span><strong>{form.location}</strong></div>
              <div className="bs-review-row"><span>Type:</span><strong>{form.type}</strong></div>
              {form.highlight && <div className="bs-review-row"><span>Highlight:</span><strong>{form.highlight}</strong></div>}
              {form.sqft && <div className="bs-review-row"><span>Area:</span><strong>{form.sqft} sqft ({form.decimal || '-'} decimal)</strong></div>}
              {form.dimensions && <div className="bs-review-row"><span>Dimensions:</span><strong>{form.dimensions}</strong></div>}
              {(form.price_min || form.price_max) && <div className="bs-review-row"><span>Price:</span><strong>₹{form.price_min || 0} - ₹{form.price_max || 0}/decimal</strong></div>}
              {form.facing && <div className="bs-review-row"><span>Facing:</span><strong>{form.facing}</strong></div>}
              {form.road_width && <div className="bs-review-row"><span>Road:</span><strong>{form.road_width} {form.road_type}</strong></div>}
              {form.landmark && <div className="bs-review-row"><span>Landmark:</span><strong>{form.landmark}</strong></div>}
              <div className="bs-review-row">
                <span>Features:</span>
                <strong>
                  {[form.corner_plot && 'Corner', form.boundary_wall && 'Boundary Wall', form.electricity && 'Electricity'].filter(Boolean).join(', ') || 'None'}
                </strong>
              </div>
              {form.photos.length > 0 && <div className="bs-review-row"><span>Photos:</span><strong>{form.photos.length} photo(s)</strong></div>}
              {form.extra_notes && <div className="bs-review-row"><span>Notes:</span><strong>{form.extra_notes}</strong></div>}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="bs-nav">
        {step > 0 && (
          <button className="bs-btn bs-btn-outline" onClick={() => setStep(step - 1)}>← Back</button>
        )}
        <div style={{ flex: 1 }} />
        {step < 3 ? (
          <button className="bs-btn" disabled={!canNext()} onClick={() => { setError(''); setStep(step + 1) }}>
            Next →
          </button>
        ) : (
          <button className="bs-btn" disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting...' : 'Submit Plot ✓'}
          </button>
        )}
      </div>
    </div>
  )
}
