import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { authAPI } from './api';
import './Admin.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const userData = await authAPI.getMe();
        if (userData.is_admin) {
          setUser(userData);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel user={user} onLogout={handleLogout} />;
};

export default Admin;
