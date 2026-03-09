import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrokerAuth } from '../contexts/BrokerAuthContext'
import './BrokerSubmissions.css'

const API = import.meta.env.VITE_API_URL || ''

export default function BrokerSubmissions() {
  const { token, logout } = useBrokerAuth()
  const navigate = useNavigate()
  const [plots, setPlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/broker/my-submissions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setPlots(data.submissions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const statusBadge = (status) => {
    if (status === 'approved') return <span className="bsub-badge bsub-approved">Approved</span>
    if (status === 'rejected') return <span className="bsub-badge bsub-rejected">Rejected</span>
    return <span className="bsub-badge bsub-pending">Pending</span>
  }

  return (
    <div className="bsub-page">
      <div className="bsub-header">
        <div className="bsub-header-left">
          <img src="/logo.png" alt="GOACRES" className="bsub-logo-img" />
          <span className="bsub-brand">My Submissions</span>
        </div>
        <div className="bsub-header-right">
          <button className="bsub-link" onClick={() => navigate('/broker/submit')}>+ New Plot</button>
          <button className="bsub-link bsub-link-red" onClick={() => { logout(); navigate('/broker') }}>Logout</button>
        </div>
      </div>

      <div className="bsub-content">
        {loading ? (
          <div className="bsub-loading"><div className="bsub-spinner" /> Loading...</div>
        ) : plots.length === 0 ? (
          <div className="bsub-empty">
            <p>Koi submission nahi hai abhi.</p>
            <button className="bsub-btn" onClick={() => navigate('/broker/submit')}>Plot Submit Karo</button>
          </div>
        ) : (
          <div className="bsub-list">
            {plots.map(p => (
              <div key={p.id} className="bsub-card">
                {p.photo ? (
                  <img src={p.photo} alt="" className="bsub-thumb" />
                ) : (
                  <div className="bsub-thumb bsub-no-photo">No Photo</div>
                )}
                <div className="bsub-info">
                  <h3>{p.title}</h3>
                  <p className="bsub-loc">{p.location} • {p.type}</p>
                  <div className="bsub-meta">
                    {statusBadge(p.status)}
                    {p.submitted_at && <span className="bsub-date">{new Date(p.submitted_at).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
