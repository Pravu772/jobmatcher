import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Debug: log the token from URL params on mount
  console.log('[ResetPassword] Token from URL:', token);

  // Guard: if no token in URL, show an error immediately
  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Invalid Link</h2>
          <div className="error-banner" style={{ marginTop: '16px' }}>
            This password reset link is invalid or incomplete. Please request a new one.
          </div>
          <div className="auth-footer">
            <Link to="/forgot-password">Request a new reset link</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    console.log('[ResetPassword] Submitting reset for token:', token);

    try {
      // IMPORTANT: This is a PUBLIC endpoint — no JWT required.
      // The axios request interceptor in main.jsx will NOT attach an
      // Authorization header unless a valid token is in localStorage.
      const res = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password, confirmPassword },
        {
          // Explicitly omit Authorization header for this public route
          // even if a stale token is somehow in localStorage.
          headers: { Authorization: undefined },
        }
      );

      console.log('[ResetPassword] Success:', res.data.message);
      setSuccessMessage(res.data.message || 'Your password has been reset successfully.');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        'Failed to reset password. The link may have expired or is invalid.';
      console.error('[ResetPassword] Error:', msg, err.response?.status);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card shadow-lg border-0">
        <div className="card-body p-0">
          <h2 className="card-title text-center fw-bold mb-2" style={{ color: 'var(--text)' }}>Reset Password</h2>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Please enter and confirm your new password below.
          </p>

          {successMessage && (
            <div className="alert alert-success border-0 text-center mb-4 py-3" style={{ background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              <div>{successMessage}</div>
              <small className="d-block mt-2 text-muted fw-medium">
                Redirecting to login in 3 seconds...
              </small>
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
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>New Password</label>
                <div className="input-group d-flex" style={{ borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      border: 'none',
                      padding: '12px 14px',
                      flex: 1,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    className="btn px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Confirm Password</label>
                <div className="input-group d-flex" style={{ borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      border: 'none',
                      padding: '12px 14px',
                      flex: 1,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    className="btn px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
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
