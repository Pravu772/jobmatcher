import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trash2, History as HistoryIcon, Calendar, ArrowRight, AlertCircle, FileText } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect guest users
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/history');
      setHistory(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis report?')) {
      return;
    }
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete history item.');
    }
  };

  const handleView = (id) => {
    navigate('/', { state: { preloadedId: id } });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'var(--success)';
    if (s >= 40) return 'var(--warning)';
    return 'var(--error)';
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="main">
        <div className="history-container">
          <div className="history-header">
            <div className="history-title-wrap">
              <h1>
                <HistoryIcon size={32} color="var(--primary)" />
                Analysis History
              </h1>
              <p>Revisit your past resume evaluations and job matching scores.</p>
            </div>
          </div>

          {error && (
            <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : history.length === 0 ? (
            <div className="history-empty-state">
              <div className="history-empty-icon">
                <FileText size={48} />
              </div>
              <h3>No Reports Found</h3>
              <p>You haven't run any AI career analysis yet. Upload your resume to get started!</p>
              <Link
                to="/"
                className="btn-primary btn-analyze"
                style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                <ArrowRight size={16} /> Analyze Resume
              </Link>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((item) => (
                <div key={item._id} className="history-card" onClick={() => handleView(item._id)}>
                  <div className="history-main-info">
                    <div className="history-meta-box">
                      <div className="history-candidate-name">
                        {item.candidateProfile?.name || 'Untitled Candidate'}
                      </div>
                      <div className="history-date">
                        <Calendar size={14} /> {formatDate(item.createdAt)}
                      </div>
                    </div>

                    {item.jobDescription && (
                      <div className="history-jd-snippet" title={item.jobDescription}>
                        <strong>JD:</strong> {item.jobDescription}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="history-scores">
                      <div className="history-score-item">
                        <span className="history-score-val" style={{ color: getScoreColor(item.atsScore?.overallScore || 0) }}>
                          {item.atsScore?.overallScore || 0}%
                        </span>
                        <span className="history-score-label">ATS Score</span>
                      </div>

                      <div className="history-score-item">
                        <span className="history-score-val" style={{ color: item.jdMatch?.score ? getScoreColor(item.jdMatch.score) : 'var(--text-muted)' }}>
                          {item.jdMatch?.score !== undefined ? `${item.jdMatch.score}%` : 'N/A'}
                        </span>
                        <span className="history-score-label">JD Match</span>
                      </div>
                    </div>

                    <div className="history-actions">
                      <button className="btn-history-view" onClick={() => handleView(item._id)}>
                        View Report
                      </button>
                      <button 
                        className="btn-history-delete" 
                        onClick={(e) => handleDelete(item._id, e)}
                        aria-label="Delete report"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
