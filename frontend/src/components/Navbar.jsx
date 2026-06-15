import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
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
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginRight: '16px' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={logout} className="btn-outline">
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
  );
}
