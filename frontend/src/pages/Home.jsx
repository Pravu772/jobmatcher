import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { Briefcase, BarChart2, Search, BookOpen, Mic, PenTool, AlertTriangle, CheckCircle2, Rocket } from 'lucide-react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const badges = [
    { text: 'Job Matching', icon: <Briefcase size={16} /> },
    { text: 'ATS Score', icon: <BarChart2 size={16} /> },
    { text: 'Skill Gap', icon: <Search size={16} /> },
    { text: 'Learning Path', icon: <BookOpen size={16} /> },
    { text: 'Interview Prep', icon: <Mic size={16} /> },
    { text: 'Resume Improver', icon: <PenTool size={16} /> }
  ];

  return (
    <>
      <Navbar />
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <h1>Your AI-Powered<br /><span>Career Assistant</span></h1>
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
        <button className="btn-primary" onClick={handleAnalyze} disabled={loading} id="analyze-btn">
          {loading ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, animationDuration: '0.8s' }} /> Analyzing...</> : <><Rocket size={20} /> Analyze & Match</>}
        </button>

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

            <div className="results-grid">
              {/* Row 1: Candidate Profile + ATS Score */}
              <div className="results-row-2">
                <CandidateProfile data={data.candidateProfile} />
                <ATSScore data={data.atsScore} />
              </div>

              {/* Row 2: Job Recommendations (full width) */}
              <JobRecommendations data={data.jobRecommendations} />

              {/* Row 3: JD Match + Skill Gap */}
              <div className="results-row-2">
                <JDMatchResult data={data.jdMatch} hasJD={!!jobDescription} />
                <SkillGap data={data.skillGap} />
              </div>

              {/* Row 4: Learning Path (full width) */}
              <LearningPath data={data.learningPath} />

              {/* Row 5: Interview Prep + Resume Improver */}
              <div className="results-row-2">
                <InterviewPrep data={data.interviewPrep} />
                <ResumeImprover data={data.resumeImprover} />
              </div>

              {/* Row 6: Suggestions (full width) */}
              <Suggestions data={data.suggestions} />
            </div>
          </div>
        )}
      </main>

      <footer>
        © 2026 JobMatcher AI. All rights reserved. |{' '}
        <a href="https://pravindev.tech" target="_blank" rel="noopener noreferrer">
          About Developer
        </a>
      </footer>
    </>
  );
}
