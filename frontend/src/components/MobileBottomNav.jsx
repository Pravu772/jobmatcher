import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function MobileBottomNav() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Only show when user is logged in
  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
  };

  return (
    <>
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <div className="nav-icon-wrap">
            <Home size={21} />
          </div>
          <span>Home</span>
        </Link>

        <Link to="/history" className={`mobile-nav-item ${isActive('/history') ? 'active' : ''}`}>
          <div className="nav-icon-wrap">
            <Clock size={21} />
          </div>
          <span>History</span>
        </Link>

        <button
          onClick={handleLogoutClick}
          className="mobile-nav-item mobile-nav-logout"
        >
          <div className="nav-icon-wrap">
            <LogOut size={21} />
          </div>
          <span>Logout</span>
        </button>
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


