import { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ResumeUploader from '../components/ResumeUploader';
import JDInput from '../components/JDInput';
import CandidateProfile from '../components/CandidateProfile';
import JobRecommendations from '../components/JobRecommendations';
import JDMatchResult from '../components/JDMatchResult';
import ATSScore from '../components/ATSScore';
import SkillGap from '../components/SkillGap';
import LearningPath from '../components/LearningPath';
import InterviewPrep from '../components/InterviewPrep';
import ResumeImprover from '../components/ResumeImprover';
import Suggestions from '../components/Suggestions';
import LoadingSpinner from '../components/LoadingSpinner';
import DownloadReportBtn from '../components/DownloadReportBtn';
import { Briefcase, BarChart2, Search, BookOpen, Mic, PenTool, AlertTriangle, CheckCircle2, Rocket, Info } from 'lucide-react';

/* ── Simple CSS-only Tooltip ── */
function Tooltip({ text, children }) {
  return (
    <span className="p1-tooltip-wrap">
      {children}
      <span className="p1-tooltip-box" role="tooltip">{text}</span>
    </span>
  );
}

/* ── ℹ️ Info icon + tooltip helper ── */
function InfoTip({ text }) {
  return (
    <Tooltip text={text}>
      <span className="p1-info-icon" aria-label="More info"><Info size={13} /></span>
    </Tooltip>
  );
}

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchPreloaded = async () => {
      const preloadedId = location.state?.preloadedId;
      if (preloadedId) {
        setLoading(true);
        setError('');
        try {
          const res = await axios.get(`/api/analysis/${preloadedId}`);
          setData(res.data.data);
          setAnalysisId(preloadedId);
          setActiveTab('overview');
          // Pre-populate inputs if available to keep state synced
          if (res.data.data.resumeText) setResumeText(res.data.data.resumeText);
          if (res.data.data.jobDescription) setJobDescription(res.data.data.jobDescription);
          setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 200);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to load preloaded report.');
        } finally {
          setLoading(false);
        }
        // Clean up location state
        window.history.replaceState({}, document.title);
      }
    };
    fetchPreloaded();
  }, [location]);

  const handleAnalyze = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      setError('Please upload a resume');
      return;
    }
    setError('');
    setLoading(true);
    setData(null);
    try {
      const res = await axios.post('/api/analyze', { resumeText, jobDescription });
      setData(res.data.data);
      setAnalysisId(res.data.analysisId);
      setActiveTab('overview');
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CircularProgress = ({ value, label, subtitle, tooltip, isNa }) => {
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isNa ? circumference : circumference - (value / 100) * circumference;
    const color = isNa ? 'var(--text-muted)' : value >= 70 ? 'var(--success)' : value >= 40 ? 'var(--warning)' : 'var(--error)';
    const sentiment = isNa ? null : value >= 70 ? '✅ Great!' : value >= 40 ? '⚠️ Needs Work' : '❌ Critical';

    return (
      <div className="summary-gauge-item">
        <div className="gauge-wrap">
          <svg width="68" height="68" className="gauge-svg">
            <circle cx="34" cy="34" r={radius} className="gauge-bg-circle" />
            <circle
              cx="34"
              cy="34"
              r={radius}
              className="gauge-fg-circle"
              style={{
                stroke: color,
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />
          </svg>
          <div className="gauge-value" style={{ color: isNa ? 'var(--text-muted)' : color }}>{isNa ? 'N/A' : `${value}%`}</div>
        </div>
        <div className="gauge-info">
          <div className="gauge-label">
            {label}
            {tooltip && <InfoTip text={tooltip} />}
          </div>
          <div className="gauge-sub">{subtitle}</div>
          {sentiment && <div className="gauge-sentiment" style={{ color }}>{sentiment}</div>}
        </div>
      </div>
    );
  };

  const badges = [
    { text: 'Job Matching', icon: <Briefcase size={16} /> },
    { text: 'ATS Score', icon: <BarChart2 size={16} /> },
    { text: 'Skill Gap', icon: <Search size={16} /> },
    { text: 'Learning Path', icon: <BookOpen size={16} /> },
    { text: 'Interview Prep', icon: <Mic size={16} /> },
    { text: 'Resume Improver', icon: <PenTool size={16} /> }
  ];

  const tabs = [
    { id: 'overview', name: 'Dashboard', icon: <Rocket size={16} /> },
    { id: 'ats', name: 'ATS Audit', icon: <BarChart2 size={16} /> },
    { id: 'jd', name: 'Job Fit & Roles', icon: <Briefcase size={16} /> },
    { id: 'learning', name: 'Learning Path', icon: <BookOpen size={16} /> },
    { id: 'interview', name: 'Interview Coach', icon: <Mic size={16} /> },
    { id: 'resume', name: 'Resume Tweaks', icon: <PenTool size={16} /> },
  ];


  return (
    <>
      <Helmet>
        <title>JobMatcher AI — Free AI Resume Analyzer & ATS Score Checker</title>
        <meta name="description" content="Upload your resume and get a free AI career report in 30 seconds: ATS score, job match %, skill gap analysis, learning roadmap, and AI interview prep. No sign-up required to try." />
        <meta name="keywords" content="AI resume analyzer, ATS score checker, free resume review AI, job description matcher, skill gap analysis, resume optimizer, interview prep AI, career assistant AI" />
        <link rel="canonical" href="https://jobmatcherai.app/" />
        <meta property="og:title" content="JobMatcher AI — Free AI Resume Analyzer & ATS Score Checker" />
        <meta property="og:description" content="Upload your resume and get an instant AI career report: ATS score, job match %, skill gaps, learning roadmap, and interview prep — completely free." />
        <meta property="og:url" content="https://jobmatcherai.app/" />
      </Helmet>
      <Navbar />
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <h1>Your AI-Powered <br /><span>Career Assistant</span></h1>
          <p>Upload your resume and get instant AI analysis — job matches, ATS score, skill gaps, learning roadmap, and interview prep.</p>

          <div className="badge-row">
            {badges.map(b => (
              <span key={b.text} className="badge">{b.icon} {b.text}</span>
            ))}
          </div>
        </div>


        {/* Input Section */}
        <div className="input-section">
          <ResumeUploader resumeText={resumeText} setResumeText={setResumeText} />
          <JDInput jobDescription={jobDescription} setJobDescription={setJobDescription} />
        </div>

        {/* Error */}
        {error && <div className="error-banner"><AlertTriangle size={20} /> {error}</div>}

        {/* CTA */}
        <div className="analyze-btn-wrap">
          <button className="btn-primary btn-analyze" onClick={handleAnalyze} disabled={loading} id="analyze-btn">
            {loading ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, animationDuration: '0.8s' }} /> Analyzing...</> : <><Rocket size={20} /> Analyze & Match</>}
          </button>


        </div>

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Results */}
        {data && !loading && (
          <div id="results" style={{ marginTop: 48 }}>
            <div className="results-header">
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={28} /> Analysis Complete</h2>
                <p>Here is your full AI-powered career report, {data.candidateProfile?.name || 'Candidate'}.</p>
              </div>
              {analysisId && <DownloadReportBtn analysisId={analysisId} />}
            </div>

            {/* Glowing SVG Gauges Summary Bar */}
            <div className="results-summary-bar">
              <CircularProgress
                value={data.atsScore?.overallScore || 0}
                label="Resume Pass Rate"
                subtitle="How well your resume scans"
                tooltip="ATS (Applicant Tracking System) is software companies use to automatically filter resumes before a human ever sees them. A higher score means your resume will pass the filter."
              />
              <CircularProgress
                value={data.jdMatch?.score || 0}
                label="Job Fit Score"
                subtitle="Match with the job you applied for"
                tooltip="This score shows how well your resume matches the job description you pasted. Higher is better — aim for 70%+."
                isNa={!jobDescription || !jobDescription.trim()}
              />
              <CircularProgress
                value={data.skillGap?.coveragePercent || 0}
                label="Skills You Have"
                subtitle="Out of all required skills"
                tooltip="This shows what percentage of the skills required for this role you already have listed on your resume."
              />
            </div>

            {/* Premium Dashboard Navigation Tabs */}
            <div className="dashboard-tabs">
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`dashboard-tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.icon}
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Panes */}
            <div className="dashboard-tab-content">
              {activeTab === 'overview' && (
                <div className="results-grid fade-in">
                  <div className="results-row-2">
                    <CandidateProfile data={data.candidateProfile} />

                    <div className="overview-stats-card card">
                      <div className="card-header">
                        <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BarChart2 size={20} />
                        </div>
                        <div>
                          <h3 className="card-title">Score Analysis</h3>
                          <p className="card-subtitle">Performance breakdown at a glance</p>
                        </div>
                      </div>
                      <div className="overview-stats-list">
                        <div className="overview-stat-row">
                          <span className="stat-name">
                            Resume Pass Rate
                            <InfoTip text="ATS (Applicant Tracking System) is software companies use to filter resumes automatically. A score of 70%+ is considered good." />
                          </span>
                          <span className="stat-badge" style={{
                            background: (data.atsScore?.overallScore || 0) >= 70 ? 'var(--success-light)' : (data.atsScore?.overallScore || 0) >= 40 ? 'var(--warning-light)' : 'var(--error-light)',
                            color: (data.atsScore?.overallScore || 0) >= 70 ? 'var(--success)' : (data.atsScore?.overallScore || 0) >= 40 ? 'var(--warning)' : 'var(--error)'
                          }}>{data.atsScore?.overallScore || 0}%</span>
                        </div>
                        <div className="overview-stat-row">
                          <span className="stat-name">
                            Job Fit Score
                            <InfoTip text="How well your resume matches the job description you pasted. Not pasted one? Add a job description above and re-analyze to unlock this score." />
                          </span>
                          <span className="stat-badge" style={{
                            background: !jobDescription || !jobDescription.trim() ? 'var(--border)' : (data.jdMatch?.score || 0) >= 70 ? 'var(--success-light)' : (data.jdMatch?.score || 0) >= 40 ? 'var(--warning-light)' : 'var(--error-light)',
                            color: !jobDescription || !jobDescription.trim() ? 'var(--text-muted)' : (data.jdMatch?.score || 0) >= 70 ? 'var(--success)' : (data.jdMatch?.score || 0) >= 40 ? 'var(--warning)' : 'var(--error)'
                          }}>{jobDescription && jobDescription.trim() ? `${data.jdMatch?.score || 0}%` : 'N/A'}</span>
                        </div>
                        <div className="overview-stat-row">
                          <span className="stat-name">
                            Skills You Have
                            <InfoTip text="The percentage of required skills for this job that are already present on your resume. Missing skills are shown in the Skill Gap tab." />
                          </span>
                          <span className="stat-badge" style={{
                            background: (data.skillGap?.coveragePercent || 0) >= 70 ? 'var(--success-light)' : (data.skillGap?.coveragePercent || 0) >= 40 ? 'var(--warning-light)' : 'var(--error-light)',
                            color: (data.skillGap?.coveragePercent || 0) >= 70 ? 'var(--success)' : (data.skillGap?.coveragePercent || 0) >= 40 ? 'var(--warning)' : 'var(--error)'
                          }}>{data.skillGap?.coveragePercent || 0}%</span>
                        </div>
                      </div>
                      <p className="overview-stats-tip">💡 Click on the navigation tabs above to explore deep-dive reports, missing skills roadmap, custom interview coaching, and rewrite recommendations.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="tab-pane-content fade-in">
                  <ATSScore data={data.atsScore} />
                </div>
              )}

              {activeTab === 'jd' && (
                <div className="tab-pane-content fade-in">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <JDMatchResult data={data.jdMatch} hasJD={!!jobDescription} />
                    <JobRecommendations data={data.jobRecommendations} />
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="tab-pane-content fade-in">
                  <LearningPath data={data.learningPath} />
                </div>
              )}

              {activeTab === 'interview' && (
                <div className="tab-pane-content fade-in">
                  <InterviewPrep data={data.interviewPrep} />
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="tab-pane-content fade-in">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <ResumeImprover data={data.resumeImprover} />
                    <Suggestions data={data.suggestions} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <section id="features" className="landing-section">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>JobMatcher AI provides professional career development diagnostics powered by Gemini</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><BarChart2 size={24} /></div>
              <h3>ATS Score Analysis</h3>
              <p>Evaluate your resume structure, keyword utilization, formatting consistency, and density parameters instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Briefcase size={24} /></div>
              <h3>Job Description Matching</h3>
              <p>Compare resume compatibility against target job descriptions to calculate contextual suitability scores.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Search size={24} /></div>
              <h3>Skill Gap Identification</h3>
              <p>Discover missing technical or soft skills relative to target industries and job descriptions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><BookOpen size={24} /></div>
              <h3>Learning Roadmap</h3>
              <p>Access customized learning curricula with step-by-step topics, estimated timeframes, and references.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Mic size={24} /></div>
              <h3>Interview Preparation</h3>
              <p>Review personalized behavioral and technical questions with answers tailored to your candidate profile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><PenTool size={24} /></div>
              <h3>Resume Improver</h3>
              <p>View side-by-side optimization comparisons to rewrite resume bullets and boost structural impact.</p>
            </div>
          </div>
        </section>

        {/* About AI Section */}
        <section id="about" className="landing-section about-section">
          <div className="about-card-wrap">
            <div className="about-badge">Powered by Google Gemini</div>
            <h2>Next-Generation Career Advisory</h2>
            <p>
              JobMatcher AI is engineered with Google's state-of-the-art Gemini generative models.
              By leveraging advanced Natural Language Processing (NLP), JobMatcher parses resume text in real-time, matching structural content against candidate experience criteria, formatting constraints, and technical industry expectations.
            </p>
            <div className="about-benefits">
              <div className="benefit-item">
                <div className="benefit-dot"></div>
                <span>100% Secure & Confidential Analysis</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-dot"></div>
                <span>Real-Time Diagnostic Feedback</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-dot"></div>
                <span>Data-Driven Career Development Roadmap</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="JobMatcher Logo" className="footer-logo-img" />
              <span className="footer-logo-text">JobMatcher</span>
            </div>
            <p className="footer-tagline">Optimize your resume, identify critical skill gaps, and match with the most relevant jobs instantly using advanced AI analysis.</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#about">About AI</a>
            </div>
            <div className="footer-col">
              <h4>Developer</h4>
              <a href="https://pravindev.tech" target="_blank" rel="noopener noreferrer">Portfolio</a>
              <a href="https://wa.me/916381017750" target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 JobMatcher AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
