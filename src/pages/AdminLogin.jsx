import React, { useState } from 'react';
import { ShieldIcon, ArrowLeftIcon } from '../components/Icons';
import { login, logout, isAuthenticated, getAdminSession } from '../services/auth';

export default function AdminLogin({ onLoginSuccess, onLogout, onBack }) {
  const [email, setEmail] = useState('creator@cinenova.stream');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isUserAuth = isAuthenticated();
  const currentSession = getAdminSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.message || 'Login failed. Please check your inputs.');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred during login.');
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="container" style={{ padding: '60px 20px 100px', maxWidth: '520px' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onBack}
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeftIcon size={18} /> Return to Storefront
      </button>

      <div className="form-card" style={{ maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold-dark))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)',
              marginBottom: '16px',
              boxShadow: '0 6px 20px rgba(232, 197, 104, 0.35)',
            }}
          >
            <ShieldIcon size={30} />
          </div>
          <h1 className="font-display" style={{ fontSize: '2rem' }}>
            Creator Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Authorized Content Management for CineNova
          </p>
        </div>

        {/* Clear Development / Demo Session Notice */}
        <div
          style={{
            backgroundColor: 'rgba(232, 197, 104, 0.08)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}
        >
          <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
            🛠️ Development Demo Authentication
          </strong>
          This build uses a secure client-side session. Pre-filled demo credentials are valid for testing catalog additions, edits, and deletions. Production deployments connect directly to Firebase Auth or Supabase Auth without code restructuring.
        </div>

        {isUserAuth ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <span style={{ color: '#4ade80', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Active Admin Session
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {currentSession?.email}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onLoginSuccess}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(235, 75, 75, 0.15)',
                  border: '1px solid rgba(235, 75, 75, 0.4)',
                  color: '#ff9999',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="admin-email">
                Admin Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cinenova.stream"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
