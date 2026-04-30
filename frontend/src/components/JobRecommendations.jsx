import { Briefcase, Target, Calendar, Folder } from 'lucide-react';

const scoreColor = (s) => s >= 70 ? '#16A34A' : s >= 40 ? '#CA8A04' : '#DC2626';
const scoreClass = (s) => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low';
const fillColor = (s) => s >= 70 ? 'fill-success' : s >= 40 ? 'fill-warning' : 'fill-error';

export default function JobRecommendations({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><Briefcase size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Top 5 Job Recommendations</div>
          <div className="card-subtitle">AI-matched roles based on your resume</div>
        </div>
      </div>

      {data.map((job, i) => (
        <div key={i} className="job-card">
          <div className="job-card-header">
            <div className="job-title">#{i + 1} {job.title}</div>
            <div className="match-badge" style={{ background: scoreColor(job.matchScore) + '20', color: scoreColor(job.matchScore) }}>
              {job.matchScore}% Match
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-track">
              <div className={`progress-fill ${fillColor(job.matchScore)}`} style={{ width: `${job.matchScore}%` }} />
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>{job.explanation}</p>

          {(job.matchingSkills || []).length > 0 && (
            <div className="chip-group">
              {(job.matchingSkills || []).map(s => <span key={s} className="chip chip-green">{s}</span>)}
            </div>
          )}

          {job.breakdown && (
            <div className="breakdown-row">
              <span className="breakdown-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Target size={12} /> Skills: {job.breakdown.skillsMatch}%</span>
              <span className="breakdown-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> Experience: {job.breakdown.experienceMatch}%</span>
              <span className="breakdown-item" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Folder size={12} /> Projects: {job.breakdown.projectRelevance}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
