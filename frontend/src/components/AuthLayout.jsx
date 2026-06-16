import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {/* Left Sidebar — Brand Showcase (Visible on Desktop) */}
      <div className="auth-sidebar">
        <Link to="/" className="auth-sidebar-back">
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
        <div className="auth-sidebar-content">
          <div className="auth-sidebar-logo-wrap">
            <img src="/logo.png" alt="JobMatcher Logo" className="auth-sidebar-logo" />
          </div>
          <h1 className="auth-sidebar-title">JobMatcher</h1>
          <p className="auth-sidebar-tagline">
            Optimize your resume, identify critical skill gaps, and match with the most relevant jobs instantly using advanced AI analysis.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <CheckCircle2 size={18} className="auth-feature-icon" />
              <span>Real-time ATS parsing & formatting audit</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle2 size={18} className="auth-feature-icon" />
              <span>Contextual alignment scoring with target jobs</span>
            </div>
            <div className="auth-feature-item">
              <CheckCircle2 size={18} className="auth-feature-icon" />
              <span>Gemini-powered custom career roadmaps</span>
            </div>
          </div>
        </div>
        <div className="auth-sidebar-footer">
          © 2026 JobMatcher AI. All rights reserved.
        </div>
      </div>

      {/* Right Side — Form Section */}
      <div className="auth-form-section">
        {/* Mobile back link */}
        <Link to="/" className="auth-mobile-back">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="auth-form-card">
          {/* Logo header shown on mobile only */}
          <div className="auth-mobile-logo-header">
            <img src="/logo.png" alt="JobMatcher Logo" className="auth-mobile-logo" />
            <span className="auth-mobile-title">JobMatcher</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
