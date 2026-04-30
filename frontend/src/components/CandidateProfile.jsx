import { User } from 'lucide-react';

const scoreColor = (s) => s >= 70 ? 'fill-success' : s >= 40 ? 'fill-warning' : 'fill-error';
const scoreClass = (s) => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low';

export default function CandidateProfile({ data }) {
  if (!data) return null;
  const d = data;
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon"><User size={24} color="var(--primary)" /></div>
        <div>
          <div className="card-title">Candidate Profile</div>
          <div className="card-subtitle">Extracted from your resume</div>
        </div>
      </div>

      <div className="info-row"><span className="info-key">Name</span><span className="info-val">{d.name || 'N/A'}</span></div>
      <div className="info-row"><span className="info-key">Email</span><span className="info-val">{d.email || 'N/A'}</span></div>
      <div className="info-row"><span className="info-key">Phone</span><span className="info-val">{d.phone || 'N/A'}</span></div>
      <div className="info-row"><span className="info-key">Education</span><span className="info-val">{d.education || 'N/A'}</span></div>
      <div className="info-row"><span className="info-key">Experience Level</span><span className="info-val">{d.experienceLevel || 'N/A'}</span></div>
      <div className="info-row"><span className="info-key">Years of Exp.</span><span className="info-val">{d.yearsOfExperience || 'N/A'}</span></div>

      {(d.technicalSkills || []).length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="input-label">Technical Skills</div>
          <div className="chip-group">{(d.technicalSkills || []).map(s => <span key={s} className="chip chip-blue">{s}</span>)}</div>
        </div>
      )}
      {(d.softSkills || []).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="input-label">Soft Skills</div>
          <div className="chip-group">{(d.softSkills || []).map(s => <span key={s} className="chip chip-gray">{s}</span>)}</div>
        </div>
      )}
      {(d.strengths || []).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="input-label">Strengths</div>
          <div className="chip-group">{(d.strengths || []).map(s => <span key={s} className="chip chip-green">{s}</span>)}</div>
        </div>
      )}
      {(d.weaknesses || []).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div className="input-label">Areas to Improve</div>
          <div className="chip-group">{(d.weaknesses || []).map(s => <span key={s} className="chip chip-red">{s}</span>)}</div>
        </div>
      )}
    </div>
  );
}
