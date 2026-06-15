import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="main">
        <div className="legal-container">
          <div className="legal-header">
            <div className="legal-icon">
              <FileText size={32} />
            </div>
            <h1>Terms of Service</h1>
            <p>Last updated: June 15, 2026</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using JobMatcher AI, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use the application.
              </p>
            </section>

            <section>
              <h2>2. Use of Service</h2>
              <p>
                JobMatcher provides you with tools to evaluate resume alignment, analyze skill gaps, and view custom learning roadmaps. You agree to:
              </p>
              <ul>
                <li>Provide accurate profile information.</li>
                <li>Upload only documents and resumes that belong to you or that you have authorization to submit.</li>
                <li>Not engage in any automated scraping, reverse engineering, or denial of service attacks.</li>
              </ul>
            </section>

            <section>
              <h2>3. AI Disclaimer and Limits</h2>
              <p>
                Our reports, match percentages, learning recommendations, and interview answers are generated dynamically by artificial intelligence.
              </p>
              <ul>
                <li><strong>No Employment Guarantee:</strong> JobMatcher reports are advisory. We do not guarantee job offers, hiring selection, or career placement.</li>
                <li><strong>Information Accuracy:</strong> AI analysis might contain errors, omissions, or context gaps. You should cross-reference all recommendations with official job postings and curricula.</li>
              </ul>
            </section>

            <section>
              <h2>4. Intellectual Property</h2>
              <p>
                The design, components, branding logos, layout, and matching algorithms are the intellectual property of JobMatcher AI and the project developers. You may use reports for personal, non-commercial purposes.
              </p>
            </section>

            <section>
              <h2>5. Modifications and Termination</h2>
              <p>
                We reserve the right to modify or discontinue the service, or revoke access to any user account at any time, for violation of these terms or operational requirements.
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
