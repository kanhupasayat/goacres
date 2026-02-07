import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiShield } from 'react-icons/fi';
import { authAPI } from './api';
import './Admin.css';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('admin_token', data.access_token);

      // Get user info
      const user = await authAPI.getMe();
      if (!user.is_admin) {
        localStorage.removeItem('admin_token');
        throw new Error('Access denied. Admin privileges required.');
      }

      onLogin(user);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background Effects */}
      <div className="login-bg-gradient"></div>
      <div className="login-bg-pattern"></div>
      <div className="login-glow login-glow-1"></div>
      <div className="login-glow login-glow-2"></div>

      <div className="login-container">
        {/* Logo Section */}
        <div className="login-logo">
          <div className="logo-icon">
            <FiShield />
          </div>
          <h1 className="logo-text">GOACRES</h1>
          <span className="logo-subtitle">Admin Portal</span>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goacres.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Protected admin area. Unauthorized access is prohibited.</p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <code>admin@msquare.pk / admin123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
