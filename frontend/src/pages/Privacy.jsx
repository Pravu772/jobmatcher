import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — JobMatcher AI</title>
        <meta name="description" content="Read the JobMatcher AI Privacy Policy. Learn how we securely process your resume data with AI and how we protect your personal information." />
        <link rel="canonical" href="https://jobmatcherai.app/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Navbar />
      <main className="main">
        <div className="legal-container">
          <div className="legal-header">
            <div className="legal-icon">
              <Shield size={32} />
            </div>
            <h1>Privacy Policy</h1>
            <p>Last updated: June 15, 2026</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>1. Introduction</h2>
              <p>
                Welcome to JobMatcher AI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring a secure experience when using our AI-powered career assistant. This Privacy Policy describes how we collect, process, and secure your data.
              </p>
            </section>

            <section>
              <h2>2. Data Collection and Usage</h2>
              <p>
                To provide resume evaluation, skill gap identification, and job matching reports, we process:
              </p>
              <ul>
                <li><strong>Resume Data:</strong> The text content of the resume you upload or paste (e.g., name, education, experience, skills).</li>
                <li><strong>Job Descriptions:</strong> The target job specifications you submit for comparison.</li>
                <li><strong>Account Credentials:</strong> Standard signup details (name, email, and hashed password) required to store your history.</li>
              </ul>
            </section>

            <section>
              <h2>3. AI Processing & Privacy</h2>
              <p>
                Resume text is parsed and evaluated in real-time using secure endpoints of Google's Gemini generative AI models. 
              </p>
              <ul>
                <li>Your uploads are processed solely for generating your matching reports.</li>
                <li>No text or documents uploaded to our platform are sold or shared with third-party advertisers.</li>
              </ul>
            </section>

            <section>
              <h2>4. Security</h2>
              <p>
                All passwords are secure and cryptographically hashed with `bcryptjs`. We store your parsed analysis history inside a secure database, which is protected by industry-standard access control lists and only accessible by you under your authenticated session.
              </p>
            </section>

            <section>
              <h2>5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how your data is handled, feel free to reach out directly:
              </p>
              <p>
                WhatsApp Support: <a href="https://wa.me/916381017750" target="_blank" rel="noopener noreferrer">+91 6381017750</a>
              </p>
            </section>
          </div>

          <div className="legal-actions">
            <Link to="/" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
