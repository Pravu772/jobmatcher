import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | JobMatcher AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Navbar />
      <main className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '480px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90px',
            height: '90px',
            background: 'var(--primary-light)',
            borderRadius: '50%',
            marginBottom: '24px',
            color: 'var(--primary)'
          }}>
            <HelpCircle size={48} />
          </div>
          
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            404
          </h1>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
            Page Not Found
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
          
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', width: 'auto', padding: '12px 24px', margin: '0 auto' }}>
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}
