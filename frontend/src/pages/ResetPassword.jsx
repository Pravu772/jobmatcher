import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

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
      <AuthLayout>
        <h2>Invalid Link</h2>
        <div className="error-banner" style={{ marginTop: '16px' }}>
          This password reset link is invalid or incomplete. Please request a new one.
        </div>
        <div className="auth-footer">
          <Link to="/forgot-password">Request a new reset link</Link>
        </div>
      </AuthLayout>
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
      const res = await axios.post(
        `/api/auth/reset-password/${token}`,
        { password, confirmPassword },
        {
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
    <AuthLayout>
      <h2>Reset Password</h2>
      <p className="auth-subtitle">Please enter and confirm your new password below.</p>

      {successMessage && (
        <div className="success-banner">
          <div>{successMessage}</div>
          <small style={{ display: 'block', marginTop: '8px', opacity: 0.8 }}>
            Redirecting to login in 3 seconds...
          </small>
        </div>
      )}

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="auth-footer">
        <Link to="/login">Back to Log In</Link>
      </div>
    </AuthLayout>
  );
}
