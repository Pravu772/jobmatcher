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
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <img src="/logo.png" alt="JobMatcher Logo" className="auth-brand-logo" />
          <span className="auth-brand-name">JobMatcher</span>
        </Link>
        <h2>Forgot Password</h2>
        <p>Enter your email address to receive a password reset link.</p>

        {successMessage && <div className="success-banner">{successMessage}</div>}
        {errorMessage && <div className="error-banner">{errorMessage}</div>}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">Back to Log In</Link>
        </div>
      </div>
    </div>
  );
}
