import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setSuccessMessage(res.data.message || 'If that email is registered, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card shadow-lg border-0">
        <div className="card-body p-0">
          <h2 className="card-title text-center fw-bold mb-2" style={{ color: 'var(--text)' }}>Forgot Password</h2>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Enter your email address to receive a password reset link.
          </p>

          {successMessage && (
            <div className="alert alert-success border-0 text-center mb-4 py-3" style={{ background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger border-0 text-center mb-4 py-3" style={{ background: 'var(--error-light)', color: 'var(--error)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              {errorMessage}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="auth-form d-flex flex-column gap-3">
              <div className="form-group mb-2">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-100 py-3 fw-bold"
                disabled={loading}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <div className="auth-footer mt-4 text-center">
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Back to Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
