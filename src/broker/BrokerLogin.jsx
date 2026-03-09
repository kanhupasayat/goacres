import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrokerAuth } from '../contexts/BrokerAuthContext'
import './BrokerLogin.css'

const API = import.meta.env.VITE_API_URL || ''

export default function BrokerLogin() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useBrokerAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!phone.trim() || !password.trim()) {
      setError('Phone aur password daalo')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/broker/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login fail')
        return
      }
      login(data.token, data.broker)
      navigate('/broker/submit')
    } catch {
      setError('Server se connect nahi ho pa raha. Thodi der baad try karo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bl-page">
      <div className="bl-card">
        <div className="bl-logo">G</div>
        <h1 className="bl-title">GOACRES Broker</h1>
        <p className="bl-sub">Apna phone number aur password daalo</p>

        {error && <div className="bl-error">{error}</div>}

        <form onSubmit={handleSubmit} className="bl-form">
          <div className="bl-field">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="919876543210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div className="bl-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password daalo"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="bl-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
