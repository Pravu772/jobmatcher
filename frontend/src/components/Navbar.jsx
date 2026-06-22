import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Left — Brand logo */}
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo-img-wrap">
              <img src="/logo.png" alt="JobMatcher Logo" className="navbar-logo-img" />
            </div>
            <span className="navbar-title">JobMatcher</span>
          </Link>

          {/* Right — Auth links */}
          <div className="navbar-links">
            {user ? (
              <>
                <Link
                  to="/history"
                  className="navbar-history-link"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: location.pathname === '/history' ? 'var(--primary)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    marginRight: '20px',
                    transition: 'color 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  History
                </Link>
                <span className="navbar-greeting" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginRight: '16px' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="btn-outline navbar-logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="btn-outline">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="logout-modal-backdrop" onClick={() => setShowConfirm(false)}>
          <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-icon">
              <LogOut size={24} />
            </div>
            <h3>Log Out?</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="btn-modal-confirm" onClick={handleConfirmLogout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

