import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Target } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo"><Target size={20} color="white" /></div>
          <span className="navbar-title">JobMatcher <span></span></span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginRight: '12px', display: 'flex', alignItems: 'center' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={logout} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/signup" className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: '8px' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
