import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Target } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left — Brand logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <Target size={18} color="white" />
          </div>
          <span className="navbar-title">JobMatcher</span>
        </Link>

        {/* Right — Auth links */}
        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginRight: '4px' }}>
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
